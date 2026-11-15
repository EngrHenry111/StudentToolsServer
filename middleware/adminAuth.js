import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

// 🔒 SECURITY: user and admin tokens are signed with the same JWT_SECRET,
// so a valid signature alone does NOT prove the caller is an admin — any
// logged-in student's token used to pass this check. The token's id must
// belong to a real Admin document.
const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id).select("_id email");
    if (!admin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default adminAuth;
