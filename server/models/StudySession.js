import mongoose from 'mongoose';

const studySessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    durationMinutes: { type: Number, default: 0 },
    flashcardsReviewed: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 }
});

const StudySession = mongoose.model('StudySession', studySessionSchema);
export default StudySession;
