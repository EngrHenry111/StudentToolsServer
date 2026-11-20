import axios from "axios";
import crypto from "crypto";
import CourseApproval from "../models/CourseApproval.js";
import CourseOrder from "../models/CourseOrder.js";
import transporter from "../config/mailer.js";

// Course payments go to the main StudentToolsNG Paystack account (the
// same PAYSTACK_SECRET_KEY as Pro) — no publisher split. That account's
// single webhook URL is the Pro webhook, which hands "course" events to
// markCourseOrderPaid below. Unlocking never depends on the webhook
// though: the course page verifies pending orders on return.
const PAYSTACK_URL = "https://api.paystack.co";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const CLIENT_URL = process.env.CLIENT_URL || "https://studenttoolsng.com";

// Prefer the marketplace key: it's the one proven to work live for
// one-time purchases (no subaccount passed here, so the full amount
// settles to the main account). PAYSTACK_COURSE_SECRET_KEY overrides both.
export const courseSecretKey = () =>
  process.env.PAYSTACK_COURSE_SECRET_KEY ||
  process.env.PAYSTACK_MARKETPLACE_SECRET_KEY ||
  process.env.PAYSTACK_SECRET_KEY;

const paystackHeaders = () => ({
  Authorization: `Bearer ${courseSecretKey()}`,
  "Content-Type": "application/json"
});

const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const escapeHtml = (str = "") => String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);

export const newClaimToken = () => crypto.randomBytes(24).toString("hex");

// ---------------------------------------------------------------- access

// The single "can this user watch this course?" answer.
// Returns { hasAccess, type: "approved" | "paid" | null, needsClaim }.
// needsClaim = their email is approved but the account hasn't proven it
// owns that email yet (open the emailed link, or use Google Sign-In).
export const getCourseAccess = async (user, course) => {
  if (!user) return { hasAccess: false, type: null, needsClaim: false };

  const email = (user.email || "").toLowerCase();
  const approval = await CourseApproval.findOne({ course: course._id, email });

  if (approval) {
    const claimedByThisUser = approval.claimedBy && approval.claimedBy.equals(user._id);
    if (claimedByThisUser || user.isVerified) {
      if (!approval.claimedBy) {
        // Google-verified user: record the claim so admin sees it.
        await CourseApproval.updateOne(
          { _id: approval._id, claimedBy: null },
          { claimedBy: user._id, claimedAt: new Date() }
        );
      }
      return { hasAccess: true, type: "approved", needsClaim: false };
    }
  }

  if (await findPaidOrder(user._id, course._id)) {
    return { hasAccess: true, type: "paid", needsClaim: false };
  }

  return { hasAccess: false, type: null, needsClaim: Boolean(approval) };
};

// ---------------------------------------------------------------- payments

export const initializeCoursePayment = async ({ email, amountKobo, reference, callbackUrl, metadata }) => {
  const res = await axios.post(
    `${PAYSTACK_URL}/transaction/initialize`,
    { email, amount: amountKobo, reference, callback_url: callbackUrl, metadata },
    { headers: paystackHeaders() }
  );
  return res.data.data; // { authorization_url, reference }
};

export const verifyTransaction = async (reference) => {
  const res = await axios.get(
    `${PAYSTACK_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    { headers: paystackHeaders() }
  );
  return res.data.data;
};

// The only place an order flips to completed. The status filter makes it
// atomic, so webhook + verify racing can't both send a receipt.
export const markCourseOrderPaid = async (reference) => {
  const order = await CourseOrder.findOneAndUpdate(
    { paystackReference: reference, status: { $ne: "completed" } },
    { status: "completed", paidAt: new Date() },
    { returnDocument: "after" }
  );
  if (order) sendPaymentReceipt(order);
  return order;
};

// Asks Paystack directly — never trust a client or webhook body for money.
export const confirmCourseOrder = async (order) => {
  if (order.status === "completed") return true;

  let tx;
  try {
    tx = await verifyTransaction(order.paystackReference);
  } catch (err) {
    console.error("VERIFY COURSE TRANSACTION ERROR:", err.response?.data || err.message);
    return false;
  }

  if (tx?.status === "success" && Number(tx.amount) === order.amount) {
    await markCourseOrderPaid(order.paystackReference);
    return true;
  }

  const staleAbandoned =
    tx?.status === "abandoned" && Date.now() - new Date(order.createdAt).getTime() > ONE_DAY_MS;
  if (tx?.status === "failed" || staleAbandoned) {
    await CourseOrder.updateOne({ _id: order._id, status: "pending" }, { status: "failed" });
  }
  return false;
};

export const findPaidOrder = async (userId, courseId) => {
  const completed = await CourseOrder.findOne({ user: userId, course: courseId, status: "completed" });
  if (completed) return completed;

  const pending = await CourseOrder.find({
    user: userId,
    course: courseId,
    status: "pending",
    createdAt: { $gte: new Date(Date.now() - 7 * ONE_DAY_MS) }
  }).sort({ createdAt: -1 }).limit(3);

  for (const order of pending) {
    if (await confirmCourseOrder(order)) return CourseOrder.findById(order._id);
  }
  return null;
};

// ---------------------------------------------------------------- emails
// Fire-and-forget: an email failure never blocks access or payment.

export const sendApprovalEmail = (approval, course) => {
  const claimUrl = `${CLIENT_URL}/courses/${course.slug}?claim=${approval.claimToken}`;

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: approval.email,
    subject: `You've been given access: ${course.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:560px;">
        <h2 style="color:#2563eb;">Your class videos are ready 🎓</h2>
        <p>You've been approved for free, lifetime access to <strong>${escapeHtml(course.title)}</strong> on StudentToolsNG.</p>
        <ol style="line-height:1.7;">
          <li>Click the button below.</li>
          <li>Create an account (or log in, if you already have one) using <strong>this email address: ${escapeHtml(approval.email)}</strong>. You'll be brought back to the course and your access activates automatically.</li>
        </ol>
        <p><a href="${claimUrl}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Activate my access</a></p>
        <p style="color:#64748b;font-size:13px;">Don't share this link — it's tied to your email address.</p>
      </div>
    `
  })
    .then(() => CourseApproval.updateOne({ _id: approval._id }, { lastEmailedAt: new Date() }))
    .catch((err) => console.error("COURSE APPROVAL EMAIL FAILED:", err.message));
};

const sendPaymentReceipt = (order) => {
  CourseOrder.findById(order._id)
    .populate("user", "username email")
    .populate("course", "title slug")
    .then((o) => {
      if (!o?.user?.email || !o.course) return;
      return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: o.user.email,
        subject: `Payment confirmed: ${o.course.title}`,
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;">
            <h2 style="color:#2563eb;">Payment confirmed ✅</h2>
            <p>Hi ${escapeHtml(o.user.username)}, you now have lifetime access to <strong>${escapeHtml(o.course.title)}</strong>.</p>
            <p>Amount: ₦${(o.amount / 100).toLocaleString()}<br/>Reference: ${escapeHtml(o.paystackReference)}</p>
            <p><a href="${CLIENT_URL}/courses/${o.course.slug}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Start watching</a></p>
          </div>
        `
      });
    })
    .catch((err) => console.error("COURSE RECEIPT EMAIL FAILED:", err.message));
};
