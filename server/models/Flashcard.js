import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    front: { type: String, required: true },
    back: { type: String, required: true },
});

const flashcardSetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true,
    },
    cards: [flashcardSchema],
    createdAt: { type: Date, default: Date.now },
});

const Flashcards = mongoose.model('Flashcards', flashcardSetSchema);
export default Flashcards;
