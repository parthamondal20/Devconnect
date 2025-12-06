import { Router } from "express";
import { createQuestion, getAllQuestions, deleteQuestion, handleVote } from "../controllers/Question.controller.js";
const router = Router();
router.post("/create", createQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/", getAllQuestions);
router.post("/vote/:id", handleVote);
export default router;