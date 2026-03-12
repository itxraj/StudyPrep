import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    activeMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    timerState: {
        mode: { type: String, enum: ['work', 'break', 'paused'], default: 'paused' },
        timeLeft: { type: Number, default: 25 * 60 },
        isRunning: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
