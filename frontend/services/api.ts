import { Recipe } from '../types/recipe';

const BACKEND_URL = 'https://snapchef-full-final.onrender.com';

export const generateRecipe = async (
  difficulty: string,
  cuisine: string,
  numIngredients: number,
  diet: string = 'None',
  cookTime: number = 30,
  servings: number = 4
): Promise<Recipe> => {
  console.log('Generating recipe via backend API:', { 
    difficulty, 
    cuisine, 
    numIngredients, 
    diet, 
    cookTime, 
    servings 
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        difficulty,
        cuisine,
        numIngredients,
        diet,
        cookTime,
        servings,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API Error Response:', errorText);
      throw new Error(`Backend API request failed with status ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response text was:', responseText);
      throw new Error('Backend returned invalid JSON');
    }

    console.log('Backend API response:', data);

    // Check if the response is in the new JSON format or old text format
    if (data.title && data.ingredients && data.instructions) {
      // New JSON format - use the data directly
      const recipe: Recipe = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description || `A delicious ${difficulty.toLowerCase()} ${cuisine} recipe`,
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        instructions: Array.isArray(data.instructions) ? data.instructions : [],
        difficulty: data.difficulty as 'Easy' | 'Medium' | 'Hard' || difficulty as 'Easy' | 'Medium' | 'Hard',
        cuisine: data.cuisine || cuisine,
        prepTime: Number(data.prepTime) || 15,
        cookTime: Number(data.cookTime) || cookTime,
        servings: Number(data.servings) || servings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Final recipe object (JSON format):', JSON.stringify(recipe, null, 2));
      return recipe;
    } else if (data.content) {
      // Old text format - parse the content as before
      const content = data.content;
      console.log('Recipe content from backend (text format):', content);

      // Extract recipe information from the content
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
        servings: servings,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('Final recipe object (text format):', JSON.stringify(recipe, null, 2));
      return recipe;
    } else {
      throw new Error('Backend returned unexpected response format');
    }
  } catch (error) {
    console.error('Error generating recipe via backend:', error);
    throw error;
  }
};

export const sendChatMessage = async (message: string, context: string = 'cooking_assistant'): Promise<string> => {
  console.log('Sending chat message to:', `${BACKEND_URL}/api/chat`);
  console.log('Message:', message);
  console.log('Context:', context);
  
  try {
    const requestBody = {
      message,
      context,
    };
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API Error Response:', errorText);
      console.error('Full error details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        body: errorText
      });
      throw new Error(`Chat API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Chat API success response:', data);
    return data.response || 'I apologize, but I couldn\'t process your request. Please try again.';
  } catch (error) {
    console.error('Error sending chat message:', error);
    console.error('Full error object:', error);
    throw error;
  }
}; 