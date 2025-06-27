# SnapChef - AI-Powered Meal Planning App

SnapChef is a mobile application that helps users plan and prepare meals using AI-driven recipe generation and meal planning features. Built with React Native, Expo, TypeScript, and OpenAI GPT API.

## 🚀 Features

- **AI Recipe Generation**: Create personalized recipes based on cuisine, difficulty, and ingredient preferences
- **Recipe Management**: Save, filter, and organize your favorite recipes
- **Meal Planning**: Plan your meals with an interactive calendar (coming soon)
- **AI Chat**: Get cooking advice and recipe suggestions (coming soon)
- **User Profiles**: Manage your cooking preferences and history (coming soon)

## 🛠 Tech Stack

### Frontend
- **React Native** with **Expo SDK 48**
- **TypeScript** for type safety
- **React Navigation** for app navigation
- **AsyncStorage** for local data persistence
- **OpenAI GPT API** for recipe generation

### Backend
- **Node.js** with **Express**
- **OpenAI API** integration
- **CORS** enabled for frontend integration
- **Environment variables** for configuration

## 📱 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snapchef-full-final
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```bash
   cd backend
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

5. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend app**
   ```bash
   cd frontend
   npm start
   ```

7. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Press `w` for Web Browser
   - Scan QR code with Expo Go app on your phone

## 🏗 Project Structure

```
snapchef-full-final/
├── frontend/                 # React Native app
│   ├── App.tsx              # Main app component
│   ├── navigation/          # Navigation configuration
│   ├── screens/             # App screens
│   ├── components/          # Reusable components
│   ├── services/            # API services
│   ├── types/               # TypeScript definitions
│   └── design/              # Design system
├── backend/                 # Node.js server
│   ├── server.js            # Express server
│   ├── routes/              # API routes
│   ├── controllers/         # Business logic
│   └── render.yaml          # Render deployment config
└── README.md               # This file
```

## 🔧 Development

### Available Scripts

**Frontend:**
```bash
cd frontend
npm start          # Start Expo development server
npm run ios        # Run on iOS Simulator
npm run android    # Run on Android Emulator
npm run web        # Run in web browser
```

**Backend:**
```bash
cd backend
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Environment Variables

**Backend (.env):**
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=4008
```

**Frontend (app.json):**
```json
{
  "expo": {
    "extra": {
      "openaiApiKey": "your_openai_api_key_here"
    }
  }
}
```

## 🚀 Deployment

### Backend (Render)
The backend is configured for deployment on Render with:
- `render.yaml` configuration file
- `Procfile` for process management
- Environment variable support

### Frontend (Expo)
The frontend can be deployed using:
- Expo Application Services (EAS)
- Expo Web for web deployment
- App Store/Google Play Store builds

## 📝 API Endpoints

### Recipe Generation
- `POST /generate-recipes` - Generate AI-powered recipes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🗺 Roadmap

- [ ] Complete meal planning functionality
- [ ] Implement AI chat features
- [ ] Add user authentication
- [ ] Integrate Supabase for data persistence
- [ ] Add recipe sharing and social features
- [ ] Implement advanced meal planning algorithms
- [ ] Add recipe ratings and reviews
- [ ] Create recipe collections and categories 