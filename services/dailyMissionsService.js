import DailyMissionLog from "../models/DailyMissionLog.js";

const todayString = () => new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

// Fixed mission definitions for v1 — not admin-configurable yet, matches
// the same "lightweight now, deepen later" pattern used elsewhere.
// Each mission's `check` reads today's log and returns true/false.
export const MISSIONS = [
  {
    id: "quiz_taken",
    title: "Complete a quiz today",
    xp: 15,
    check: (log) => log.quizzesCompleted >= 1
  },
  {
    id: "ten_questions",
    title: "Answer 10 questions today",
    xp: 20,
    check: (log) => log.questionsAnswered >= 10
  },
  {
    id: "high_score",
    title: "Score 80%+ on any quiz today",
    xp: 25,
    check: (log) => log.bestScorePercent >= 80
  }
];

// Gets (or creates) today's log for a user — called both when recording
// new activity and when just checking status for display.
export const getTodaysLog = async (userId) => {
  const date = todayString();
  let log = await DailyMissionLog.findOne({ user: userId, date });

  if (!log) {
    log = await DailyMissionLog.create({ user: userId, date });
  }

  return log;
};

// Called from quiz submission — records today's activity and returns
// any missions that were JUST completed as a result (so the frontend
// can show a "+15 XP: Mission complete!" toast if it wants to).
export const recordQuizActivity = async (userId, { questionsAnswered, correctCount, totalQuestions }) => {
  const log = await getTodaysLog(userId);

  log.questionsAnswered += questionsAnswered;
  log.quizzesCompleted += 1;

  const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  if (scorePercent > log.bestScorePercent) {
    log.bestScorePercent = scorePercent;
  }

  const newlyCompleted = [];

  for (const mission of MISSIONS) {
    const alreadyClaimed = log.claimedMissions.includes(mission.id);
    if (!alreadyClaimed && mission.check(log)) {
      log.claimedMissions.push(mission.id);
      newlyCompleted.push({ id: mission.id, title: mission.title, xp: mission.xp });
    }
  }

  await log.save();

  const totalXPEarned = newlyCompleted.reduce((sum, m) => sum + m.xp, 0);

  return { newlyCompleted, totalXPEarned };
};

// For the "My Missions" display — today's status of every mission,
// whether completed or not.
export const getMissionsStatus = async (userId) => {
  const log = await getTodaysLog(userId);

  return MISSIONS.map((m) => ({
    id: m.id,
    title: m.title,
    xp: m.xp,
    completed: log.claimedMissions.includes(m.id)
  }));
};
