import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Like authUser, but never rejects the request — a public listing page
// must render (with just the free preview) for a logged-out visitor,
// while a logged-in purchaser on the exact same URL needs req.user set
// so the controller can check for a completed order. A missing/invalid
// token falls through with req.user left null. An EXPIRED token is the
// one exception: it gets the same 401 TOKEN_EXPIRED as authUser, so the
// client silently refreshes and retries — otherwise a buyer whose 15-min
// access token lapsed would quietly see the locked preview again.
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
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
    }
    req.user = null;
  }

  next();
};

export default optionalAuthUser;
