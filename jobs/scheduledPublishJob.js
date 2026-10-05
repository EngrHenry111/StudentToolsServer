import cron from "node-cron";
import Tutorial from "../models/tutorialModel.js";

// Publishes drafts whose publishAt time has passed. Runs hourly and once at
// startup, so a restart or redeploy catches up on anything that fell due
// while the server was down. Public queries keep filtering on
// status: "published", so nothing else needs to know about scheduling.
export const publishDueTutorials = async () => {
  try {
    const result = await Tutorial.updateMany(
      { status: "draft", publishAt: { $lte: new Date() } },
      { $set: { status: "published" } }
    );

    if (result.modifiedCount) {
      console.log(`Scheduled publish: ${result.modifiedCount} tutorial(s) went live.`);
    }

    return result.modifiedCount;
  } catch (err) {
    console.error("SCHEDULED PUBLISH JOB ERROR:", err);
    return 0;
  }
};

export const startScheduledPublishing = () => {
  cron.schedule("5 * * * *", publishDueTutorials);
  publishDueTutorials();
  console.log("Scheduled tutorial publishing started (hourly).");
};
