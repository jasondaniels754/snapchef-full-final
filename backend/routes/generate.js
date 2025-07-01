import express from 'express';
import { generateRecipes, generateRecipeFromIngredients } from '../controllers/generateController.js';

const router = express.Router();

router.post('/', generateRecipes);
router.post('/from-ingredients', generateRecipeFromIngredients);

export default router;
