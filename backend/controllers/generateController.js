import OpenAI from 'openai';
import dotenv from 'dotenv';
import { trackGenerateRecipeError, trackGPTError, addBreadcrumb } from '../services/sentry.js';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Recipe diversity tracking (in production, use Redis/database)
let recentRecipes = [];

// Seasoning categories and suggestions
const seasoningCategories = {
  'Italian': ['basil', 'oregano', 'rosemary', 'thyme', 'parmesan', 'garlic', 'olive oil'],
  'Mexican': ['cumin', 'chili powder', 'paprika', 'lime', 'cilantro', 'onion', 'garlic'],
  'Thai': ['lemongrass', 'fish sauce', 'lime', 'coconut milk', 'curry paste', 'basil'],
  'Chinese': ['soy sauce', 'ginger', 'garlic', 'sesame oil', 'five spice', 'star anise'],
  'Indian': ['turmeric', 'cumin', 'coriander', 'cardamom', 'garam masala', 'curry powder'],
  'Mediterranean': ['olive oil', 'lemon', 'oregano', 'basil', 'garlic', 'parsley'],
  'Any': ['salt', 'pepper', 'garlic', 'onion', 'herbs', 'spices']
};

// Cooking method variety - expanded list
const cookingMethodOptions = [
  'grilling', 'roasting', 'braising', 'stewing', 'steaming', 'frying', 'baking', 'sautéing', 'stir-frying', 'smoking', 'poaching', 'sous vide', 'air frying', 'slow cooking',
  'pressure cooking', 'broiling', 'pan-searing', 'deep frying', 'shallow frying', 'confit', 'pickling', 'fermenting', 'curing', 'marinating', 'brining'
];

// Protein variety - expanded list
const proteinOptions = [
  'chicken', 'beef', 'pork', 'fish', 'shrimp', 'tofu', 'beans', 'eggs', 'lamb', 'turkey',
  'salmon', 'cod', 'tilapia', 'tuna', 'duck', 'quail', 'venison', 'bison', 'goat', 'rabbit',
  'tempeh', 'seitan', 'lentils', 'chickpeas', 'black beans', 'kidney beans', 'pinto beans'
];

// Vegetable variety - expanded list
const vegetableOptions = [
  'broccoli', 'spinach', 'carrots', 'bell peppers', 'zucchini', 'mushrooms', 'tomatoes', 'onions', 'garlic', 'potatoes', 'sweet potatoes', 'cauliflower', 'kale', 'asparagus',
  'brussels sprouts', 'cabbage', 'bok choy', 'eggplant', 'squash', 'pumpkin', 'beets', 'turnips', 'parsnips', 'celery', 'leeks', 'shallots', 'ginger', 'lemongrass',
  'bamboo shoots', 'water chestnuts', 'snow peas', 'sugar snap peas', 'artichokes', 'fennel', 'radishes', 'daikon', 'jicama', 'kohlrabi', 'rutabaga'
];

// Recipe validation function
function validateRecipeData(recipeData) {
  return {
    title: recipeData.title || 'Untitled Recipe',
    description: recipeData.description || 'A delicious recipe',
    ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [],
    seasonings: Array.isArray(recipeData.seasonings) ? recipeData.seasonings : [],
    instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [],
    prepTime: Number(recipeData.prepTime) || 15,
    cookTime: Number(recipeData.cookTime) || 30,
    servings: Number(recipeData.servings) || 2,
    difficulty: recipeData.difficulty || 'Easy',
    cuisine: recipeData.cuisine || 'Any',
    diet: recipeData.diet || 'Regular',
    cookingMethod: recipeData.cookingMethod || 'stir-frying',
    mainProtein: recipeData.mainProtein || 'chicken',
    keyVegetable: recipeData.keyVegetable || 'broccoli'
  };
}

// Pasta detection function
function containsPastaContent(recipe) {
  const pastaKeywords = [
    'pasta', 'spaghetti', 'linguine', 'fettuccine', 'penne', 'rigatoni', 'fusilli', 'rotini', 'lasagna', 'lasagne',
    'noodles', 'noodle', 'ravioli', 'tortellini', 'gnocchi', 'cannelloni', 'manicotti', 'orecchiette', 'cavatelli',
    'pappardelle', 'tagliatelle', 'bucatini', 'ziti', 'rigatoni', 'ditalini', 'orzo', 'couscous', 'vermicelli',
    'angel hair', 'capellini', 'spaghettini', 'linguini', 'fettuccini', 'penne rigate', 'penne lisce'
  ];
  
  const contentToCheck = [
    recipe.title,
    recipe.description,
    ...recipe.ingredients,
    ...recipe.instructions
  ].join(' ').toLowerCase();
  
  return pastaKeywords.some(keyword => contentToCheck.includes(keyword));
}

