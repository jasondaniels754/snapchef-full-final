import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Recipe } from '../../types/recipe';
import { useTheme } from '../../contexts/ThemeContext';

interface RecipeBadgeProps {
  recipe: Recipe;
}

const getRecipeBadge = (recipe: Recipe) => {
  if (recipe.difficulty === 'Easy') {
    return { emoji: '🟢', text: 'Easy Peasy' };
  }
  if (recipe.diet === 'Vegetarian') {
    return { emoji: '🥗', text: 'Plant-Based' };
  }
  if (recipe.diet === 'Vegan') {
    return { emoji: '🌱', text: 'Vegan' };
  }
  if (recipe.cookTime <= 20) {
    return { emoji: '⚡', text: 'Quick Fix' };
  }
  if (recipe.cookTime <= 30) {
    return { emoji: '⏱️', text: 'Fast & Fresh' };
  }
  if (recipe.cuisine === 'Italian') {
    return { emoji: '🇮🇹', text: 'Italian Classic' };
  }
  if (recipe.cuisine === 'Mexican') {
    return { emoji: '🇲🇽', text: 'Mexican Fiesta' };
  }
  if (recipe.cuisine === 'Thai') {
    return { emoji: '🇹🇭', text: 'Thai Spice' };
  }
  if (recipe.cuisine === 'Japanese') {
    return { emoji: '🇯🇵', text: 'Japanese Delight' };
  }
  if (recipe.cuisine === 'Mediterranean') {
    return { emoji: '🌊', text: 'Mediterranean' };
  }
  
  return { emoji: '🔥', text: 'Chef\'s Pick' };
};

export const RecipeBadge: React.FC<RecipeBadgeProps> = ({ recipe }) => {
  const { theme } = useTheme();
  const badge = getRecipeBadge(recipe);

  return (
    <View style={[
      styles.badge,
      {
        backgroundColor: theme.colors.secondary.light,
        borderRadius: theme.borderRadius.full,
      }
    ]}>
      <Text style={styles.emoji}>{badge.emoji}</Text>
      <Text style={[
        styles.text,
        {
          color: theme.colors.text.primary,
          fontSize: theme.typography.caption.fontSize,
        }
      ]}>
        {badge.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  text: {
    fontWeight: '600',
  },
}); 