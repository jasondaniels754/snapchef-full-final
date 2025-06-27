import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRecipes(req, res) {
  try {
    const { 
      difficulty, 
      cuisine, 
      numIngredients, 
      diet = 'None', 
      cookTime = 30, 
      servings = 4 
    } = req.body;
    
    // Validate required parameters
    if (!difficulty || !cuisine || !numIngredients) {
      return res.status(400).json({ 
        error: 'Missing required parameters: difficulty, cuisine, numIngredients' 
      });
    }

    // Round cookTime to nearest 15, 30, 45, or 60
    const roundedCookTime = Math.round(cookTime / 15) * 15;
    const finalCookTime = Math.min(Math.max(roundedCookTime, 15), 60);

    // Build the enhanced prompt
    const prompt = `Generate a ${difficulty} ${diet} ${cuisine} recipe that serves ${servings} people and uses no more than ${numIngredients} main ingredients. The total cook time should be around ${finalCookTime} minutes. Include a title, ingredients list with quantities, and clear step-by-step instructions.

Please provide the recipe in the following JSON format:
{
  "title": "Recipe Title",
  "description": "Brief description of the recipe",
  "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs"],
  "instructions": ["Preheat oven to 350°F", "Mix dry ingredients", "Add wet ingredients"],
  "prepTime": 30,
  "cookTime": ${finalCookTime},
  "servings": ${servings},
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}",
  "diet": "${diet}"
}`;

    console.log('Sending enhanced prompt to OpenAI:', prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef and recipe generator. Generate detailed, accurate recipes. Always respond with valid JSON in the exact format requested.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = response.choices[0].message.content.trim();
    console.log('OpenAI response:', content);

    // Try to parse the JSON response
    let recipeData;
    try {
      recipeData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON from OpenAI:', parseError);
      console.error('Raw content:', content);
      
      // Fallback: return the text content as before
      return res.json({ content });
    }

    // Validate the parsed recipe data
    const validatedRecipe = {
      title: recipeData.title || 'Untitled Recipe',
      description: recipeData.description || `A delicious ${difficulty.toLowerCase()} ${cuisine} recipe`,
      ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [],
      instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [],
      prepTime: Number(recipeData.prepTime) || 15,
      cookTime: Number(recipeData.cookTime) || finalCookTime,
      servings: Number(recipeData.servings) || servings,
      difficulty: recipeData.difficulty || difficulty,
      cuisine: recipeData.cuisine || cuisine,
      diet: recipeData.diet || diet
    };

    console.log('Validated recipe data:', validatedRecipe);
    res.json(validatedRecipe);

  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({ error: 'Failed to generate recipe', details: error.message });
  }
}
