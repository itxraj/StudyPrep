import Document from '../models/Document.js';
import Quiz from '../models/Quiz.js';
import Flashcards from '../models/Flashcard.js';
import User from '../models/User.js';
import { generateQuizService, generateFlashcardsService } from '../services/aiService.js';

// Plan limits: total AI generations allowed (quizzes + flashcards combined)
const PLAN_LIMITS = {
    free: 1,
    pro: 50,
    unlimited: Infinity,
};

const checkGenerationLimit = async (userId) => {
    const user = await User.findById(userId);
    const plan = user.plan || 'free';
    const limit = PLAN_LIMITS[plan] ?? 1;
    const quizCount = await Quiz.countDocuments({ userId });
    const flashcardCount = await Flashcards.countDocuments({ userId });
    const totalUsed = quizCount + flashcardCount;
    return { allowed: totalUsed < limit, totalUsed, limit, plan };
};

export const generateQuiz = async (req, res) => {
    try {
        const { documentId } = req.body;
        const document = await Document.findOne({ _id: documentId, userId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found or unauthorized' });
        }

        // Check plan limit
        const { allowed } = await checkGenerationLimit(req.user._id);
        if (!allowed) {
            return res.status(403).json({
                message: 'You\'ve used your free AI generation. Upgrade your plan to create more quizzes and flashcards.',
                limitReached: true,
            });
        }

        const questionsParams = req.body.numQuestions || 10;
        const questionsJson = await generateQuizService(document.extractedText, questionsParams);

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            questions: questionsJson
        });

        res.status(201).json(quiz);
    } catch (error) {
        console.error("Generate Quiz Error:", error);
        res.status(500).json({ message: 'Error generating quiz with AI' });
    }
};

export const generateFlashcards = async (req, res) => {
    try {
        const { documentId } = req.body;
        const document = await Document.findOne({ _id: documentId, userId: req.user._id });

        if (!document) {
            return res.status(404).json({ message: 'Document not found or unauthorized' });
        }

        // Check plan limit
        const { allowed } = await checkGenerationLimit(req.user._id);
        if (!allowed) {
            return res.status(403).json({
                message: 'You\'ve used your free AI generation. Upgrade your plan to create more quizzes and flashcards.',
                limitReached: true,
            });
        }

        const cardsParams = req.body.numCards || 5;
        const cardsJson = await generateFlashcardsService(document.extractedText, cardsParams);

        const flashcards = await Flashcards.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cardsJson
        });

        res.status(201).json(flashcards);
    } catch (error) {
        console.error("Generate Flashcards Error:", error);
        res.status(500).json({ message: 'Error generating flashcards with AI' });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFlashcards = async (req, res) => {
    try {
        const flashcardSets = await Flashcards.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(flashcardSets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
