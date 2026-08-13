import express from "express";
import { adminLogin, getAdminStats } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/stats", adminAuth, getAdminStats); // 🔒 was completely unprotected


export default router;
