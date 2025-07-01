import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModalContentProps } from '../types/modal';
import { Recipe } from '../types/recipe';
import { useTheme } from '../contexts/ThemeContext';
import { Text } from './ui/Text';
import { RecipeHeader } from './ui/RecipeHeader';
import { RecipeMetadataCard } from './ui/RecipeMetadataCard';
import { IngredientChecklist } from './ui/IngredientChecklist';
import { SeasoningsSection } from './ui/SeasoningsSection';
import { RecipeInstructions } from './ui/RecipeInstructions';
import { AnimatedSaveButton } from './ui/AnimatedSaveButton';

export default function ModalContent({ 
  recipe, 
  onSave, 
  isSaved, 
  onClose 
}: ModalContentProps): React.ReactElement {
  const { theme } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered animations on mount
    Animated.sequence([
      // Badge bounce
      Animated.timing(badgeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Title fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Content slide up
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Extensive data validation with fallbacks
  const validateRecipe = (recipe: Recipe): boolean => {
    console.log('🔍 Validating recipe data:', {
      hasTitle: !!recipe.title,
      hasDescription: !!recipe.description,
      hasIngredients: Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0,
      hasInstructions: Array.isArray(recipe.instructions) && recipe.instructions.length > 0,
      hasDifficulty: !!recipe.difficulty,
      hasCuisine: !!recipe.cuisine,
      hasPrepTime: typeof recipe.prepTime === 'number',
      hasCookTime: typeof recipe.cookTime === 'number',
    });
    
    return !!(
      recipe.title &&
      recipe.description &&
      Array.isArray(recipe.ingredients) &&
      recipe.ingredients.length > 0 &&
      Array.isArray(recipe.instructions) &&
      recipe.instructions.length > 0
    );
  };

  const isValidRecipe = validateRecipe(recipe);

  if (!isValidRecipe) {
    console.error('❌ Recipe data validation failed:', recipe);
    return (
      <View style={[
        styles.errorContainer,
        {
          backgroundColor: theme.colors.background.primary,
          borderRadius: theme.borderRadius.xl,
          ...theme.shadows.lg,
        }
      ]}>
        <Ionicons name="alert-circle" size={48} color={theme.colors.semantic.error} />
        <Text variant="h3" style={[styles.errorTitle, { color: theme.colors.semantic.error }]}>
          Recipe Data Error
        </Text>
        <Text variant="body" color="secondary" style={styles.errorText}>
          The recipe data is incomplete or invalid. Please try generating a new recipe.
        </Text>
        <TouchableOpacity
          style={[
            styles.errorButton,
            {
              backgroundColor: theme.colors.semantic.error,
              borderRadius: theme.borderRadius.full,
            }
          ]}
          onPress={onClose}
        >
          <Text style={[styles.errorButtonText, { color: theme.colors.background.primary }]}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        ...theme.shadows.lg,
      }
    ]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Recipe Header with Badge */}
        <RecipeHeader
          recipe={recipe}
          onClose={onClose}
          fadeAnim={fadeAnim}
          slideAnim={slideAnim}
        />

        {/* Enhanced Metadata Card */}
        <RecipeMetadataCard
          recipe={recipe}
          slideAnim={slideAnim}
        />

        {/* Interactive Ingredient Checklist */}
        <IngredientChecklist
          ingredients={recipe.ingredients || []}
          slideAnim={slideAnim}
        />

        {/* Seasonings Section */}
        <SeasoningsSection
          seasonings={recipe.seasonings || []}
          slideAnim={slideAnim}
        />

        {/* Enhanced Instructions */}
        <RecipeInstructions
          instructions={recipe.instructions || []}
          slideAnim={slideAnim}
        />

        {/* Animated Save Button */}
        {onSave && (
          <View style={styles.saveContainer}>
            <AnimatedSaveButton
              onPress={onSave}
              isSaved={isSaved || false}
              disabled={isSaved}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    maxHeight: '90%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  saveContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  errorContainer: {
    margin: 16,
    padding: 32,
    alignItems: 'center',
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  errorButtonText: {
    fontWeight: '600',
  },
}); 