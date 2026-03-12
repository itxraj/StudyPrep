import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import roomRoutes from './routes/roomRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import progressRoutes from './routes/progressRoutes.js';

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Vite default port
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/progress', progressRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', (data) => {
        if (typeof data === 'string') {
            socket.join(data);
            console.log(`User ${socket.id} joined room ${data}`);
        } else {
            const { roomId, user } = data;
            socket.join(roomId);
            console.log(`User ${socket.id} (${user?.name}) joined room ${roomId}`);
            if (user) {
                socket.to(roomId).emit('user-joined', user);
            }
            socket.to(roomId).emit('request-timer-sync');
        }
    });

    socket.on('leave-room', (data) => {
        if (typeof data === 'string') {
            socket.leave(data);
            console.log(`User ${socket.id} left room ${data}`);
        } else {
            const { roomId, userId } = data;
            socket.leave(roomId);
            console.log(`User ${socket.id} (${userId}) left room ${roomId}`);
            if (userId) {
                socket.to(roomId).emit('user-left', userId);
            }
        }
    });

    socket.on('send-message', (data) => {
        // data: { roomId, message }
        // Use socket.to to exclude sender (they already added it optimistically)
        socket.to(data.roomId).emit('receive-message', data);
    });

    socket.on('timer-sync', (data) => {
        // data: { roomId, timerState }
        socket.to(data.roomId).emit('timer-update', data.timerState);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
