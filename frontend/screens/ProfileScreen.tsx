import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import UserProfileHeader from '../components/UserProfileHeader';
import StatsCard from '../components/StatsCard';
import DataSection from '../components/DataSection';
import SettingsSection from '../components/SettingsSection';
import { 
  UserProfile, 
  UserStats, 
  UserPreferences, 
  ActivityItem 
} from '../types/user';
import { SavedRecipe } from '../types/savedRecipe';
import { colors, spacing } from '../design/designSystem';

export default function ProfileScreen(): React.ReactElement {
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'SnapChef User',
    email: 'user@snapchef.com',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  });
  
  const [stats, setStats] = useState<UserStats>({
    totalSavedRecipes: 0,
    totalMealPlans: 0,
    totalCookingTime: 0,
    favoriteCuisine: 'Italian',
    cookingStreak: 0,
  });
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      newRecipes: true,
      mealReminders: true,
      cookingTips: false,
    },
    theme: 'light',
    language: 'English',
    privacy: {
      shareData: false,
      analytics: true,
    },
  });

  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  const loadDashboardData = useCallback(async () => {
    try {
      // Load saved recipes
      const savedRecipesJson = await AsyncStorage.getItem('savedRecipes');
      if (savedRecipesJson) {
        const recipes = JSON.parse(savedRecipesJson);
        setSavedRecipes(recipes);
        
        // Calculate stats
        const totalCookingTime = recipes.reduce((total: number, recipe: SavedRecipe) => 
          total + (recipe.prepTime + recipe.cookTime), 0
        );
        
        const cuisineCounts: { [key: string]: number } = {};
        recipes.forEach((recipe: SavedRecipe) => {
          cuisineCounts[recipe.cuisine] = (cuisineCounts[recipe.cuisine] || 0) + 1;
        });
        
        const favoriteCuisine = Object.keys(cuisineCounts).reduce((a, b) => 
          cuisineCounts[a] > cuisineCounts[b] ? a : b, 'Italian'
        );

        setStats(prev => ({
          ...prev,
          totalSavedRecipes: recipes.length,
          totalCookingTime: Math.round(totalCookingTime / 60), // Convert to hours
          favoriteCuisine,
        }));
      }

      // Load meal plans
      const mealPlansJson = await AsyncStorage.getItem('mealPlans');
      if (mealPlansJson) {
        const mealPlans = JSON.parse(mealPlansJson);
        setStats(prev => ({
          ...prev,
          totalMealPlans: Object.keys(mealPlans).length,
        }));
      }

      // Generate recent activity
      const activity: ActivityItem[] = [];
      if (savedRecipes.length > 0) {
        activity.push({
          id: '1',
          type: 'recipe_saved',
          title: 'Saved Recipe',
          description: `Saved "${savedRecipes[0].title}"`,
          timestamp: savedRecipes[0].savedAt,
        });
      }
      setRecentActivity(activity);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => {
      const newPrefs = { ...prev };
      const keys = key.split('.');
      let current: any = newPrefs;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newPrefs;
    });
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'This feature will be available soon!');
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'This feature will be available soon!');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your saved recipes and meal plans. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['savedRecipes', 'mealPlans']);
              setSavedRecipes([]);
              setStats(prev => ({
                ...prev,
                totalSavedRecipes: 0,
                totalMealPlans: 0,
                totalCookingTime: 0,
              }));
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing data:', error);
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing will be available soon!');
  };

  const savedRecipesData = savedRecipes.slice(0, 5).map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    subtitle: `${recipe.cuisine} • ${recipe.difficulty}`,
    timestamp: recipe.savedAt,
  }));

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
      >
        <UserProfileHeader 
          profile={profile} 
          onEditProfile={handleEditProfile}
        />
        
        <StatsCard 
          stats={stats}
          onPress={() => Alert.alert('Detailed Stats', 'Detailed statistics will be available soon!')}
        />
        
        <DataSection
          title="Recent Recipes"
          icon="bookmark"
          data={savedRecipesData}
          onPress={() => Alert.alert('All Recipes', 'Navigate to Saved Recipes screen')}
          onItemPress={(item) => Alert.alert('Recipe Details', `Viewing ${item.title}`)}
          emptyMessage="No saved recipes yet"
        />
        
        <SettingsSection
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onClearData={handleClearData}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
}); 