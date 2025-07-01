import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Recipe } from '../../types/recipe';

interface RecipeMetadataCardProps {
  recipe: Recipe;
  slideAnim: Animated.Value;
}

export const RecipeMetadataCard: React.FC<RecipeMetadataCardProps> = ({
  recipe,
  slideAnim,
}) => {
  const { theme } = useTheme();

  const getIngredientEmoji = (ingredient: string) => {
    const lowerIngredient = ingredient.toLowerCase();
    if (lowerIngredient.includes('garlic')) return '🧄';
    if (lowerIngredient.includes('onion')) return '🧅';
    if (lowerIngredient.includes('butter')) return '🧈';
    if (lowerIngredient.includes('oil')) return '🫒';
    if (lowerIngredient.includes('salt')) return '🧂';
    if (lowerIngredient.includes('pepper')) return '🌶️';
    if (lowerIngredient.includes('cheese')) return '🧀';
    if (lowerIngredient.includes('milk')) return '🥛';
    if (lowerIngredient.includes('egg')) return '🥚';
    if (lowerIngredient.includes('flour')) return '🌾';
    if (lowerIngredient.includes('sugar')) return '🍯';
    if (lowerIngredient.includes('tomato')) return '🍅';
    if (lowerIngredient.includes('chicken')) return '🍗';
    if (lowerIngredient.includes('beef')) return '🥩';
    if (lowerIngredient.includes('fish')) return '🐟';
    if (lowerIngredient.includes('pasta')) return '🍝';
    if (lowerIngredient.includes('rice')) return '🍚';
    if (lowerIngredient.includes('bread')) return '🍞';
    return '🥄'; // Default emoji
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [{ translateY: slideAnim }],
      }
    ]}>
      <View style={[
        styles.card,
        {
          backgroundColor: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          ...theme.shadows.md,
        }
      ]}>
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <View style={[
              styles.iconContainer,
              {
                backgroundColor: theme.colors.primary.main,
                borderRadius: theme.borderRadius.full,
              }
            ]}>
              <Ionicons name="restaurant" size={16} color={theme.colors.background.primary} />
            </View>
            <Text style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.caption.fontSize,
              }
            ]}>
              Difficulty
            </Text>
            <Text style={[
              styles.value,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.body.fontSize,
                fontWeight: '600' as const,
              }
            ]}>
              {recipe.difficulty || 'Medium'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[
              styles.iconContainer,
              {
                backgroundColor: theme.colors.primary.main,
                borderRadius: theme.borderRadius.full,
              }
            ]}>
              <Ionicons name="flag" size={16} color={theme.colors.background.primary} />
            </View>
            <Text style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.caption.fontSize,
              }
            ]}>
              Cuisine
            </Text>
            <Text style={[
              styles.value,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.body.fontSize,
                fontWeight: '600' as const,
              }
            ]}>
              {recipe.cuisine || 'Any'}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[
              styles.iconContainer,
              {
                backgroundColor: theme.colors.primary.main,
                borderRadius: theme.borderRadius.full,
              }
            ]}>
              <Ionicons name="time" size={16} color={theme.colors.background.primary} />
            </View>
            <Text style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.caption.fontSize,
              }
            ]}>
              Prep Time
            </Text>
            <Text style={[
              styles.value,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.body.fontSize,
                fontWeight: '600' as const,
              }
            ]}>
              {recipe.prepTime || 0} mins
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={[
              styles.iconContainer,
              {
                backgroundColor: theme.colors.primary.main,
                borderRadius: theme.borderRadius.full,
              }
            ]}>
              <Ionicons name="flame" size={16} color={theme.colors.background.primary} />
            </View>
            <Text style={[
              styles.label,
              {
                color: theme.colors.text.secondary,
                fontSize: theme.typography.caption.fontSize,
              }
            ]}>
              Cook Time
            </Text>
            <Text style={[
              styles.value,
              {
                color: theme.colors.text.primary,
                fontSize: theme.typography.body.fontSize,
                fontWeight: '600' as const,
              }
            ]}>
              {recipe.cookTime || 0} mins
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  card: {
    padding: 20,
    marginHorizontal: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    textAlign: 'center',
  },
}); 