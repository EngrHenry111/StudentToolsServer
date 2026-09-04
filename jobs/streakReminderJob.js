import cron from "node-cron";
import User from "../models/User.js";
import QuizProgress from "../models/QuizProgress.js";
import transporter from "../config/mailer.js";

const OVERALL_TOPIC = "__overall__";

// This is the first genuinely scheduled/background piece of work in the
// app — everything else has deliberately run synchronously within a
// request. A simple daily cron job (no Redis, no queue, just node-cron
// running inside the already-always-on server process — kept alive by
// the UptimeRobot ping already set up) is the right amount of
// infrastructure for this need, not a full job-queue system.
const sendStreakReminders = async () => {
  console.log("Running daily streak reminder job...");

  const today = new Date().toDateString();

  try {
    const users = await User.find({
      "notificationPreferences.streakReminders": true,
      isVerified: true
    }).select("_id username email");

    let sent = 0;

    for (const user of users) {
      const progress = await QuizProgress.findOne({ userId: user._id, topic: OVERALL_TOPIC });

      // Only remind students who have an existing streak worth protecting
      // AND haven't already been active today — no point nagging someone
      // who's already studied, or someone with no streak to lose yet.
      if (!progress || progress.streak < 1) continue;

      const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate).toDateString() : null;
      if (lastActive === today) continue;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `🔥 Don't lose your ${progress.streak}-day streak!`,
          html: `
            <div style="font-family:Arial,sans-serif;padding:20px;">
              <h2 style="color:#2563eb;">Your streak is waiting, ${user.username} 👋</h2>
              <p>You're on a <strong>${progress.streak}-day streak</strong> — take a quick quiz today to keep it alive.</p>
              <p><a href="https://studenttoolsng.com/pro/dashboard" style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;">Continue My Streak</a></p>
              <p style="font-size:12px;color:#888;">You can turn off these reminders anytime in your account settings.</p>
            </div>
          `
        });
        sent++;
      } catch (emailErr) {
        console.error(`Failed to send streak reminder to ${user.email}:`, emailErr.message);
      }
    }

    console.log(`Streak reminder job complete. Sent ${sent} reminder(s).`);

  } catch (err) {
    console.error("STREAK REMINDER JOB ERROR:", err);
  }
};

// Runs once a day at 6:00 PM WAT (server time — confirm your Render
// instance's timezone, or adjust the cron string if it's UTC).
export const startScheduledJobs = () => {
  cron.schedule("0 18 * * *", sendStreakReminders);
  console.log("Scheduled jobs started (daily streak reminders at 18:00).");
};

// Exported separately so it can be triggered manually for testing
// without waiting for the actual scheduled time.
export { sendStreakReminders };
