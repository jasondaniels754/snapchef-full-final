import { config } from 'dotenv';

// Load environment variables
config();

// Debug logging
console.log('Environment variables:', {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'Present' : 'Missing'
});

export default {
  name: 'SnapChef',
  slug: 'snapchef',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#ffffff'
    }
  },
  extra: {
    eas: {
      projectId: "your-project-id"
    }
  }
}; 