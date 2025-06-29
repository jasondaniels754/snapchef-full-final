import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, TextInput, TouchableOpacity, Modal, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import SavedRecipeList from '../components/SavedRecipeList';
import SavedRecipeFilters from '../components/SavedRecipeFilters';
import { SavedRecipe, SavedRecipeState } from '../types/savedRecipe';
import { Recipe } from '../types/recipe';
import { colors, spacing } from '../design/designSystem';

export default function SavedScreen(): React.ReactElement {
  const [state, setState] = useState<SavedRecipeState>({
    recipes: [],
    isLoading: true,
    error: null,
    searchQuery: '',
    filters: {
      favoritesOnly: false,
      cuisine: null,
      difficulty: null,
      diet: null,
      category: 'all',
    },
    sortBy: 'savedAt',
    sortOrder: 'desc',
  });
  const [selectedRecipe, setSelectedRecipe] = useState<SavedRecipe | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadSavedRecipes = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const savedRecipesJson = await AsyncStorage.getItem('savedRecipes');
      console.log('Saved recipes JSON:', savedRecipesJson);
      
      if (savedRecipesJson) {
        const recipes = JSON.parse(savedRecipesJson) as Recipe[];
        console.log('Parsed recipes:', recipes);
        const savedRecipes: SavedRecipe[] = recipes.map(recipe => ({
          ...recipe,
          savedAt: recipe.createdAt,
          isFavorite: false,
        }));
        console.log('Processed saved recipes:', savedRecipes);
        setState(prev => ({ ...prev, recipes: savedRecipes, isLoading: false }));
      } else {
        console.log('No saved recipes found');
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSavedRecipes();
    setRefreshing(false);
  }, [loadSavedRecipes]);

  useEffect(() => {
    loadSavedRecipes();
  }, [loadSavedRecipes]);

  const handleRecipePress = useCallback((recipe: SavedRecipe) => {
    setSelectedRecipe(recipe);
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

  const handleSearchChange = useCallback((searchQuery: string) => {
    setState(prev => ({ ...prev, searchQuery }));
  }, []);

  const filteredAndSortedRecipes = React.useMemo(() => {
    let result = [...state.recipes];
    console.log('Initial recipes for filtering:', result.length);

    // Apply search filter
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      result = result.filter(recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
      );
      console.log('After search filter:', result.length);
    }

    // Apply category filter
    if (state.filters.category && state.filters.category !== 'all') {
      if (state.filters.category === 'quick') {
        result = result.filter(recipe => (recipe.prepTime + recipe.cookTime) <= 30);
        console.log('After quick meals filter:', result.length);
      } else if (state.filters.category === 'weekend') {
        result = result.filter(recipe => (recipe.prepTime + recipe.cookTime) > 30);
        console.log('After weekend cooking filter:', result.length);
      }
    }

    // Apply other filters (keeping for backward compatibility)
    if (state.filters.favoritesOnly) {
      result = result.filter(recipe => recipe.isFavorite);
      console.log('After favorites filter:', result.length);
    }
    if (state.filters.cuisine) {
      result = result.filter(recipe => recipe.cuisine === state.filters.cuisine);
      console.log('After cuisine filter:', result.length);
    }
    if (state.filters.difficulty) {
      result = result.filter(recipe => recipe.difficulty === state.filters.difficulty);
      console.log('After difficulty filter:', result.length);
    }
    if (state.filters.diet) {
      result = result.filter(recipe => recipe.diet === state.filters.diet);
      console.log('After diet filter:', result.length);
    }

    // Apply sorting
    result.sort((a, b) => {
      const order = state.sortOrder === 'asc' ? 1 : -1;
      switch (state.sortBy) {
        case 'savedAt':
          return order * (new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
        case 'title':
          return order * a.title.localeCompare(b.title);
        case 'cookTime':
          return order * ((a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
        default:
          return 0;
      }
    });

    console.log('Final filtered and sorted recipes:', result.length);
    return result;
  }, [state.recipes, state.searchQuery, state.filters, state.sortBy, state.sortOrder]);

  return (
    <View style={styles.container}>
      <Header title="Saved Recipes" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            value={state.searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor="#999"
          />
          {state.searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearchChange('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <SavedRecipeFilters
        filters={state.filters}
        onFilterChange={handleFilterChange}
        currentSort={{ by: state.sortBy, order: state.sortOrder }}
        onSortChange={handleSortChange}
      />
      <View style={styles.content}>
        {state.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
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
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>

      <Modal
        visible={selectedRecipe !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedRecipe(null)}
      >
        {selectedRecipe && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setSelectedRecipe(null)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedRecipe.title}</Text>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalDescription}>{selectedRecipe.description}</Text>
              
              <View style={styles.modalDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Difficulty</Text>
                  <Text style={styles.detailValue}>{selectedRecipe.difficulty}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Cuisine</Text>
                  <Text style={styles.detailValue}>{selectedRecipe.cuisine}</Text>
                </View>
                {selectedRecipe.diet && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Diet</Text>
                    <Text style={styles.detailValue}>{selectedRecipe.diet}</Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Prep Time</Text>
                  <Text style={styles.detailValue}>{selectedRecipe.prepTime} mins</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Cook Time</Text>
                  <Text style={styles.detailValue}>{selectedRecipe.cookTime} mins</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Servings</Text>
                  <Text style={styles.detailValue}>{selectedRecipe.servings}</Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <Text key={index} style={styles.ingredient}>
                    • {ingredient}
                  </Text>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Instructions</Text>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <Text key={index} style={styles.instruction}>
                    {index + 1}. {instruction}
                  </Text>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
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
    padding: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.semantic.error,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  searchContainer: {
    padding: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    padding: spacing.sm,
    backgroundColor: colors.neutral.white,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
  },
  clearButton: {
    padding: spacing.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  closeButton: {
    padding: spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: spacing.md,
    color: colors.text.primary,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: spacing.md,
    color: colors.text.secondary,
  },
  modalDetails: {
    marginBottom: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontWeight: 'bold',
    marginRight: spacing.sm,
    color: colors.text.primary,
  },
  detailValue: {
    flex: 1,
    color: colors.text.secondary,
  },
  modalSection: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  ingredient: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
  instruction: {
    marginBottom: spacing.xs,
    color: colors.text.secondary,
  },
}); 