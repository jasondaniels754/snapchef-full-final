import React from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SavedRecipe, SavedRecipeListProps } from '../types/savedRecipe';
import SavedRecipeItem from './SavedRecipeItem';
import { colors, spacing } from '../design/designSystem';

export default function SavedRecipeList({
  recipes,
  onRecipePress,
  onFavoriteToggle,
  onDelete,
  refreshing = false,
  onRefresh,
}: SavedRecipeListProps): React.ReactElement {
  console.log('📱 SavedRecipeList render - refreshing:', refreshing, 'onRefresh:', !!onRefresh);
  
  const renderItem = ({ item }: { item: SavedRecipe }) => (
    <SavedRecipeItem
      recipe={item}
      onPress={onRecipePress}
      onFavoriteToggle={onFavoriteToggle}
      onDelete={onDelete}
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
    paddingVertical: spacing.sm,
  },
}); 