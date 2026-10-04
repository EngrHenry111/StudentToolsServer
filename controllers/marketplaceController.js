import crypto from "crypto";
import Publisher from "../models/Publisher.js";
import Listing from "../models/Listing.js";
import MarketplaceOrder from "../models/MarketplaceOrder.js";
import Review from "../models/Review.js";
import { initializeMarketplaceTransaction } from "../services/marketplacePaystackService.js";
import { findOwnedOrder } from "../services/marketplaceOrderService.js";

// Where Paystack sends the buyer back after paying.
const CLIENT_URL = process.env.CLIENT_URL || "https://studenttoolsng.com";

// Fields a listing CARD needs (library, storefront, related sections) —
// never the (large) preview/full content.
const CARD_FIELDS = "title slug field price coverImageUrl salesCount views ratingAverage ratingCount publisher createdAt";

// Crawlers and the Prerender service fetch listing pages too; counting
// them would make every listing look viewed.
const BOT_UA = /bot|crawl|spider|slurp|prerender|headless|lighthouse|facebookexternalhit|whatsapp/i;

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const activePublisherIds = async () =>
  (await Publisher.find({ status: "active" }).select("_id").lean()).map((p) => p._id);

// ---------------- PUBLIC: Research Library (search/browse) ----------------
//
// GET /marketplace/listings?q=&field=&page= — every published listing from
// an active publisher, searchable by title/field/keywords.
export const searchListings = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim().slice(0, 100);
    const field = String(req.query.field || "").trim().slice(0, 100);
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const PAGE_SIZE = 24;

    const base = { status: "published", publisher: { $in: await activePublisherIds() } };
    const filter = { ...base };

    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ title: rx }, { field: rx }, { keywords: rx }];
    }
    if (field) {
      filter.field = new RegExp(`^${escapeRegex(field)}$`, "i");
    }

    const [listings, total, rawFields] = await Promise.all([
      Listing.find(filter)
        .select(CARD_FIELDS)
        .populate("publisher", "businessName slug")
        .sort(q ? { salesCount: -1, createdAt: -1 } : { createdAt: -1 })
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Listing.countDocuments(filter),
      Listing.distinct("field", base)
    ]);

    // Fields are free text typed by publishers ("ENGINEERING",
    // "Engineering") — collapse case-duplicates for the filter chips.
    const seen = new Map();
    rawFields.forEach((f) => {
      const key = f.trim().toLowerCase();
      if (key && !seen.has(key)) seen.set(key, f.trim());
    });

    res.json({
      listings,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
      fields: [...seen.values()].sort((a, b) => a.localeCompare(b))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- AUTHENTICATED: reviews (buyers only) ----------------

export const submitReview = async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim().slice(0, 1000);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be a whole number from 1 to 5" });
    }

    const listing = await Listing.findOne({ _id: req.params.id, status: "published" });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const order = await findOwnedOrder(req.user._id, listing._id);
    if (!order) {
      return res.status(403).json({ message: "Only buyers of this document can review it" });
    }

    const review = await Review.findOneAndUpdate(
      { listing: listing._id, buyer: req.user._id },
      { rating, comment },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    const [agg] = await Review.aggregate([
      { $match: { listing: listing._id } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    await Listing.updateOne(
      { _id: listing._id },
      {
        ratingAverage: agg ? Math.round(agg.avg * 10) / 10 : 0,
        ratingCount: agg ? agg.count : 0
      }
    );

    res.json({
      review: { rating: review.rating, comment: review.comment, updatedAt: review.updatedAt },
      ratingAverage: agg ? Math.round(agg.avg * 10) / 10 : 0,
      ratingCount: agg ? agg.count : 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- PUBLIC: storefront ----------------

export const getPublisherStorefront = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ slug: req.params.slug, status: "active" });
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }

    const listings = await Listing.find({ publisher: publisher._id, status: "published" })
      .select(CARD_FIELDS)
      .sort({ createdAt: -1 });

    res.json({ publisher, listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- PUBLIC: listing detail (optional auth) ----------------
//
// Task 6, enforced here: previewContent always comes back. fullContent is
// only ever ATTACHED to the response object when the requester has a
// completed order for this exact listing — otherwise the key is simply
// never set, not just hidden by the client.
export const getListingBySlug = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ slug: req.params.slug, status: "active" });
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }

    const listing = await Listing.findOne({
      publisher: publisher._id,
      slug: req.params.listingSlug,
      status: "published"
    });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Count the view unless it's the publisher checking their own page
    // or a crawler.
    const isOwner = Boolean(req.user && String(publisher.user) === String(req.user._id));
    const isBot = BOT_UA.test(req.get("user-agent") || "");
    let views = listing.views || 0;
    if (!isOwner && !isBot) {
      await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });
      views += 1;
    }

    const payload = {
      _id: listing._id,
      title: listing.title,
      field: listing.field,
      keywords: listing.keywords,
      previewContent: listing.previewContent,
      price: listing.price,
      coverImageUrl: listing.coverImageUrl,
      salesCount: listing.salesCount,
      views,
      ratingAverage: listing.ratingAverage,
      ratingCount: listing.ratingCount,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      publisher: {
        businessName: publisher.businessName,
        slug: publisher.slug
      }
    };

    // Reviews + "more from this publisher" + "related" (same field, other
    // active publishers) — all public, fetched in parallel.
    const fieldRx = new RegExp(`^${escapeRegex(listing.field.trim())}$`, "i");
    const [reviews, moreFromPublisher, related] = await Promise.all([
      Review.find({ listing: listing._id })
        .populate("buyer", "username")
        .sort({ updatedAt: -1 })
        .limit(20)
        .lean(),
      Listing.find({ publisher: publisher._id, status: "published", _id: { $ne: listing._id } })
        .select(CARD_FIELDS)
        .populate("publisher", "businessName slug")
        .sort({ salesCount: -1, createdAt: -1 })
        .limit(4)
        .lean(),
      activePublisherIds().then((ids) =>
        Listing.find({
          status: "published",
          field: fieldRx,
          publisher: { $in: ids.filter((id) => String(id) !== String(publisher._id)) }
        })
          .select(CARD_FIELDS)
          .populate("publisher", "businessName slug")
          .sort({ salesCount: -1, createdAt: -1 })
          .limit(4)
          .lean()
      )
    ]);

    payload.reviews = reviews.map((r) => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      username: r.buyer?.username || "Buyer",
      updatedAt: r.updatedAt,
      mine: Boolean(req.user && r.buyer && String(r.buyer._id) === String(req.user._id))
    }));
    payload.moreFromPublisher = moreFromPublisher;
    payload.related = related;

    let owned = false;

    if (req.user) {
      // Also confirms any pending order with Paystack on the spot — this
      // is what unlocks the page right after the buyer is redirected back.
      const order = await findOwnedOrder(req.user._id, listing._id);

      if (order) {
        owned = true;
        // Standard proof-of-purchase practice: a visible watermark tying
        // this exact copy back to the purchase, so a downloaded/copied
        // document is traceable. Appended at response time (never stored
        // on the listing itself) so it always reflects the real buyer.
        // fullContent is plain text (the client renders it as text, never
        // HTML), so the watermark is its own trailing paragraph.
        const watermark = `\n\n———\nPurchased by ${req.user.username} on ${order.purchasedAt.toDateString()}. For personal use only — do not redistribute.`;
        payload.fullContent = listing.fullContent + watermark;
      }
    }

    res.json({ ...payload, owned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- AUTHENTICATED: purchase ----------------

export const initiatePurchase = async (req, res) => {
  try {
    const { listingId } = req.body;

    if (!listingId) {
      return res.status(400).json({ message: "listingId is required" });
    }

    const listing = await Listing.findOne({ _id: listingId, status: "published" });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const publisher = await Publisher.findOne({ _id: listing.publisher, status: "active" });
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }

    // Don't let someone re-buy a listing they already own — cheap
    // server-side guard, independent of the UI hiding the button.
    // findOwnedOrder also catches a paid-but-still-pending order, so a
    // buyer whose unlock hadn't registered yet can't be charged twice.
    const alreadyOwned = await findOwnedOrder(req.user._id, listing._id);
    if (alreadyOwned) {
      return res.status(400).json({ message: "You already own this listing" });
    }

    const platformCommission = Math.round((listing.price * publisher.commissionRate) / 100);
    const publisherAmount = listing.price - platformCommission;

    const reference = `mkt_${crypto.randomBytes(12).toString("hex")}`;

    const order = await MarketplaceOrder.create({
      buyer: req.user._id,
      listing: listing._id,
      publisher: publisher._id,
      amount: listing.price,
      publisherAmount,
      platformCommission,
      paystackReference: reference,
      status: "pending"
    });

    let transaction;
    try {
      transaction = await initializeMarketplaceTransaction({
        email: req.user.email,
        amountKobo: listing.price,
        subaccountCode: publisher.paystackSubaccountCode,
        reference,
        callbackUrl: `${CLIENT_URL}/publishers/${publisher.slug}/${listing.slug}`,
        metadata: {
          orderId: order._id.toString(),
          listingId: listing._id.toString(),
          buyerId: req.user._id.toString(),
          type: "marketplace"
        }
      });
    } catch (err) {
      console.error("INITIALIZE MARKETPLACE TRANSACTION ERROR:", err.response?.data || err.message);
      order.status = "failed";
      await order.save();
      return res.status(500).json({ message: "Could not start payment. Please try again." });
    }

    res.json({
      authorization_url: transaction.authorization_url,
      reference
    });
  } catch (err) {
    console.error("INITIATE PURCHASE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- AUTHENTICATED: buyer's purchases ----------------

export const getMyPurchases = async (req, res) => {
  try {
    const orders = await MarketplaceOrder.find({ buyer: req.user._id, status: "completed" })
      .populate("listing", "title slug field coverImageUrl")
      .populate("publisher", "businessName slug")
      .sort({ purchasedAt: -1 });

    res.json(
      orders
        .filter((o) => o.listing && o.publisher)
        .map((o) => ({
          _id: o._id,
          amount: o.amount,
          purchasedAt: o.purchasedAt,
          listing: o.listing,
          publisher: o.publisher
        }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