// New function to generate recipe from detected ingredients
export async function generateRecipeFromIngredients(req, res) {
  try {
    const { ingredients, cuisine = 'Any', difficulty = 'Medium', diet = 'Regular', servings = 2, cookTime = 30 } = req.body;

    // Add breadcrumb for request tracking
    addBreadcrumb('Recipe generation from ingredients request received', 'api', {
      ingredients,
      cuisine,
      difficulty,
      diet,
      servings,
      cookTime
    });

    // Validate required fields
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      const error = new Error('Valid ingredients list is required');
      trackGenerateRecipeError(error, { ingredients, cuisine, difficulty, diet });
      return res.status(400).json({ error: 'Valid ingredients list is required' });
    }

    // Set default values
    const finalServings = servings || 2;
    const finalCookTime = cookTime || 30;

    // Get cooking method for variety
    const cookingMethod = cookingMethodOptions[Math.floor(Math.random() * cookingMethodOptions.length)];

    // Get protein and vegetable for variety
    const protein = proteinOptions[Math.floor(Math.random() * proteinOptions.length)];
    const vegetable = vegetableOptions[Math.floor(Math.random() * vegetableOptions.length)];

    // Get seasonings for variety
    const seasonings = ['basil', 'oregano', 'rosemary', 'thyme', 'parmesan'];
    const seasoningText = seasonings.join(', ');

    // Create ingredient-focused prompt
    const ingredientList = ingredients.join(', ');
    const prompt = `Create a delicious and creative recipe using these detected ingredients: ${ingredientList}

RECIPE REQUIREMENTS:
- Use ALL the detected ingredients as the main components
- Create a ${difficulty} level recipe that serves ${finalServings} people
- Total cook time should be around ${finalCookTime} minutes
- Use ${cookingMethod} as the primary cooking method
- Include ${protein} as additional protein (if not already in ingredients)
- Feature ${vegetable} as a key vegetable (if not already in ingredients)
- Incorporate these seasonings: ${seasoningText}
- Make the recipe authentic to ${cuisine} cuisine style
- Ensure the recipe is ${diet}-friendly

STRICT PROHIBITIONS:
- NO pasta dishes (no spaghetti, linguine, fettuccine, penne, etc.)
- NO garlic butter noodles or similar simple pasta recipes
- NO basic pasta with sauce combinations
- NO repetitive dishes like garlic lemon pasta
- NO dishes that could be considered "basic" or "simple pasta"
- NO lasagna sheets, ravioli, tortellini, or any pasta-based ingredients
- NO noodles of any kind

RECIPE FORMAT REQUIREMENTS:
- Title should be descriptive and appetizing
- Description should highlight how the detected ingredients are used
- Ingredients should include specific quantities
- Seasonings should be listed separately with quantities
- Instructions should be clear and detailed
- Difficulty should match the specified level
- Total time should be close to ${finalCookTime} minutes

Please provide the recipe in the following JSON format:
{
  "title": "Creative Recipe Title",
  "description": "Detailed description highlighting unique features and ingredient usage",
  "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs"],
  "seasonings": ["1 tsp salt", "1/2 tsp pepper", "2 cloves garlic, minced"],
  "instructions": ["Preheat oven to 350°F", "Mix dry ingredients", "Add wet ingredients"],
  "prepTime": 15,
  "cookTime": ${finalCookTime},
  "servings": ${finalServings},
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}",
  "diet": "${diet}",
  "cookingMethod": "${cookingMethod}",
  "mainProtein": "${protein}",
  "keyVegetable": "${vegetable}",
  "detectedIngredients": ${JSON.stringify(ingredients)}
}`;

    console.log('Generating recipe from ingredients:', ingredients);

    // Retry logic for pasta detection
    let attempts = 0;
    const maxAttempts = 3;
    let validatedRecipe = null;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts} of ${maxAttempts}`);

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional chef and recipe generator specializing in creating unique, diverse recipes from available ingredients. You excel at:
- Creating recipes that use ALL provided ingredients
- Avoiding repetitive or common dishes
- Incorporating specific ingredients and cooking methods
- Maintaining cultural authenticity while adding variety
- Providing detailed, accurate instructions

CRITICAL RULES YOU MUST FOLLOW:
- NEVER generate pasta dishes (no spaghetti, linguine, fettuccine, penne, etc.)
- NEVER generate garlic butter noodles or similar simple pasta recipes
- NEVER generate basic pasta with sauce combinations
- NEVER generate repetitive dishes like garlic lemon pasta
- NEVER use lasagna sheets, ravioli, tortellini, or any pasta-based ingredients
- NEVER use noodles of any kind
- ALWAYS use ALL the detected ingredients provided
- ALWAYS include the specified protein and vegetable in your recipe
- ALWAYS use the specified cooking method
- ALWAYS create unique, creative dishes that showcase the cuisine

If you generate a pasta dish or repetitive recipe, you will be penalized. Focus on creating authentic, diverse, and creative dishes using the provided ingredients.

Always respond with valid JSON in the exact format requested.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        });

        const response = completion.choices[0].message.content;
        console.log('OpenAI response:', response);

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }

        const recipeData = JSON.parse(jsonMatch[0]);
        validatedRecipe = validateRecipeData(recipeData);
        
        // Add detected ingredients to the recipe
        validatedRecipe.detectedIngredients = ingredients;
        
        console.log('Validated recipe data:', validatedRecipe);

        // Check for pasta content
        if (containsPastaContent(validatedRecipe)) {
          console.warn(`Attempt ${attempts}: Recipe contains pasta content. Retrying...`);
          if (attempts === maxAttempts) {
            const error = new Error('Unable to generate a non-pasta recipe after multiple attempts');
            trackGPTError(error, prompt, { attempts, ingredients, cuisine, difficulty });
            return res.status(400).json({ 
              error: 'Unable to generate a non-pasta recipe after multiple attempts. Please try again with different parameters.' 
            });
          }
          continue; // Try again
        }

        // Success - no pasta detected
        addBreadcrumb('Recipe generated from ingredients successfully', 'api', { 
          recipeId: validatedRecipe.title,
          attempts,
          ingredients: ingredients.slice(0, 5), // Log first 5 ingredients
          cuisine,
          difficulty
        });
        break;

      } catch (error) {
        console.error('Error parsing recipe:', error);
        if (attempts === maxAttempts) {
          trackGPTError(error, prompt, { attempts, ingredients, cuisine, difficulty });
          return res.status(500).json({ error: 'Failed to generate valid recipe after multiple attempts' });
        }
        continue; // Try again
      }
    }

    res.json(validatedRecipe);

  } catch (error) {
    console.error('Error generating recipe from ingredients:', error);
    trackGenerateRecipeError(error, req.body);
    res.status(500).json({ error: 'Failed to generate recipe from ingredients' });
  }
}

export async function generateRecipes(req, res) {
  try {
    const { cuisine, difficulty, diet, servings, numIngredients, cookTime } = req.body;

    // Add breadcrumb for request tracking
    addBreadcrumb('Recipe generation request received', 'api', {
      cuisine,
      difficulty,
      diet,
      servings,
      numIngredients,
      cookTime
    });

    // Validate required fields
    if (!cuisine || !difficulty || !diet) {
      const error = new Error('Missing required fields');
      trackGenerateRecipeError(error, { cuisine, difficulty, diet, servings, numIngredients, cookTime });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Set default values
    const finalServings = servings || 2;
    const finalNumIngredients = numIngredients || 5;
    const finalCookTime = cookTime || 30;

    // Get cooking method for variety
    const cookingMethod = cookingMethodOptions[Math.floor(Math.random() * cookingMethodOptions.length)];

    // Get protein and vegetable for variety
    const protein = proteinOptions[Math.floor(Math.random() * proteinOptions.length)];
    const vegetable = vegetableOptions[Math.floor(Math.random() * vegetableOptions.length)];

    // Get seasonings for variety
    const seasonings = ['basil', 'oregano', 'rosemary', 'thyme', 'parmesan'];
    const seasoningText = seasonings.join(', ');

    // Avoid recent cuisines
    const avoidCuisine = cuisine === 'Italian' ? 'Avoid creating Italian recipes similar to recent ones. ' : '';

    // Enhanced prompt with variety constraints
    const prompt = `Generate a unique and creative ${difficulty} ${diet} ${cuisine} recipe that serves ${finalServings} people and uses no more than ${finalNumIngredients} main ingredients. The total cook time should be around ${finalCookTime} minutes.

