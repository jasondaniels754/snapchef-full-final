import { Recipe } from '../types/recipe';

const BACKEND_URL = 'https://snapchef-full-final.onrender.com';

export const generateRecipe = async (
  difficulty: string,
  cuisine: string,
  numIngredients: number
): Promise<Recipe> => {
  console.log('Generating recipe via backend API:', { difficulty, cuisine, numIngredients });

  try {
    const response = await fetch(`${BACKEND_URL}/generate-recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty,
        genre: cuisine, // Backend expects 'genre' instead of 'cuisine'
        numIngredients,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend API Error:', errorData);
      throw new Error(`Backend API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend API response:', data);

    // Parse the content from the backend response
    const content = data.content;
    console.log('Recipe content from backend:', content);

    // Extract recipe information from the content
    // The backend returns a text description, so we'll parse it
    const lines = content.split('\n').filter(line => line.trim());
    
    // Find the title (usually the first line)
    const title = lines[0] || 'Untitled Recipe';
    
    // Find ingredients (look for lines that might contain ingredients)
    const ingredients: string[] = [];
    const instructions: string[] = [];
    let inIngredients = false;
    let inInstructions = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toLowerCase().includes('ingredients') || trimmedLine.toLowerCase().includes('ingredient')) {
        inIngredients = true;
        inInstructions = false;
        continue;
      }
      if (trimmedLine.toLowerCase().includes('instructions') || trimmedLine.toLowerCase().includes('steps') || trimmedLine.toLowerCase().includes('directions')) {
        inIngredients = false;
        inInstructions = true;
        continue;
      }
      
      if (inIngredients && trimmedLine && !trimmedLine.toLowerCase().includes('ingredients')) {
        // Clean up ingredient line
        const cleanIngredient = trimmedLine.replace(/^[-•*]\s*/, '').trim();
        if (cleanIngredient) {
          ingredients.push(cleanIngredient);
        }
      }
      
      if (inInstructions && trimmedLine && !trimmedLine.toLowerCase().includes('instructions')) {
        // Clean up instruction line
        const cleanInstruction = trimmedLine.replace(/^\d+\.\s*/, '').trim();
        if (cleanInstruction) {
          instructions.push(cleanInstruction);
        }
      }
    }

    // Create a valid Recipe object
    const recipe: Recipe = {
      id: Date.now().toString(),
      title: title.replace(/^#+\s*/, '').trim(), // Remove markdown headers
      description: `A delicious ${difficulty.toLowerCase()} ${cuisine} recipe with ${numIngredients} main ingredients.`,
      ingredients: ingredients.length > 0 ? ingredients : [`${numIngredients} main ingredients`],
      instructions: instructions.length > 0 ? instructions : ['Follow the recipe instructions carefully.'],
      difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
      cuisine: cuisine,
      prepTime: difficulty === 'Easy' ? 15 : difficulty === 'Medium' ? 30 : 45,
      cookTime: difficulty === 'Easy' ? 20 : difficulty === 'Medium' ? 35 : 60,
      servings: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Final recipe object:', JSON.stringify(recipe, null, 2));
    return recipe;
  } catch (error) {
    console.error('Error generating recipe via backend:', error);
    throw error;
  }
}; 