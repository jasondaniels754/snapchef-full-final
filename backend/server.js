import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRouter from './routes/generate.js';
import chatRouter from './routes/chat.js';
import analyzeImageRouter from './routes/analyze-image.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4008;
const HOST = '0.0.0.0';



app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SnapChef Backend is running!' });
});

app.use('/api/generate', generateRouter);
app.use('/api/chat', chatRouter);
app.use('/api/analyze-image', analyzeImageRouter);

// The error handler must be registered before any other error middleware and after all controllers


app.listen(PORT, HOST, () => console.log(`Server running on ${HOST}:${PORT}`));
