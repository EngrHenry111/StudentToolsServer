export const calculateXP = (results) => {
  let xp = 0;

  results.forEach(r => {
    if (r.isCorrect) xp += 10;      // reward correct answer
    else xp += 2;                   // small reward for attempt
  });

  return xp;
};

export const calculateLevel = (xp) => {
  // simple level formula
  return Math.floor(xp / 100) + 1;
};


export const updateStreak = (user) => {
  const today = new Date().toDateString();
  const last = user.lastActiveDate
    ? new Date(user.lastActiveDate).toDateString()
    : null;

  if (!last) {
    user.streak = 1;
  } else if (last === today) {
    // already played today → no change
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (last === yesterday.toDateString()) {
      user.streak += 1; // continue streak
    } else {
      user.streak = 1;  // reset streak
    }
  }

  user.lastActiveDate = new Date();
};