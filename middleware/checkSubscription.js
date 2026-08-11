// Gates the AI-powered quiz routes: premium users pass through freely,
// free users get a limited number of AI quiz attempts.
// Runs AFTER authUser, so req.user is already a full Mongoose document.

const FREE_AI_ATTEMPTS = 5;

const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // premium users have unlimited access
    if (user.isPremium) {
      return next();
    }

    if (!user.aiQuizAttempts) {
      user.aiQuizAttempts = 0;
    }

    if (user.aiQuizAttempts >= FREE_AI_ATTEMPTS) {
      return res.status(403).json({
        message: "Free AI quiz limit reached. Subscribe to Pro for unlimited access.",
        code: "SUBSCRIPTION_REQUIRED",
        remaining: 0,
        limit: FREE_AI_ATTEMPTS
      });
    }

    user.aiQuizAttempts += 1;
    await user.save();

    res.set("X-AI-Attempts-Remaining", String(FREE_AI_ATTEMPTS - user.aiQuizAttempts));

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default checkSubscription;


// // import User from "../models/User.js";

// // const checkSubscription = async (req, res, next) => {
// //   try {

// //     const user = await User.findById(req.user.id);

// //     // allow active subscription
// //     if (user.subscriptionStatus === "active") {
// //       return next();
// //     }

// //     // FREE LIMIT
// //     if (!user.freeQuizCount) {
// //       user.freeQuizCount = 0;
// //     }

// //     // reset daily
// //     const today = new Date().toDateString();

// //     if (
// //       !user.lastQuizDate ||
// //       new Date(user.lastQuizDate).toDateString() !== today
// //     ) {
// //       user.freeQuizCount = 0;
// //       user.lastQuizDate = new Date();
// //     }

// //     // FREE DAILY LIMIT
// //     if (user.freeQuizCount >= 20) {
// //       return res.status(403).json({
// //         message: "Free limit exhausted. Subscribe to continue."
// //       });
// //     }

// //     user.freeQuizCount += 1;

// //     await user.save();

// //     next();

// //   } catch (err) {
// //     res.status(500).json({
// //       message: err.message
// //     });
// //   }
// // };

// // export default checkSubscription;

// import User from "../models/User.js";

// const checkSubscription = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id);

//     // ✅ premium users
//     if (user.isPremium) {
//       return next();
//     }

//     // ✅ allow small free usage during development
//     if (!user.aiQuizAttempts) {
//       user.aiQuizAttempts = 0;
//     }

//     if (user.aiQuizAttempts >= 5) {
//       return res.status(403).json({
//         message: "Free limit exhausted. Subscribe to continue."
//       });
//     }

//     user.aiQuizAttempts += 1;
//     await user.save();

//     next();

//   } catch (err) {
//     res.status(500).json({
//       message: err.message
//     });
//   }
// };

// export default checkSubscription;