import express from 'express';
import { generateQuiz, generateFlashcards, getQuizzes, getFlashcards } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/quiz', protect, generateQuiz);
router.post('/flashcards', protect, generateFlashcards);

router.get('/quizzes', protect, getQuizzes);
router.get('/flashcards', protect, getFlashcards);

export default router;
