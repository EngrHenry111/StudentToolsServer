// import User from "../models/User.js";

// const checkSubscription = async (req, res, next) => {
//   try {

//     const user = await User.findById(req.user.id);

//     // allow active subscription
//     if (user.subscriptionStatus === "active") {
//       return next();
//     }

//     // FREE LIMIT
//     if (!user.freeQuizCount) {
//       user.freeQuizCount = 0;
//     }

//     // reset daily
//     const today = new Date().toDateString();

//     if (
//       !user.lastQuizDate ||
//       new Date(user.lastQuizDate).toDateString() !== today
//     ) {
//       user.freeQuizCount = 0;
//       user.lastQuizDate = new Date();
//     }

//     // FREE DAILY LIMIT
//     if (user.freeQuizCount >= 20) {
//       return res.status(403).json({
//         message: "Free limit exhausted. Subscribe to continue."
//       });
//     }

//     user.freeQuizCount += 1;

//     await user.save();

//     next();

//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };

// export default checkSubscription;

import User from "../models/User.js";

const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // ✅ premium users
    if (user.isPremium) {
      return next();
    }

    // ✅ allow small free usage during development
    if (!user.aiQuizAttempts) {
      user.aiQuizAttempts = 0;
    }

    if (user.aiQuizAttempts >= 5) {
      return res.status(403).json({
        message: "Free limit exhausted. Subscribe to continue."
      });
    }

    user.aiQuizAttempts += 1;
    await user.save();

    next();

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};

export default checkSubscription;