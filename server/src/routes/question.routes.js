import { Router } from "express";
import { createQuestion, getAllQuestions, deleteQuestion } from "../controllers/question.controller.js";
const router = Router();
router.post("/create", createQuestion);
router.delete("/delete/:id", deleteQuestion);
router.get("/", getAllQuestions);
export default router;