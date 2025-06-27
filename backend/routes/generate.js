import express from 'express';
import { generateRecipes } from '../controllers/generateController.js';

const router = express.Router();

router.post('/', generateRecipes);

export default router;
