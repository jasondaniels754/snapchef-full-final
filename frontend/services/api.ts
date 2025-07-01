import { Recipe } from '../types/recipe';
import { trackAPIError, trackGPTError, addBreadcrumb } from './sentry';

// Use local backend for development, production backend for production
const BACKEND_URL = __DEV__ ? 'http://192.168.1.106:4008' : 'https://snapchef-full-final.onrender.com';

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

  addBreadcrumb('Recipe generation started', 'api', {
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
      const error = new Error(`Backend API request failed with status ${response.status}: ${errorText}`);
      trackAPIError(error, '/api/generate', {
        difficulty,
        cuisine,
        numIngredients,
        diet,
        cookTime,
        servings,
        status: response.status,
        statusText: response.statusText
      });
      throw error;
    }

    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response text was:', responseText);
      const error = new Error('Backend returned invalid JSON');
      trackAPIError(error, '/api/generate', {
        responseText: responseText.substring(0, 200) // Truncate for privacy
      });
      throw error;
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
        seasonings: Array.isArray(data.seasonings) ? data.seasonings : ['Salt', 'Pepper'],
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
      addBreadcrumb('Recipe generated successfully', 'api', { recipeId: recipe.id });
      return recipe;
    } else if (data.content) {
      // Old text format - parse the content as before
      const content = data.content;
      console.log('Recipe content from backend (text format):', content);

      // Extract recipe information from the content
      const lines = content.split('\n').filter((line: string) => line.trim());
      
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
        seasonings: ['Salt', 'Pepper', 'Olive Oil'],
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
      addBreadcrumb('Recipe generated successfully', 'api', { recipeId: recipe.id });
      return recipe;
    } else {
      const error = new Error('Backend returned unexpected response format');
      trackAPIError(error, '/api/generate', { responseData: data });
      throw error;
    }
  } catch (error) {
    console.error('Error generating recipe via backend:', error);
    if (error instanceof Error) {
      trackGPTError(error, undefined, {
        difficulty,
        cuisine,
        numIngredients,
        diet,
        cookTime,
        servings
      });
    }
    throw error;
  }
};

export const sendChatMessage = async (message: string, context: string = 'cooking_assistant'): Promise<string> => {
  console.log('Sending chat message to:', `${BACKEND_URL}/api/chat`);
  console.log('Message:', message);
  console.log('Context:', context);
  
  addBreadcrumb('Chat message sent', 'api', { context, messageLength: message.length });
  
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
      const error = new Error(`Chat API request failed with status ${response.status}: ${errorText}`);
      trackAPIError(error, '/api/chat', {
        context,
        status: response.status,
        statusText: response.statusText
      });
      throw error;
    }

    const data = await response.json();
    console.log('Chat API success response:', data);
    addBreadcrumb('Chat message received', 'api', { context });
    return data.response || 'I apologize, but I couldn\'t process your request. Please try again.';
  } catch (error) {
    console.error('Error sending chat message:', error);
    console.error('Full error object:', error);
    if (error instanceof Error) {
      trackGPTError(error, message, { context });
    }
    throw error;
  }
};

export const generateRecipeFromIngredients = async (
  ingredients: string[],
  cuisine: string = 'Any',
  difficulty: string = 'Medium',
  diet: string = 'Regular',
  servings: number = 2,
  cookTime: number = 30
): Promise<Recipe> => {
  console.log('Generating recipe from ingredients via backend API:', { 
    ingredients,
    cuisine, 
    difficulty, 
    diet, 
    servings, 
    cookTime 
  });

  addBreadcrumb('Recipe generation from ingredients started', 'api', {
    ingredients: ingredients.slice(0, 5), // Log first 5 ingredients for privacy
    cuisine,
    difficulty,
    diet,
    servings,
    cookTime
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate/from-ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients,
        cuisine,
        difficulty,
        diet,
        servings,
        cookTime,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API Error Response:', errorText);
      const error = new Error(`Backend API request failed with status ${response.status}: ${errorText}`);
      trackAPIError(error, '/api/generate/from-ingredients', {
        ingredients: ingredients.slice(0, 5), // Log first 5 ingredients for privacy
        cuisine,
        difficulty,
        diet,
        servings,
        cookTime,
        status: response.status,
        statusText: response.statusText
      });
      throw error;
    }

    const data = await response.json();
    console.log('Backend API response:', data);

    // Create Recipe object from the response
    const recipe: Recipe = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description || `A delicious recipe using ${ingredients.join(', ')}`,
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      seasonings: Array.isArray(data.seasonings) ? data.seasonings : ['Salt', 'Pepper'],
      instructions: Array.isArray(data.instructions) ? data.instructions : [],
      difficulty: data.difficulty as 'Easy' | 'Medium' | 'Hard' || difficulty as 'Easy' | 'Medium' | 'Hard',
      cuisine: data.cuisine || cuisine,
      prepTime: Number(data.prepTime) || 15,
      cookTime: Number(data.cookTime) || cookTime,
      servings: Number(data.servings) || servings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('Final recipe object from ingredients:', JSON.stringify(recipe, null, 2));
    addBreadcrumb('Recipe generated from ingredients successfully', 'api', { 
      recipeId: recipe.id,
      detectedIngredients: ingredients.slice(0, 5) // Log first 5 ingredients for privacy
    });
    return recipe;

  } catch (error) {
    console.error('Error generating recipe from ingredients via backend:', error);
    if (error instanceof Error) {
      trackGPTError(error, undefined, {
        ingredients: ingredients.slice(0, 5), // Log first 5 ingredients for privacy
        cuisine,
        difficulty,
        diet,
        servings,
        cookTime
      });
    }
    throw error;
  }
};

export const analyzeImage = async (imageData: string): Promise<string[]> => {
  console.log('Analyzing image via backend API');
  
  addBreadcrumb('Image analysis started', 'api', {
    imageDataLength: imageData.length
  });

  try {
    const response = await fetch(`${BACKEND_URL}/api/analyze-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageData,
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image Analysis API Error Response:', errorText);
      const error = new Error(`Image Analysis API request failed with status ${response.status}: ${errorText}`);
      trackAPIError(error, '/api/analyze-image', {
        status: response.status,
        statusText: response.statusText
      });
      throw error;
    }

    const data = await response.json();
    console.log('Image Analysis API response:', data);

    if (data.ingredients && Array.isArray(data.ingredients)) {
      addBreadcrumb('Image analysis completed successfully', 'api', { 
        ingredientCount: data.ingredients.length,
        ingredients: data.ingredients.slice(0, 5) // Log first 5 ingredients for privacy
      });
      return data.ingredients;
    } else {
      const error = new Error('Invalid response format from image analysis API');
      trackAPIError(error, '/api/analyze-image', { responseData: data });
      throw error;
    }

  } catch (error) {
    console.error('Error analyzing image via backend:', error);
    if (error instanceof Error) {
      trackGPTError(error, undefined, {});
    }
    throw error;
  }
}; 