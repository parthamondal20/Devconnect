import { Router } from "express";
const router = Router();
import { sendMessage, getUserConversations, createConversation } from "../controllers/conversation.controller.js";

router.post("/create", createConversation);
router.get("/:conversationId", getUserConversations);
router.post("/send", sendMessage);

export default router;