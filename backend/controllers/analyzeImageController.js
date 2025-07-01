import OpenAI from 'openai';
import dotenv from 'dotenv';
import { trackGPTError, addBreadcrumb } from '../services/sentry.js';

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeImage = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    // Add breadcrumb for request tracking
    addBreadcrumb('Image analysis request received', 'api', {
      imageSize: imageBase64?.length || 0
    });

    // Validate input
    if (!imageBase64) {
      const error = new Error('Image data is required');
      trackGPTError(error, null, { endpoint: '/analyze-image' });
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Validate base64 format
    if (!imageBase64.startsWith('data:image/')) {
      const error = new Error('Invalid image format. Expected base64 data URL');
      trackGPTError(error, null, { endpoint: '/analyze-image' });
      return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL' });
    }

    console.log('Analyzing image with GPT-4 Vision...');

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are a food expert. Analyze this image and list only the edible ingredients shown. 

IMPORTANT RULES:
- List ONLY edible food ingredients
- Do NOT include brands, utensils, kitchen equipment, or background objects
- Do NOT include non-edible items like plates, bowls, or cooking tools
- Focus on raw ingredients, vegetables, fruits, meats, dairy, grains, etc.
- If you see multiple items of the same ingredient, list it only once
- Be specific about ingredients (e.g., "red bell pepper" instead of just "pepper")
- If you cannot identify any edible ingredients, return an empty array

Format your response as a valid JSON array of strings only. Example:
["tomato", "basil", "mozzarella cheese", "olive oil"]

Do not include any other text, just the JSON array.`
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.1 // Low temperature for consistent ingredient detection
      });

      const response = completion.choices[0].message.content;
      console.log('GPT-4 Vision response:', response);

      // Parse the JSON response
      let ingredients;
      try {
        // Extract JSON from response (in case there's extra text)
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          throw new Error('No valid JSON array found in response');
        }
        
        ingredients = JSON.parse(jsonMatch[0]);
        
        // Validate that it's an array of strings
        if (!Array.isArray(ingredients)) {
          throw new Error('Response is not an array');
        }
        
        // Filter out any non-string items and clean up
        ingredients = ingredients
          .filter(item => typeof item === 'string')
          .map(item => item.trim().toLowerCase())
          .filter(item => item.length > 0);
        
      } catch (parseError) {
        console.error('Error parsing GPT response:', parseError);
        console.error('Raw response:', response);
        trackGPTError(parseError, null, { 
          endpoint: '/analyze-image',
          rawResponse: response.substring(0, 200) // Truncate for privacy
        });
        return res.status(500).json({ 
          error: 'Failed to parse ingredient analysis',
          details: 'Invalid response format from AI'
        });
      }

      console.log('Detected ingredients:', ingredients);

      addBreadcrumb('Image analysis completed', 'api', {
        ingredientCount: ingredients.length,
        ingredients: ingredients.slice(0, 5) // Log first 5 ingredients for debugging
      });

      res.json({ 
        ingredients,
        count: ingredients.length
      });

    } catch (gptError) {
      console.error('GPT-4 Vision API error:', gptError);
      trackGPTError(gptError, null, { 
        endpoint: '/analyze-image',
        model: 'gpt-4-vision-preview'
      });
      res.status(500).json({ 
        error: 'Failed to analyze image',
        details: gptError.message 
      });
    }

  } catch (error) {
    console.error('Error in image analysis:', error);
    trackGPTError(error, null, { endpoint: '/analyze-image' });
    res.status(500).json({ 
      error: 'Failed to process image analysis request',
      details: error.message 
    });
  }
}; 