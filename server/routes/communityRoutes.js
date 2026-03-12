import express from 'express';
import Flashcards from '../models/Flashcard.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get public flashcard decks
router.get('/decks', async (req, res) => {
    try {
        const decks = await Flashcards.find({ isPublic: true })
            .populate('userId', 'name')
            .sort({ 'likes.length': -1, createdAt: -1 }); // Sort by popularity
        res.json(decks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public decks', error: error.message });
    }
});

// Toggle Like on a deck
router.post('/decks/:id/like', protect, async (req, res) => {
    try {
        const deck = await Flashcards.findById(req.params.id);
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        const userId = req.user._id;
        if (deck.likes.includes(userId)) {
            deck.likes = deck.likes.filter(id => id.toString() !== userId.toString());
        } else {
            deck.likes.push(userId);
        }
        await deck.save();
        res.json({ likes: deck.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Error liking deck', error: error.message });
    }
});

// Toggle Publish State
router.post('/decks/:id/publish', protect, async (req, res) => {
    try {
        const deck = await Flashcards.findById(req.params.id);
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        if (deck.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        deck.isPublic = !deck.isPublic;
        await deck.save();
        res.json({ isPublic: deck.isPublic });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling publish state', error: error.message });
    }
});

export default router;
