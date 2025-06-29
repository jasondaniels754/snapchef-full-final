export interface User {
  id: string;
  email: string;
  username?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  username: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  createdAt: string;
  lastActive: string;
}

export interface UserStats {
  totalSavedRecipes: number;
  totalMealPlans: number;
  totalCookingTime: number;
  favoriteCuisine: string;
  cookingStreak: number;
  lastCookingDate?: string;
}

export interface DashboardData {
  profile: UserProfile;
  stats: UserStats;
  recentActivity: ActivityItem[];
  achievements: Achievement[];
  preferences: UserPreferences;
}

export interface ActivityItem {
  id: string;
  type: 'recipe_saved' | 'meal_planned' | 'recipe_generated' | 'chat_message';
  title: string;
  description: string;
  timestamp: string;
  data?: any;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserPreferences {
  notifications: {
    newRecipes: boolean;
    mealReminders: boolean;
    cookingTips: boolean;
  };
  theme: 'light' | 'dark' | 'auto';
  language: string;
  privacy: {
    shareData: boolean;
    analytics: boolean;
  };
}

export interface DashboardSection {
  id: string;
  title: string;
  type: 'stats' | 'data' | 'settings' | 'activity';
  data: any;
} 