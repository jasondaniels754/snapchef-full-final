import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedRecipeFiltersProps } from '../types/savedRecipe';
import { colors, spacing } from '../design/designSystem';

const DIET_OPTIONS = [
  'None',
  'Vegetarian',
  'Vegan',
  'Keto',
  'Gluten-Free',
  'Low-Carb',
];

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

  const handleDietFilter = () => {
    if (!filters.diet) {
      onFilterChange({ ...filters, diet: 'Vegetarian' });
    } else {
      const currentIndex = DIET_OPTIONS.indexOf(filters.diet);
      const nextIndex = (currentIndex + 1) % DIET_OPTIONS.length;
      onFilterChange({ ...filters, diet: DIET_OPTIONS[nextIndex] });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterGrid}>
        <TouchableOpacity
          style={[styles.filterButton, filters.favoritesOnly ? styles.activeFilter : null]}
          onPress={() => onFilterChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
        >
          <Ionicons
            name={filters.favoritesOnly ? 'heart' : 'heart-outline'}
            size={20}
            color={filters.favoritesOnly ? colors.primary.main : colors.text.secondary}
          />
          <Text style={[styles.filterText, filters.favoritesOnly ? styles.activeFilterText : null]}>
            Favorites
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filters.cuisine ? styles.activeFilter : null]}
          onPress={() => onFilterChange({ ...filters, cuisine: filters.cuisine ? null : 'Italian' })}
        >
          <Ionicons
            name="restaurant-outline"
            size={20}
            color={filters.cuisine ? colors.primary.main : colors.text.secondary}
          />
          <Text style={[styles.filterText, filters.cuisine ? styles.activeFilterText : null]}>
            {filters.cuisine || 'Cuisine'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filters.difficulty ? styles.activeFilter : null]}
          onPress={() => onFilterChange({ ...filters, difficulty: filters.difficulty ? null : 'Easy' })}
        >
          <Ionicons
            name="flame-outline"
            size={20}
            color={filters.difficulty ? colors.primary.main : colors.text.secondary}
          />
          <Text style={[styles.filterText, filters.difficulty ? styles.activeFilterText : null]}>
            {filters.difficulty || 'Difficulty'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, filters.diet ? styles.activeFilter : null]}
          onPress={handleDietFilter}
        >
          <Ionicons
            name="leaf-outline"
            size={20}
            color={filters.diet ? colors.primary.main : colors.text.secondary}
          />
          <Text style={[styles.filterText, filters.diet ? styles.activeFilterText : null]}>
            {filters.diet || 'Diet'}
          </Text>
        </TouchableOpacity>
      </View>

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
            Title
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
          style={[styles.sortButton, currentSort.by === 'difficulty' ? styles.activeSort : null]}
          onPress={() => handleSortToggle('difficulty')}
        >
          <Text style={[styles.sortText, currentSort.by === 'difficulty' ? styles.activeSortText : null]}>
            Difficulty
          </Text>
          {currentSort.by === 'difficulty' && (
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
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.neutral.background,
    width: '48%',
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: colors.primary.light + '20', // 20% opacity
  },
  filterText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: colors.text.secondary,
  },
  activeFilterText: {
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