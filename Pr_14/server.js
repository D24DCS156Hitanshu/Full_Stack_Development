import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'resume-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter for PDF only (validate MIME type and extension)
const fileFilter = (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf';
    const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';
    if (isPdfMime && isPdfExt) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files up to 2MB are allowed (PDF required).'), false);
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    },
    fileFilter: fileFilter
});

app.use(express.static('public'));

// Upload route
app.post('/upload', upload.single('resume'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ message: 'File uploaded successfully!' });
});

// Global error handler for uploads
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size should not exceed 2MB' });
        }
        return res.status(400).json({ error: error.message });
    }
    return res.status(400).json({ error: error.message || 'Upload failed' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
