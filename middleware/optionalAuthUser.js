import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Like authUser, but never rejects the request — a public listing page
// must render (with just the free preview) for a logged-out visitor,
// while a logged-in purchaser on the exact same URL needs req.user set
// so the controller can check for a completed order. Any missing/invalid/
// expired token simply falls through with req.user left null; only a
// PRESENT and VALID token populates it.
const optionalAuthUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    req.user = user || null;
  } catch {
    req.user = null;
  }

  next();
};

export default optionalAuthUser;
