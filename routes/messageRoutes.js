import express from "express";

import {
 sendMessage,
 getMessages
} from "../controllers/messageController.js";

const router = express.Router();

/* SEND MESSAGE */
router.post("/", sendMessage);

/* GET ALL MESSAGES */
router.get("/", getMessages);

export default router;