import express from 'express';
import User from '../models/User.js';
import StudySession from '../models/StudySession.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user progress
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('dailyGoals currentStreak lastStudyDate');

        // Sum today's sessions
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todaySessions = await StudySession.find({
            userId: req.user._id,
            date: { $gte: startOfDay }
        });

        const todayProgress = todaySessions.reduce((acc, session) => ({
            studyMinutes: acc.studyMinutes + (session.durationMinutes || 0),
            flashcardsReviewed: acc.flashcardsReviewed + (session.flashcardsReviewed || 0),
            quizzesCompleted: acc.quizzesCompleted + (session.quizzesCompleted || 0)
        }), { studyMinutes: 0, flashcardsReviewed: 0, quizzesCompleted: 0 });

        res.json({
            goals: user.dailyGoals,
            streak: user.currentStreak,
            today: todayProgress
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
});

// Log Study Session
router.post('/session', protect, async (req, res) => {
    try {
        const { durationMinutes, flashcardsReviewed, quizzesCompleted } = req.body;

        const session = await StudySession.create({
            userId: req.user._id,
            durationMinutes: durationMinutes || 0,
            flashcardsReviewed: flashcardsReviewed || 0,
            quizzesCompleted: quizzesCompleted || 0
        });

        // Update streak logic
        const user = await User.findById(req.user._id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!user.lastStudyDate) {
            user.currentStreak = 1;
            user.lastStudyDate = today;
        } else {
            const lastStudy = new Date(user.lastStudyDate);
            lastStudy.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(today - lastStudy);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.currentStreak += 1;
                user.lastStudyDate = today;
            } else if (diffDays > 1) {
                user.currentStreak = 1; // Reset streak
                user.lastStudyDate = today;
            }
        }
        await user.save();

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error logging session', error: error.message });
    }
});

export default router;
