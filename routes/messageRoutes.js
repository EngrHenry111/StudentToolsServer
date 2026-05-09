import express from "express";

import {
 sendMessage,
 getMessages,
 deleteMessage
} from "../controllers/messageController.js";

const router = express.Router();

/* SEND MESSAGE */
router.post("/", sendMessage);

/* GET ALL MESSAGES */
router.get("/", getMessages);

/* DELETE MESSAGE */
router.delete("/:id", deleteMessage);

export default router;