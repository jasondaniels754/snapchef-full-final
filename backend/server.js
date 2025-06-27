import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import generateRouter from './routes/generate.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4008;

app.use(cors());
app.use(express.json());
app.use('/generate-recipes', generateRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
