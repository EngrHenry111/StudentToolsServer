import CourseApproval from "../models/CourseApproval.js";
import TechCourse from "../models/TechCourse.js";
import transporter from "../config/mailer.js";
import { newClaimToken, escapeHtml } from "./courseAccessService.js";

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

export const sendAcceptedEmail = async (application, program) => {
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
        <p>You now have free access to the class videos. Log in to StudentToolsNG with <strong>${escapeHtml(application.email)}</strong> and the password you created when you registered.</p>
        ${links}
        <p style="color:#64748b;font-size:13px;">Forgot your password? Use "Forgot password" on the login page.</p>
      </div>
    `
  });
};
