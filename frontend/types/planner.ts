import { Recipe } from './recipe';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MealPlan {
  date: string;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  recipe: Recipe;
  mealType: MealType;
}

export interface PlannerState {
  mealPlans: MealPlan[];
  selectedDate: string;
  loading: boolean;
  error: string | null;
}

export interface PlannerScreenProps {
  onDateSelect: (date: string) => void;
  onMealAdd: (date: string, mealType: MealType, recipe: Recipe) => void;
  onMealRemove: (date: string, mealType: MealType) => void;
}

export interface MealPlanCardProps {
  date: string;
  meals: MealPlan['meals'];
  onAddMeal: (mealType: keyof MealPlan['meals']) => void;
  onRemoveMeal: (mealType: keyof MealPlan['meals']) => void;
  onMealPress: (meal: Recipe) => void;
}

export interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  mealPlans: MealPlan[];
} 