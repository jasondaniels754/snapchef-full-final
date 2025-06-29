import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRouter from './routes/generate.js';
import chatRouter from './routes/chat.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4008;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SnapChef Backend is running!' });
});

app.use('/api/generate', generateRouter);
app.use('/api/chat', chatRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
