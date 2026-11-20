import CourseApproval from "../models/CourseApproval.js";
import TechCourse from "../models/TechCourse.js";
import transporter from "../config/mailer.js";
import Program from "../models/Program.js";
import ProgramApplication from "../models/ProgramApplication.js";
import { newClaimToken, escapeHtml, verifyTransaction } from "./courseAccessService.js";

const CLIENT_URL = process.env.CLIENT_URL || "https://studenttoolsng.com";

export const programHeading = (p) => [p.sponsorName, p.title].filter(Boolean).join(" ");

// Accepting an application approves its email on every course linked to the
// programme, already claimed by the applicant's own account — the account
// the form created or logged in with — so access works immediately, with no
// claim link.
// Returns the note written on the approvals; keep it on the application so
// revoking later finds them even if the programme was renamed meanwhile.
export const grantProgramAccess = async (application, program) => {
  const note = `${programHeading(program)} · ${application.batch}`.slice(0, 200);
  for (const courseId of program.courses || []) {
    await CourseApproval.updateOne(
      { course: courseId, email: application.email },
      {
        $set: { claimedBy: application.user, claimedAt: new Date() },
        $setOnInsert: { note, claimToken: newClaimToken() }
      },
      { upsert: true }
    );
  }
  return note;
};

// Undo an acceptance: remove the approvals this programme created for that
// account. Approvals the admin added by hand on the course page (a different
// note) are left alone.
export const revokeProgramAccess = async (application, program) => {
  if (!application.accessNote) return;
  const note = application.accessNote;
  await CourseApproval.deleteMany({
    course: { $in: program.courses || [] },
    email: application.email,
    note
  });
};

// Accepted on a paid form but not paid yet = no course access.
export const awaitingPayment = (a) => a.status === "accepted" && a.feeKobo > 0 && !a.paidAt;

export const naira = (kobo) => `₦${(Number(kobo || 0) / 100).toLocaleString("en-NG")}`;

// Ask Paystack whether `reference` paid this application's fee. On the
// first confirmation: mark paid, open the courses, email the student.
// Never trusts the client or a webhook body, only Paystack's verify API.
export const confirmProgramPayment = async (application, reference) => {
  if (!reference) return false;
  if (application.paidAt) return true;
  let tx;
  try {
    tx = await verifyTransaction(reference);
  } catch (err) {
    console.error("VERIFY PROGRAM PAYMENT ERROR:", err.response?.data || err.message);
    return false;
  }
  const forThisApp = String(tx?.metadata?.applicationId || "") === String(application._id);
  if (tx?.status !== "success" || !forThisApp || Number(tx.amount) < application.feeKobo) return false;

  // Atomic: the webhook and a page-load check racing can't both grant + email.
  const paid = await ProgramApplication.findOneAndUpdate(
    { _id: application._id, paidAt: null },
    { paidAt: new Date(), payRef: reference, amountPaid: Number(tx.amount) },
    { returnDocument: "after" }
  );
  if (!paid) return true;
  application.paidAt = paid.paidAt;

  const program = await Program.findById(paid.program);
  if (program && paid.status === "accepted") {
    paid.accessNote = await grantProgramAccess(paid, program);
    await paid.save();
    sendAcceptedEmail(paid, program)
      .then(() => ProgramApplication.updateOne({ _id: paid._id }, { acceptedEmailAt: new Date(), emailError: "" }))
      .catch((e) => ProgramApplication.updateOne({ _id: paid._id }, { emailError: String(e.message).slice(0, 300) }));
  }
  return true;
};

const button = (href, text) =>
  `<p><a href="${href}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">${text}</a></p>`;

export const sendAcceptedEmail = async (application, program) => {
  if (awaitingPayment(application)) {
    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: `You've been accepted: ${programHeading(program)} (pay to start)`,
      html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:560px;">
        <h2 style="color:#2563eb;">You've been accepted 🎉</h2>
        <p>Hi ${escapeHtml(application.fullName)}, your registration for <strong>${escapeHtml(programHeading(program))}</strong> (${escapeHtml(application.batch)}) has been accepted.</p>
        <p>To start, pay the training fee of <strong>${naira(application.feeKobo)}</strong>. Your class videos open automatically as soon as the payment goes through.</p>
        ${button(`${CLIENT_URL}/programs/${program.slug}`, `Pay ${naira(application.feeKobo)} and start`)}
        <p>Log in with <strong>${escapeHtml(application.email)}</strong> and the password you created when you registered.</p>
        <p style="color:#64748b;font-size:13px;">Forgot your password? Use "Forgot password" on the login page.</p>
      </div>
    `
    });
  }

  const courses = await TechCourse.find({ _id: { $in: program.courses || [] }, isPublished: true }).select("title slug");
  const links = courses.length
    ? courses.map((c) =>
        `<p><a href="${CLIENT_URL}/courses/${c.slug}" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Start: ${escapeHtml(c.title)}</a></p>`
      ).join("")
    : `<p><a href="${CLIENT_URL}/courses">${CLIENT_URL}/courses</a></p>`;

  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: application.email,
    subject: `You've been accepted: ${programHeading(program)}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px;max-width:560px;">
        <h2 style="color:#2563eb;">Welcome to ${escapeHtml(programHeading(program))} 🎉</h2>
        <p>Hi ${escapeHtml(application.fullName)}, your registration for <strong>${escapeHtml(application.batch)}</strong> has been accepted.</p>
        ${application.paidAt ? `<p>We have received your payment of <strong>${naira(application.amountPaid || application.feeKobo)}</strong>. Thank you!</p>` : ""}
        <p>You now have ${application.paidAt ? "" : "free "}access to the class videos. Log in to StudentToolsNG with <strong>${escapeHtml(application.email)}</strong> and the password you created when you registered.</p>
        ${links}
        <p style="color:#64748b;font-size:13px;">Forgot your password? Use "Forgot password" on the login page.</p>
      </div>
    `
  });
};
