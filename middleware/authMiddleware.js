/*
Admin authentication middleware
Protects admin routes like tutorial upload
*/
const authMiddleware = (req, res, next) => {

 const adminKey = req.headers["x-admin-key"];

 if (!adminKey) {
  return res.status(401).json({
   message: "Admin key missing"
  });
 }

 if (adminKey !== process.env.ADMIN_SECRET) {
  return res.status(401).json({
   message: "Invalid admin key"
  });
 }

 next();
};

export default authMiddleware;