CRITICAL VARIETY CONSTRAINTS - MUST FOLLOW:
- Use ${cookingMethod} as the primary cooking method
- Include ${protein} as the main protein (this is REQUIRED)
- Feature ${vegetable} as a key vegetable (this is REQUIRED)
- Incorporate these seasonings: ${seasoningText}
- Make this recipe distinctly different from common ${cuisine} dishes
- Ensure the recipe is authentic to ${cuisine} cuisine while being creative

STRICT PROHIBITIONS:
- NO pasta dishes (no spaghetti, linguine, fettuccine, penne, etc.)
- NO garlic butter noodles or similar simple pasta recipes
- NO basic pasta with sauce combinations
- NO repetitive dishes like garlic lemon pasta
- NO dishes that could be considered "basic" or "simple pasta"
- NO lasagna sheets, ravioli, tortellini, or any pasta-based ingredients
- NO noodles of any kind

${avoidCuisine}

RECIPE REQUIREMENTS:
- Title should be descriptive and appetizing
- Description should highlight unique aspects
- Ingredients should include specific quantities (main ingredients only)
- Seasonings should be listed separately with quantities
- Instructions should be clear and detailed
- Difficulty should match the specified level
- Total time should be close to ${finalCookTime} minutes
- MUST be a creative, unique dish that showcases ${cuisine} cuisine

