export async function generateRecipe(difficulty, genre, numIngredients) {
  try {
    console.log('Making API request to:', 'http://192.168.1.114:4008/generate-recipes');
    const res = await fetch('http://192.168.1.114:4008/generate-recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty, genre, numIngredients })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error Response:', {
        status: res.status,
        statusText: res.statusText,
        body: errorText
      });
      throw new Error(`Failed to generate recipe: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('API Response:', data);
    
    // Ensure we have content in the response
    if (!data || !data.content) {
      console.error('Invalid API response format:', data);
      throw new Error('Invalid recipe data received');
    }
    
    // Return the content directly since we're using it as a single recipe
    return data.content;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}
