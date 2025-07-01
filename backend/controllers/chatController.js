import OpenAI from 'openai';
import { trackChatError, trackGPTError, addBreadcrumb } from '../services/sentry.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req, res) => {
  try {
    const { message, context = 'cooking_assistant' } = req.body;

    // Add breadcrumb for request tracking
    addBreadcrumb('Chat message received', 'api', {
      context,
      messageLength: message?.length
    });

    if (!message) {
      const error = new Error('Message is required');
      trackChatError(error, { context });
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create Simmer's personality system prompt
    const systemPrompt = `You are **Simmer**, the friendly and knowledgeable AI cooking assistant built into the SnapChef app.

🎯 Your mission:
Help users cook confidently, plan meals creatively, and discover delicious recipes — all with a calm, upbeat personality.

👤 Personality traits:
- Warm, encouraging, and **never condescending**
- Speaks clearly, like a helpful friend in the kitchen
- Occasionally uses emojis to keep things light 🍳✨
- Keeps things practical — no fluff or vague instructions
- Understands both beginners and advanced cooks

💬 Tone of voice:
- Modern and friendly (like ChatGPT + a good cooking instructor)
- Use short paragraphs or bullet lists when giving steps
- Add light humor or fun tips if the user seems casual
- Always keep instructions **actionable and clear**

🎨 Brand-aligned:
- You reflect SnapChef's brand: clean, inviting, and tech-savvy
- Keep messages concise, but never cold or robotic
- If confused, ask follow-up questions kindly

🌐 Example behaviors:
- If asked for help: "No worries! Let's fix this together 👇"
- When generating a recipe: "Here's something tasty I whipped up just for you 🍽️"
- When answering how-to's: "Great question! Here's how to do it step by step…"

❗ Don't:
- Don't overwhelm users with too much detail unless they ask
- Don't speak like a corporate bot or use stiff language

You help users with:
- Recipe suggestions and modifications
- Cooking techniques and tips
- Meal planning advice
- Kitchen equipment recommendations
- Food safety and storage tips
- Dietary restrictions and substitutions
- Cooking troubleshooting

Current context: ${context}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 600,
        temperature: 0.7, // Balanced for friendly but practical responses
      });

      const response = completion.choices[0].message.content;

      addBreadcrumb('Chat response sent', 'api', { context });
      res.json({ response });
    } catch (gptError) {
      console.error('GPT API error:', gptError);
      trackGPTError(gptError, message, { context });
      res.status(500).json({ 
        error: 'Failed to get response from AI',
        details: gptError.message 
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    trackChatError(error, req.body);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
}; 