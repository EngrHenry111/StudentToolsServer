import Listing from "../models/Listing.js";
import Publisher from "../models/Publisher.js";
import { uploadBufferToCloudinary } from "../services/cloudinaryUpload.js";

// Every function below resolves the caller's OWN Publisher first, then
// scopes every Listing query to { publisher: publisher._id } — the same
// findOne({_id, owner}) isolation rigor as materialController.js, so one
// publisher can never read, edit or delete another publisher's listings.
const getOwnPublisherOrFail = async (userId, res) => {
  const publisher = await Publisher.findOne({ user: userId });
  if (!publisher) {
    res.status(404).json({ message: "No publisher workspace found" });
    return null;
  }
  return publisher;
};

export const createListing = async (req, res) => {
  try {
    const publisher = await getOwnPublisherOrFail(req.user._id, res);
    if (!publisher) return;

    const { title, field, keywords, previewContent, fullContent, price, status } = req.body;

    if (!title || !field || !previewContent || !fullContent || price == null) {
      return res.status(400).json({
        message: "title, field, previewContent, fullContent and price are required"
      });
    }

    let coverImageUrl = null;
    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, "marketplace-covers");
      coverImageUrl = uploaded.secure_url;
    }

    const listing = await Listing.create({
      publisher: publisher._id,
      title,
      field,
      keywords: Array.isArray(keywords)
        ? keywords
        : String(keywords || "").split(",").map((k) => k.trim()).filter(Boolean),
      previewContent,
      fullContent,
      price: Number(price),
      coverImageUrl,
      status: status === "published" ? "published" : "draft"
    });

    res.status(201).json(listing);
  } catch (err) {
    console.error("CREATE LISTING ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyListings = async (req, res) => {
  try {
    const publisher = await getOwnPublisherOrFail(req.user._id, res);
    if (!publisher) return;

    const listings = await Listing.find({ publisher: publisher._id })
      .select("-fullContent")
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyListingById = async (req, res) => {
  try {
    const publisher = await getOwnPublisherOrFail(req.user._id, res);
    if (!publisher) return;

    const listing = await Listing.findOne({ _id: req.params.id, publisher: publisher._id });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json(listing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const publisher = await getOwnPublisherOrFail(req.user._id, res);
    if (!publisher) return;

    const listing = await Listing.findOne({ _id: req.params.id, publisher: publisher._id });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const { title, field, keywords, previewContent, fullContent, price, status } = req.body;

    if (title !== undefined) listing.title = title;
    if (field !== undefined) listing.field = field;
    if (keywords !== undefined) {
      listing.keywords = Array.isArray(keywords)
        ? keywords
        : String(keywords || "").split(",").map((k) => k.trim()).filter(Boolean);
    }
    if (previewContent !== undefined) listing.previewContent = previewContent;
    if (fullContent !== undefined) listing.fullContent = fullContent;
    if (price !== undefined) listing.price = Number(price);
    if (status !== undefined && ["draft", "published", "suspended"].includes(status)) {
      listing.status = status;
    }

    if (req.file) {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, "marketplace-covers");
      listing.coverImageUrl = uploaded.secure_url;
    }

    await listing.save();
    res.json(listing);
  } catch (err) {
    console.error("UPDATE LISTING ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const publisher = await getOwnPublisherOrFail(req.user._id, res);
    if (!publisher) return;

    const listing = await Listing.findOneAndDelete({ _id: req.params.id, publisher: publisher._id });
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
