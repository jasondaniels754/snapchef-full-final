import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req, res) => {
  try {
    const { message, context = 'cooking_assistant' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create a cooking-focused system prompt
    const systemPrompt = `You are SnapChef, a friendly and knowledgeable cooking assistant. You help users with:

- Recipe suggestions and modifications
- Cooking techniques and tips
- Meal planning advice
- Kitchen equipment recommendations
- Food safety and storage tips
- Dietary restrictions and substitutions
- Cooking troubleshooting

Keep your responses helpful, practical, and encouraging. Use a warm, conversational tone. If you're not sure about something, it's okay to say so and suggest alternatives.

Current context: ${context}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: error.message 
    });
  }
}; 