Please provide the recipe in the following JSON format:
{
  "title": "Creative Recipe Title",
  "description": "Detailed description highlighting unique features",
  "ingredients": ["2 cups flour", "1 cup sugar", "3 eggs"],
  "seasonings": ["1 tsp salt", "1/2 tsp pepper", "2 cloves garlic, minced"],
  "instructions": ["Preheat oven to 350°F", "Mix dry ingredients", "Add wet ingredients"],
  "prepTime": 15,
  "cookTime": ${finalCookTime},
  "servings": ${finalServings},
  "difficulty": "${difficulty}",
  "cuisine": "${cuisine}",
  "diet": "${diet}",
  "cookingMethod": "${cookingMethod}",
  "mainProtein": "${protein}",
  "keyVegetable": "${vegetable}"
}`;

    console.log('Sending enhanced prompt to OpenAI:', prompt);

    // Retry logic for pasta detection
    let attempts = 0;
    const maxAttempts = 3;
    let validatedRecipe = null;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Attempt ${attempts} of ${maxAttempts}`);

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are a professional chef and recipe generator specializing in creating unique, diverse recipes. You excel at:
- Creating authentic yet creative recipes
- Avoiding repetitive or common dishes
- Incorporating specific ingredients and cooking methods
- Maintaining cultural authenticity while adding variety
- Providing detailed, accurate instructions

CRITICAL RULES YOU MUST FOLLOW:
- NEVER generate pasta dishes (no spaghetti, linguine, fettuccine, penne, etc.)
- NEVER generate garlic butter noodles or similar simple pasta recipes
- NEVER generate basic pasta with sauce combinations
- NEVER generate repetitive dishes like garlic lemon pasta
- NEVER use lasagna sheets, ravioli, tortellini, or any pasta-based ingredients
- NEVER use noodles of any kind
- ALWAYS include the specified protein and vegetable in your recipe
- ALWAYS use the specified cooking method
- ALWAYS create unique, creative dishes that showcase the cuisine

If you generate a pasta dish or repetitive recipe, you will be penalized. Focus on creating authentic, diverse, and creative dishes.

Always respond with valid JSON in the exact format requested.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1000
        });

        const response = completion.choices[0].message.content;
        console.log('OpenAI response:', response);

        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }

        const recipeData = JSON.parse(jsonMatch[0]);
        validatedRecipe = validateRecipeData(recipeData);
        console.log('Validated recipe data:', validatedRecipe);

        // Check for pasta content
        if (containsPastaContent(validatedRecipe)) {
          console.warn(`Attempt ${attempts}: Recipe contains pasta content. Retrying...`);
          if (attempts === maxAttempts) {
            const error = new Error('Unable to generate a non-pasta recipe after multiple attempts');
            trackGPTError(error, prompt, { attempts, cuisine, difficulty });
            return res.status(400).json({ 
              error: 'Unable to generate a non-pasta recipe after multiple attempts. Please try again with different parameters.' 
            });
          }
          continue; // Try again
        }

        // Success - no pasta detected
        addBreadcrumb('Recipe generated successfully', 'api', { 
          recipeId: validatedRecipe.title,
          attempts,
          cuisine,
          difficulty
        });
        break;

      } catch (error) {
        console.error('Error parsing recipe:', error);
        if (attempts === maxAttempts) {
          trackGPTError(error, prompt, { attempts, cuisine, difficulty });
          return res.status(500).json({ error: 'Failed to generate valid recipe after multiple attempts' });
        }
        continue; // Try again
      }
    }

    res.json(validatedRecipe);

  } catch (error) {
    console.error('Error generating recipe:', error);
    trackGenerateRecipeError(error, req.body);
    res.status(500).json({ error: 'Failed to generate recipe' });
  }
}
