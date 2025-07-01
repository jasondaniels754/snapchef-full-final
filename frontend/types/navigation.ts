import { Recipe } from './recipe';

export type RootStackParamList = {
  Main: undefined;
  Auth: undefined;
  RecipeDetail: { recipe: Recipe };
  GenerateRecipe: undefined;
  SavedRecipes: undefined;
  MealPlanner: undefined;
  CookingChat: undefined;
};

export type MainTabParamList = {
  Generate: undefined;
  SnapToRecipe: undefined;
  Saved: undefined;
  Planner: undefined;
  Chat: undefined;
  Profile: undefined;
}; 