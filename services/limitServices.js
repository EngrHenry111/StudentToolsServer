const usageMap = new Map();

export const checkLimit = (username) => {
  const today = new Date().toDateString();

  if (!usageMap.has(username)) {
    usageMap.set(username, { date: today, count: 0 });
  }

  const user = usageMap.get(username);

  // reset daily
  if (user.date !== today) {
    user.date = today;
    user.count = 0;
  }

  // limit check
  if (user.count >= 20) {
    throw new Error("Daily AI limit reached");
  }

  // increment usage
  user.count += 1;
};