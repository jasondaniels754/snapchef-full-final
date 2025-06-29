import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import Calendar from '../components/Calendar';
import MealPlanCard from '../components/MealPlanCard';
import { colors, spacing } from '../design/designSystem';
import { MealPlan, MealType, PlannerState } from '../types/planner';
import { Recipe } from '../types/recipe';

const STORAGE_KEY = 'mealPlans';
const SAVED_RECIPES_KEY = 'savedRecipes';

export default function PlannerScreen(): React.ReactElement {
  const [state, setState] = useState<PlannerState>({
    mealPlans: [],
    selectedDate: new Date().toISOString().split('T')[0],
    loading: false,
    error: null,
  });
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  // Load meal plans from storage
  const loadMealPlans = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const mealPlans: MealPlan[] = JSON.parse(stored);
        setState(prev => ({ ...prev, mealPlans, loading: false }));
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to load meal plans' 
      }));
    }
  };

  // Load saved recipes
  const loadSavedRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem(SAVED_RECIPES_KEY);
      if (stored) {
        const recipes: Recipe[] = JSON.parse(stored);
        setSavedRecipes(recipes);
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
    }
  };

  // Save meal plans to storage
  const saveMealPlans = async (mealPlans: MealPlan[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mealPlans));
    } catch (error) {
      console.error('Error saving meal plans:', error);
      Alert.alert('Error', 'Failed to save meal plan');
    }
  };

  // Get meal plan for selected date
  const getMealPlanForDate = (date: string): MealPlan => {
    return state.mealPlans.find(plan => plan.date === date) || {
      date,
      meals: {},
    };
  };

  // Add meal to plan
  const handleAddMeal = (mealType: MealType) => {
    setSelectedMealType(mealType);
    loadSavedRecipes();
    setShowRecipeSelector(true);
  };

  // Remove meal from plan
  const handleRemoveMeal = (mealType: MealType) => {
    const updatedMealPlans = state.mealPlans.map(plan => {
      if (plan.date === state.selectedDate) {
        const updatedMeals = { ...plan.meals };
        delete updatedMeals[mealType];
        return { ...plan, meals: updatedMeals };
      }
      return plan;
    });

    // Remove empty meal plans
    const filteredMealPlans = updatedMealPlans.filter(plan => 
      Object.keys(plan.meals).length > 0
    );

    setState(prev => ({ ...prev, mealPlans: filteredMealPlans }));
    saveMealPlans(filteredMealPlans);
  };

  // Select recipe for meal
  const handleRecipeSelect = (recipe: Recipe) => {
    if (!selectedMealType) return;

    const updatedMealPlans = [...state.mealPlans];
    const existingPlanIndex = updatedMealPlans.findIndex(
      plan => plan.date === state.selectedDate
    );

    if (existingPlanIndex >= 0) {
      // Update existing plan
      updatedMealPlans[existingPlanIndex] = {
        ...updatedMealPlans[existingPlanIndex],
        meals: {
          ...updatedMealPlans[existingPlanIndex].meals,
          [selectedMealType]: recipe,
        },
      };
    } else {
      // Create new plan
      updatedMealPlans.push({
        date: state.selectedDate,
        meals: {
          [selectedMealType]: recipe,
        },
      });
    }

    setState(prev => ({ ...prev, mealPlans: updatedMealPlans }));
    saveMealPlans(updatedMealPlans);
    setShowRecipeSelector(false);
    setSelectedMealType(null);
  };

  // Handle meal press (view recipe details)
  const handleMealPress = (recipe: Recipe) => {
    // TODO: Show recipe modal with details
    Alert.alert(recipe.title, `Cook time: ${recipe.cookTime} mins\nDifficulty: ${recipe.difficulty}`);
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadMealPlans();
    setRefreshing(false);
  };

  // Render recipe item for selector
  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      style={styles.recipeItem}
      onPress={() => handleRecipeSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeDetails}>
          {item.cookTime} mins • {item.difficulty}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  // Load meal plans on mount
  useEffect(() => {
    loadMealPlans();
  }, []);

  const currentMealPlan = getMealPlanForDate(state.selectedDate);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Header title="Meal Planner" />
        <Calendar
          selectedDate={state.selectedDate}
          onDateSelect={handleDateSelect}
          mealPlans={state.mealPlans}
        />

        <MealPlanCard
          date={state.selectedDate}
          meals={currentMealPlan.meals}
          onAddMeal={handleAddMeal}
          onRemoveMeal={handleRemoveMeal}
          onMealPress={handleMealPress}
        />
      </ScrollView>

      {/* Recipe Selector Modal */}
      <Modal
        visible={showRecipeSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Select Recipe for {(selectedMealType?.charAt(0).toUpperCase() || '') + (selectedMealType?.slice(1) || '')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowRecipeSelector(false);
                setSelectedMealType(null);
              }}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          
          {savedRecipes.length > 0 ? (
            <FlatList
              data={savedRecipes}
              renderItem={renderRecipeItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.recipeList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No saved recipes found. Save some recipes first!
              </Text>
            </View>
          )}
        </View>
      </Modal>
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.neutral.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  recipeDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  recipeList: {
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.secondary,
  },
}); 