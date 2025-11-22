import { Router } from "express";
const router = Router();
import { sendMessage, getUserConversationById, createConversation, getUserConversations } from "../controllers/conversation.controller.js";

router.post("/create", createConversation);
router.get("/conversations", getUserConversations);
router.post("/send", sendMessage);
router.get("/:conversationId", getUserConversationById);

export default router;