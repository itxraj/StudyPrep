import express from 'express';
import Room from '../models/Room.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find()
            .populate('activeMembers', 'name')
            .populate('createdBy', 'name');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching rooms', error: error.message });
    }
});

// Create a room
router.post('/', protect, async (req, res) => {
    try {
        const { name, subject } = req.body;
        const newRoom = await Room.create({
            name,
            subject,
            createdBy: req.user._id,
            activeMembers: [req.user._id]
        });
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(500).json({ message: 'Error creating room', error: error.message });
    }
});

// Join a room (Add user to active members)
router.post('/:id/join', protect, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (!room.activeMembers.includes(req.user._id)) {
            room.activeMembers.push(req.user._id);
            await room.save();
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error joining room', error: error.message });
    }
});

// Leave a room (Remove user from active members)
router.post('/:id/leave', protect, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        room.activeMembers = room.activeMembers.filter(memberId => memberId.toString() !== req.user._id.toString());
        await room.save();

        res.json(room);
    } catch (error) {
        res.status(500).json({ message: 'Error leaving room', error: error.message });
    }
});

// Fetch messages for a room
import Message from '../models/Message.js';
router.get('/:id/messages', protect, async (req, res) => {
    try {
        const messages = await Message.find({ roomId: req.params.id }).sort('timestamp');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
});

// Post a message in a room
router.post('/:id/messages', protect, async (req, res) => {
    try {
        const message = await Message.create({
            roomId: req.params.id,
            senderId: req.user._id,
            senderName: req.user.name,
            text: req.body.text
        });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error posting message', error: error.message });
    }
});

// Delete a room
router.delete('/:id', protect, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        await Room.findByIdAndDelete(req.params.id);
        // Also delete all messages for this room
        await Message.deleteMany({ roomId: req.params.id });
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting room', error: error.message });
    }
});

export default router;
