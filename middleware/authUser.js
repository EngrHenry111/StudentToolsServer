import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the access token AND loads the real user from the DB,
// so every controller downstream gets a real Mongoose document
// (with .email, .isPremium, .save(), etc.) on req.user — not just
// the raw {id, username} JWT payload.
const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // full Mongoose document
    req.tokenPayload = decoded; // raw payload, in case a controller needs it

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authUser;



// // import jwt from "jsonwebtoken";

// // const authUser = (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //       return res.status(401).json({ message: "No token provided" });
// //     }

// //     const token = authHeader.split(" ")[1];

// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);

// //     req.user = decoded; // { id, username }

// //     next();

// //   } catch (err) {
// //     return res.status(401).json({ message: "Invalid token" });
// //   }
// // };

// // export default authUser;
// import jwt from "jsonwebtoken";

// const authUser = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // { id, username }

//     next();

//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

// export default authUser;