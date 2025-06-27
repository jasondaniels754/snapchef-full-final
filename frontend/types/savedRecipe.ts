import { Recipe } from './recipe';

export interface SavedRecipe extends Recipe {
  savedAt: string;
  isFavorite: boolean;
}

export interface SavedRecipeState {
  recipes: SavedRecipe[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    favoritesOnly: boolean;
    cuisine: string | null;
    difficulty: 'Easy' | 'Medium' | 'Hard' | null;
    diet: string | null;
  };
  sortBy: 'savedAt' | 'title' | 'difficulty';
  sortOrder: 'asc' | 'desc';
}

export interface SavedRecipeListProps {
  recipes: SavedRecipe[];
  onRecipePress: (recipe: SavedRecipe) => void;
  onFavoriteToggle: (recipe: SavedRecipe) => void;
  onDelete: (recipe: SavedRecipe) => void;
}

export interface SavedRecipeFiltersProps {
  filters: SavedRecipeState['filters'];
  onFilterChange: (filters: SavedRecipeState['filters']) => void;
  onSortChange: (sortBy: SavedRecipeState['sortBy'], sortOrder: SavedRecipeState['sortOrder']) => void;
  currentSort: {
    by: SavedRecipeState['sortBy'];
    order: SavedRecipeState['sortOrder'];
  };
} 