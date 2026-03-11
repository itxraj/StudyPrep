import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    fileName: { type: String, required: true },
    extractedText: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
