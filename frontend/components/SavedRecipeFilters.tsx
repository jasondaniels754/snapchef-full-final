import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedRecipeFiltersProps } from '../types/savedRecipe';

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
            color={filters.favoritesOnly ? '#FF6B6B' : '#666'}
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
            color={filters.cuisine ? '#FF6B6B' : '#666'}
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
            color={filters.difficulty ? '#FF6B6B' : '#666'}
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
            color={filters.diet ? '#FF6B6B' : '#666'}
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
              color="#FF6B6B"
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
              color="#FF6B6B"
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
              color="#FF6B6B"
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    width: '48%',
    marginBottom: 8,
    justifyContent: 'center',
  },
  activeFilter: {
    backgroundColor: '#FFE5E5',
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#FF6B6B',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  activeSort: {
    backgroundColor: '#FFE5E5',
  },
  sortText: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  activeSortText: {
    color: '#FF6B6B',
  },
}); 