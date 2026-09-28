import crypto from "crypto";
import Publisher from "../models/Publisher.js";
import Listing from "../models/Listing.js";
import MarketplaceOrder from "../models/MarketplaceOrder.js";
import { initializeMarketplaceTransaction } from "../services/marketplacePaystackService.js";
import { findOwnedOrder } from "../services/marketplaceOrderService.js";

// Where Paystack sends the buyer back after paying.
const CLIENT_URL = process.env.CLIENT_URL || "https://studenttoolsng.com";

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (str = "") => String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

// ---------------- PUBLIC: storefront ----------------

export const getPublisherStorefront = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ slug: req.params.slug, status: "active" });
    if (!publisher) {
      return res.status(404).json({ message: "Publisher not found" });
    }

    const listings = await Listing.find({ publisher: publisher._id, status: "published" })
      .select("-fullContent")
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

    const payload = {
      _id: listing._id,
      title: listing.title,
      field: listing.field,
      keywords: listing.keywords,
      previewContent: listing.previewContent,
      price: listing.price,
      coverImageUrl: listing.coverImageUrl,
      salesCount: listing.salesCount,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
      publisher: {
        businessName: publisher.businessName,
        slug: publisher.slug
      }
    };

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
        // fullContent is HTML, so the watermark is too (escaped — username
        // is user-controlled).
        const watermark = `<hr /><p><em>Purchased by ${escapeHtml(req.user.username)} on ${order.purchasedAt.toDateString()}. For personal use only — do not redistribute.</em></p>`;
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
