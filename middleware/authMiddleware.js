import crypto from "crypto";

/*
Admin authentication middleware (shared-secret style)
Protects simpler admin routes like cgpa/math config management.
*/
const authMiddleware = (req, res, next) => {

 const adminKey = req.headers["x-admin-key"];

 if (!adminKey || !process.env.ADMIN_SECRET) {
  return res.status(401).json({
   message: "Admin key missing"
  });
 }

 // 🔒 SECURITY: use a timing-safe comparison instead of !== so the
 // response time can't be used to guess the secret one character at a
 // time. Buffers must be equal length first, or timingSafeEqual throws.
 const provided = Buffer.from(adminKey);
 const expected = Buffer.from(process.env.ADMIN_SECRET);

 const isValid =
  provided.length === expected.length &&
  crypto.timingSafeEqual(provided, expected);

 if (!isValid) {
  return res.status(401).json({
   message: "Invalid admin key"
  });
 }

 next();
};

export default authMiddleware;
