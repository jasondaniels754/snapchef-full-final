import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { SavedRecipe, SavedRecipeListProps } from '../types/savedRecipe';
import RecipeCard from './RecipeCard';

export default function SavedRecipeList({
  recipes,
  onRecipePress,
  onFavoriteToggle,
  onDelete,
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
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
}); 