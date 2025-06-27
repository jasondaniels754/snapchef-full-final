import { Recipe } from '../types/recipe';
import Constants from 'expo-constants';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY;

export const generateRecipe = async (
  difficulty: string,
  cuisine: string,
  numIngredients: number
): Promise<Recipe> => {
  if (!API_KEY) {
    console.error('API Key not found in environment variables');
    throw new Error('OpenAI API key not found');
  }

  const prompt = `Generate a recipe with the following specifications:
- Difficulty: ${difficulty}
- Cuisine: ${cuisine}
- Number of ingredients: ${numIngredients}

Please provide the recipe in the following JSON format:
{
  "title": "Recipe Title",
  "description": "Brief description of the recipe",
  "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs"],
  "instructions": ["Preheat oven to 350°F", "Mix dry ingredients", "Add wet ingredients"],
  "prepTime": 30,
  "cookTime": 45,
  "servings": 4,
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}"
}`;

  console.log('Sending API request with prompt:', prompt);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional chef and recipe generator. Generate detailed, accurate recipes. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API response:', JSON.stringify(data, null, 2));

    const content = data.choices[0].message.content;
    console.log('Raw content from API:', content);

    let recipeContent;
    try {
      recipeContent = JSON.parse(content);
      console.log('Parsed recipe content:', JSON.stringify(recipeContent, null, 2));
    } catch (parseError) {
      console.error('Error parsing recipe content:', parseError);
      throw new Error('Failed to parse recipe content');
    }

    // Create a valid Recipe object
    const recipe: Recipe = {
      id: Date.now().toString(),
      title: recipeContent.title || 'Untitled Recipe',
      description: recipeContent.description || '',
      ingredients: Array.isArray(recipeContent.ingredients) ? recipeContent.ingredients : [],
      instructions: Array.isArray(recipeContent.instructions) ? recipeContent.instructions : [],
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
      cuisine: cuisine,
      prepTime: Number(recipeContent.prepTime) || 0,
      cookTime: Number(recipeContent.cookTime) || 0,
      servings: Number(recipeContent.servings) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Final recipe object:', JSON.stringify(recipe, null, 2));
    return recipe;
  } catch (error) {
    console.error('Error generating recipe:', error);
    throw error;
  }
}; 