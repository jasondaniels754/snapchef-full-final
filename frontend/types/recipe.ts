export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  diet?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFormData {
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  numIngredients: number;
  diet: string;
  cookTime: number;
  servings: number;
}

export interface RecipeCardProps {
  recipe: Recipe;
  onClose: () => void;
  onSave: () => void;
}

export interface CuisinePickerProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export interface DifficultyPickerProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export interface IngredientSliderProps {
  max: number;
  value: number;
  onChange: (value: number) => void;
} 