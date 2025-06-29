import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedRecipe } from '../types/savedRecipe';
import { colors, spacing } from '../design/designSystem';

interface SavedRecipeItemProps {
  recipe: SavedRecipe;
  onPress: (recipe: SavedRecipe) => void;
  onFavoriteToggle: (recipe: SavedRecipe) => void;
  onDelete: (recipe: SavedRecipe) => void;
}

export default function SavedRecipeItem({
  recipe,
  onPress,
  onFavoriteToggle,
  onDelete,
}: SavedRecipeItemProps): React.ReactElement {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(recipe)}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <TouchableOpacity
            onPress={() => onFavoriteToggle(recipe)}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={recipe.isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={recipe.isFavorite ? colors.primary.main : colors.text.tertiary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.detailText}>
              {recipe.prepTime + recipe.cookTime} mins
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="restaurant-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{recipe.cuisine}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="flame-outline" size={16} color={colors.text.tertiary} />
            <Text style={styles.detailText}>{recipe.difficulty}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.savedDate}>
            Saved {new Date(recipe.savedAt).toLocaleDateString()}
          </Text>
          <TouchableOpacity
            onPress={() => onDelete(recipe)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={colors.semantic.error} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    borderRadius: 12,
    shadowColor: colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.sm,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  description: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  savedDate: {
    fontSize: 12,
    color: colors.text.tertiary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
}); 