import {Router} from "express";
import askAi from "../controllers/chatbot.controller.js";
const router =Router();
router.post("/chat",askAi);
export default router;