// Sentry has been removed to resolve dependency conflicts
// Simple console logging for development

// Initialize Sentry
export const initSentry = (app) => {
  console.log('Sentry disabled - using console logging');
};

// Set user context
export const setUserContext = (userId, email) => {
  console.log('User context:', { userId, email });
};

// Set route context
export const setRouteContext = (route) => {
  console.log('Route context:', route);
};

// Capture exceptions with context
export const captureException = (error, context = {}) => {
  console.error('Error:', error, context);
};

// Capture messages with context
export const captureMessage = (message, level = 'info', context = {}) => {
  console.log(`[${level.toUpperCase()}] ${message}`, context);
};

// Add breadcrumb
export const addBreadcrumb = (message, category, data = {}) => {
  console.log('Breadcrumb:', { message, category, data });
};

// Route-specific error tracking
export const trackGenerateRecipeError = (error, requestData = {}) => {
  console.error('Generate Recipe Error:', error, { endpoint: '/api/generate', requestData });
};

export const trackChatError = (error, requestData = {}) => {
  console.error('Chat Error:', error, { endpoint: '/api/chat', requestData });
};

export const trackGPTError = (error, prompt, context = {}) => {
  console.error('GPT Error:', error, { prompt: prompt ? prompt.substring(0, 100) + '...' : undefined, ...context });
};

export const trackTimeoutError = (endpoint, timeout) => {
  console.warn(`Request timeout for ${endpoint}`, { endpoint, timeout });
};

// Error handler middleware
export const errorHandler = () => {
  return (err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  };
}; 