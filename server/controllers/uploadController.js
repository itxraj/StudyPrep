import Document from '../models/Document.js';
import pdfParse from 'pdf-parse';

export const uploadPDF = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { originalname, buffer } = req.file;
        const pdfData = await pdfParse(buffer);
        const extractedText = pdfData.text;

        if (!extractedText || extractedText.trim().length < 50) {
            return res.status(400).json({ message: 'Could not extract enough readable text from this PDF. It may be scanned/images or empty.' });
        }

        const document = await Document.create({
            userId: req.user._id,
            fileName: originalname,
            extractedText,
        });

        res.status(201).json({
            message: 'File uploaded and parsed successfully',
            documentId: document._id,
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error processing PDF file' });
    }
};

export const getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user._id })
            .select('-extractedText') // Exclude text to save bandwidth
            .sort({ uploadDate: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
