import express from 'express';
import multer from 'multer';
import { uploadPDF, getUserDocuments } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
    .post(protect, upload.single('file'), uploadPDF)
    .get(protect, getUserDocuments);

export default router;
