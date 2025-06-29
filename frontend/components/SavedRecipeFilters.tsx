import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedRecipeFiltersProps } from '../types/savedRecipe';
import { colors, spacing } from '../design/designSystem';

export default function SavedRecipeFilters({
  filters,
  onFilterChange,
  currentSort,
  onSortChange,
}: SavedRecipeFiltersProps): React.ReactElement {
  const handleSortToggle = (newSortBy: typeof currentSort.by) => {
    if (currentSort.by === newSortBy) {
      onSortChange(newSortBy, currentSort.order === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(newSortBy, 'desc');
    }
  };

  const handleCategoryChange = (category: 'all' | 'quick' | 'weekend') => {
    // Reset all filters and set the new category
    onFilterChange({
      favoritesOnly: false,
      cuisine: null,
      difficulty: null,
      diet: null,
      category: category,
    });
  };

  return (
    <View style={styles.container}>
      {/* Category Filters */}
      <View style={styles.categoryRow}>
        <TouchableOpacity
          style={[styles.categoryButton, !filters.category || filters.category === 'all' ? styles.activeCategory : null]}
          onPress={() => handleCategoryChange('all')}
        >
          <Ionicons
            name="restaurant-outline"
            size={20}
            color={!filters.category || filters.category === 'all' ? colors.primary.main : colors.text.tertiary}
          />
          <Text style={[styles.categoryText, !filters.category || filters.category === 'all' ? styles.activeCategoryText : null]}>
            All Recipes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton, filters.category === 'quick' ? styles.activeCategory : null]}
          onPress={() => handleCategoryChange('quick')}
        >
          <Ionicons
            name="flash-outline"
            size={20}
            color={filters.category === 'quick' ? colors.primary.main : colors.text.tertiary}
          />
          <Text style={[styles.categoryText, filters.category === 'quick' ? styles.activeCategoryText : null]}>
            Quick Meals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.categoryButton, filters.category === 'weekend' ? styles.activeCategory : null]}
          onPress={() => handleCategoryChange('weekend')}
        >
          <Ionicons
            name="time-outline"
            size={20}
            color={filters.category === 'weekend' ? colors.primary.main : colors.text.tertiary}
          />
          <Text style={[styles.categoryText, filters.category === 'weekend' ? styles.activeCategoryText : null]}>
            Weekend Cooking
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, currentSort.by === 'savedAt' ? styles.activeSort : null]}
          onPress={() => handleSortToggle('savedAt')}
        >
          <Text style={[styles.sortText, currentSort.by === 'savedAt' ? styles.activeSortText : null]}>
            Date
          </Text>
          {currentSort.by === 'savedAt' && (
            <Ionicons
              name={currentSort.order === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={colors.primary.main}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, currentSort.by === 'title' ? styles.activeSort : null]}
          onPress={() => handleSortToggle('title')}
        >
          <Text style={[styles.sortText, currentSort.by === 'title' ? styles.activeSortText : null]}>
            Name
          </Text>
          {currentSort.by === 'title' && (
            <Ionicons
              name={currentSort.order === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={colors.primary.main}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sortButton, currentSort.by === 'cookTime' ? styles.activeSort : null]}
          onPress={() => handleSortToggle('cookTime')}
        >
          <Text style={[styles.sortText, currentSort.by === 'cookTime' ? styles.activeSortText : null]}>
            Time
          </Text>
          {currentSort.by === 'cookTime' && (
            <Ionicons
              name={currentSort.order === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color={colors.primary.main}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.neutral.background,
    width: '30%',
    justifyContent: 'center',
  },
  activeCategory: {
    backgroundColor: colors.primary.light + '20', // 20% opacity
  },
  categoryText: {
    marginLeft: spacing.xs,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  activeCategoryText: {
    color: colors.primary.main,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: spacing.sm,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.neutral.background,
  },
  activeSort: {
    backgroundColor: colors.primary.light + '20', // 20% opacity
  },
  sortText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: spacing.xs,
  },
  activeSortText: {
    color: colors.primary.main,
  },
}); 