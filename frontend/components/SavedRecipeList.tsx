import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SavedRecipe, SavedRecipeListProps } from '../types/savedRecipe';
import RecipeCard from './RecipeCard';
import { colors } from '../design/designSystem';

export default function SavedRecipeList({
  recipes,
  onRecipePress,
  onFavoriteToggle,
  onDelete,
  refreshing = false,
  onRefresh,
}: SavedRecipeListProps): React.ReactElement {
  const renderItem = ({ item }: { item: SavedRecipe }) => (
    <RecipeCard
      recipe={item}
      onClose={() => onDelete(item)}
      onSave={() => onFavoriteToggle(item)}
    />
  );

  return (
    <FlatList
      data={recipes}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        ) : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
}); 