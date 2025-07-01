// Sentry has been removed to resolve dependency conflicts
// Simple console logging for development

export const initSentry = () => {
  console.log('Sentry disabled - using console logging');
};

export const setUserContext = (userId: string, email?: string) => {
  console.log('User context:', { userId, email });
};

export const setFeatureContext = (feature: string) => {
  console.log('Feature context:', feature);
};

export const captureException = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error, context);
};

export const captureMessage = (message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info', context?: Record<string, any>) => {
  console.log(`[${level.toUpperCase()}] ${message}`, context);
};

export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  console.log('Breadcrumb:', { message, category, data });
};

export const trackRecipeGenError = (error: Error, context?: Record<string, any>) => {
  console.error('Recipe Gen Error:', error, context);
};

export const trackCalendarError = (error: Error, context?: Record<string, any>) => {
  console.error('Calendar Error:', error, context);
};

export const trackSimmerChatError = (error: Error, context?: Record<string, any>) => {
  console.error('Simmer Chat Error:', error, context);
};

export const trackAPIError = (error: Error, endpoint: string, context?: Record<string, any>) => {
  console.error('API Error:', error, { endpoint, ...context });
};

export const trackGPTError = (error: Error, prompt?: string, context?: Record<string, any>) => {
  console.error('GPT Error:', error, { prompt: prompt ? prompt.substring(0, 100) + '...' : undefined, ...context });
}; 