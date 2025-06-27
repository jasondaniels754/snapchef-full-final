import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRecipes(req, res) {
  try {
    const { difficulty, genre, numIngredients } = req.body;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef who specializes in creating delicious recipes.'
        },
        {
          role: 'user',
          content: `Generate a ${difficulty.toLowerCase()} ${genre} recipe using ${numIngredients} main ingredients. Include a title, ingredients list, and detailed step-by-step instructions.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content.trim();
    res.json({ content });
  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}
