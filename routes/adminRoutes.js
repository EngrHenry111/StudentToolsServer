import express from "express";
import { adminLogin, getAdminStats } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login",adminLogin);
router.get("/stats", getAdminStats);


export default router;
