import Publisher from "../models/Publisher.js";
import MarketplaceOrder from "../models/MarketplaceOrder.js";
import PlatformSettings, { getPlatformSettings } from "../models/PlatformSettings.js";
import {
  resolveAccountNumber,
  createSubaccount,
  listBanks
} from "../services/marketplacePaystackService.js";
import { reconcilePendingOrders } from "../services/marketplaceOrderService.js";

// ---------------- PUBLIC-ISH (any logged-in user) ----------------

export const getBanks = async (req, res) => {
  try {
    const banks = await listBanks();
    res.json(banks.map((b) => ({ name: b.name, code: b.code })));
  } catch (err) {
    console.error("LIST BANKS ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "Could not load bank list" });
  }
};

// ---------------- ONBOARDING ----------------

export const registerPublisher = async (req, res) => {
  try {
    const { businessName, description, bankName, bankCode, accountNumber } = req.body;

    if (!businessName || !bankName || !bankCode || !accountNumber) {
      return res.status(400).json({
        message: "businessName, bankName, bankCode and accountNumber are required"
      });
    }

    // Enforced at the schema level too (unique: true on `user`) — this
    // check just gives a clear, friendly error instead of a raw duplicate
    // key error.
    const existing = await Publisher.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        message: "You already have a publisher workspace",
        slug: existing.slug
      });
    }

    // 1. Resolve the account — confirms it's real and gets the true
    // account holder's name back, so the publisher can't fake whose
    // account it is.
    let resolved;
    try {
      resolved = await resolveAccountNumber(accountNumber, bankCode);
    } catch (err) {
      console.error("RESOLVE ACCOUNT ERROR:", err.response?.data || err.message);
      return res.status(400).json({
        message:
          err.response?.data?.message ||
          "Could not verify this bank account. Please check the account number and bank, then try again."
      });
    }

    // 2. Create the Paystack subaccount using the RESOLVED name, at the
    // platform's current default commission rate.
    const settings = await getPlatformSettings();

    let subaccount;
    try {
      subaccount = await createSubaccount({
        businessName,
        bankCode,
        accountNumber,
        accountName: resolved.account_name,
        commissionRate: settings.defaultCommissionRate
      });
    } catch (err) {
      console.error("CREATE SUBACCOUNT ERROR:", err.response?.data || err.message);
      return res.status(400).json({
        message:
          err.response?.data?.message ||
          "Could not set up your payout account with Paystack. Please try again."
      });
    }

    // 3. Create the Publisher — active immediately, no admin review step.
    const publisher = await Publisher.create({
      user: req.user._id,
      businessName,
      description: description || "",
      bankName,
      bankCode,
      accountNumber,
      accountName: resolved.account_name,
      paystackSubaccountCode: subaccount.subaccount_code,
      status: "active",
      commissionRate: settings.defaultCommissionRate
    });

    res.status(201).json({
      message: "Publisher workspace created",
      publisher
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You already have a publisher workspace" });
    }
    console.error("REGISTER PUBLISHER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ---------------- WORKSPACE (owner-only) ----------------

// Used both by the dashboard "Become a Publisher" banner (to check
// whether the current user already has a workspace) and by the
// RequirePublisher route guard on the client.
export const getMyProfile = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ user: req.user._id });

    if (!publisher) {
      return res.status(404).json({ message: "No publisher workspace found" });
    }

    res.json(publisher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOverview = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ user: req.user._id });
    if (!publisher) {
      return res.status(404).json({ message: "No publisher workspace found" });
    }

    await reconcilePendingOrders({ publisher: publisher._id });

    const [recentOrders, totalSalesAgg] = await Promise.all([
      MarketplaceOrder.find({ publisher: publisher._id, status: "completed" })
        .populate("listing", "title slug")
        .sort({ purchasedAt: -1 })
        .limit(10),
      MarketplaceOrder.aggregate([
        { $match: { publisher: publisher._id, status: "completed" } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalEarnings: { $sum: "$publisherAmount" }
          }
        }
      ])
    ]);

    const totals = totalSalesAgg[0] || { totalOrders: 0, totalEarnings: 0 };

    res.json({
      publisher,
      recentOrders,
      totalOrders: totals.totalOrders,
      totalEarnings: totals.totalEarnings
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ user: req.user._id });
    if (!publisher) {
      return res.status(404).json({ message: "No publisher workspace found" });
    }

    await reconcilePendingOrders({ publisher: publisher._id });

    const orders = await MarketplaceOrder.find({ publisher: publisher._id })
      .populate("listing", "title slug")
      .populate("buyer", "username")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- ADMIN: platform commission settings ----------------

export const adminGetSettings = async (req, res) => {
  try {
    const settings = await getPlatformSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const adminUpdateSettings = async (req, res) => {
  try {
    const { defaultCommissionRate } = req.body;

    const rate = Number(defaultCommissionRate);
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) {
      return res.status(400).json({ message: "defaultCommissionRate must be a number between 0 and 100" });
    }

    // Deliberately does NOT touch any existing Publisher.commissionRate —
    // this only changes the rate new registrations will pick up.
    const settings = await PlatformSettings.findOneAndUpdate(
      { key: "global" },
      { defaultCommissionRate: rate },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
