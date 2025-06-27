import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import SavedRecipeList from '../components/SavedRecipeList';
import SavedRecipeFilters from '../components/SavedRecipeFilters';
import { SavedRecipe, SavedRecipeState } from '../types/savedRecipe';
import { Recipe } from '../types/recipe';

export default function SavedScreen(): React.ReactElement {
  const [state, setState] = useState<SavedRecipeState>({
    recipes: [],
    isLoading: true,
    error: null,
    filters: {
      favoritesOnly: false,
      cuisine: null,
      difficulty: null,
    },
    sortBy: 'savedAt',
    sortOrder: 'desc',
  });

  const loadSavedRecipes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const savedRecipesJson = await AsyncStorage.getItem('savedRecipes');
      if (savedRecipesJson) {
        const recipes = JSON.parse(savedRecipesJson) as Recipe[];
        const savedRecipes: SavedRecipe[] = recipes.map(recipe => ({
          ...recipe,
          savedAt: recipe.createdAt,
          isFavorite: false,
        }));
        setState(prev => ({ ...prev, recipes: savedRecipes, isLoading: false }));
      } else {
        setState(prev => ({ ...prev, recipes: [], isLoading: false }));
      }
    } catch (error) {
      console.error('Error loading saved recipes:', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load saved recipes',
        isLoading: false,
      }));
    }
  }, []);

  useEffect(() => {
    loadSavedRecipes();
  }, [loadSavedRecipes]);

  const handleRecipePress = useCallback((recipe: SavedRecipe) => {
    // TODO: Navigate to recipe detail screen
    console.log('Recipe pressed:', recipe.title);
  }, []);

  const handleFavoriteToggle = useCallback(async (recipe: SavedRecipe) => {
    try {
      const updatedRecipes = state.recipes.map(r =>
        r.id === recipe.id ? { ...r, isFavorite: !r.isFavorite } : r
      );
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
      setState(prev => ({ ...prev, recipes: updatedRecipes }));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  }, [state.recipes]);

  const handleDelete = useCallback(async (recipe: SavedRecipe) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipe.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedRecipes = state.recipes.filter(r => r.id !== recipe.id);
              await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));
              setState(prev => ({ ...prev, recipes: updatedRecipes }));
            } catch (error) {
              console.error('Error deleting recipe:', error);
              Alert.alert('Error', 'Failed to delete recipe');
            }
          },
        },
      ]
    );
  }, [state.recipes]);

  const handleFilterChange = useCallback((filters: SavedRecipeState['filters']) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const handleSortChange = useCallback((
    sortBy: SavedRecipeState['sortBy'],
    sortOrder: SavedRecipeState['sortOrder']
  ) => {
    setState(prev => ({ ...prev, sortBy, sortOrder }));
  }, []);

  const filteredAndSortedRecipes = React.useMemo(() => {
    let result = [...state.recipes];

    // Apply filters
    if (state.filters.favoritesOnly) {
      result = result.filter(recipe => recipe.isFavorite);
    }
    if (state.filters.cuisine) {
      result = result.filter(recipe => recipe.cuisine === state.filters.cuisine);
    }
    if (state.filters.difficulty) {
      result = result.filter(recipe => recipe.difficulty === state.filters.difficulty);
    }

    // Apply sorting
    result.sort((a, b) => {
      const order = state.sortOrder === 'asc' ? 1 : -1;
      switch (state.sortBy) {
        case 'savedAt':
          return order * (new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
        case 'title':
          return order * a.title.localeCompare(b.title);
        case 'difficulty':
          return order * a.difficulty.localeCompare(b.difficulty);
        default:
          return 0;
      }
    });

    return result;
  }, [state.recipes, state.filters, state.sortBy, state.sortOrder]);

  return (
    <View style={styles.container}>
      <Header title="Saved Recipes" />
      <SavedRecipeFilters
        filters={state.filters}
        onFilterChange={handleFilterChange}
        currentSort={{ by: state.sortBy, order: state.sortOrder }}
        onSortChange={handleSortChange}
      />
      <View style={styles.content}>
        {state.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
          </View>
        ) : state.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{state.error}</Text>
          </View>
        ) : filteredAndSortedRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved recipes yet</Text>
          </View>
        ) : (
          <SavedRecipeList
            recipes={filteredAndSortedRecipes}
            onRecipePress={handleRecipePress}
            onFavoriteToggle={handleFavoriteToggle}
            onDelete={handleDelete}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
}); 