import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';

export default function SavedScreen() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedRecipes');
      if (saved) {
        setSavedRecipes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load saved recipes:', error);
    }
  };

  const handleRecipePress = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <Text 
        style={styles.recipeText}
        onPress={() => handleRecipePress(item)}
      >
        {item.split('\n')[0]} {/* Display first line as title */}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="SnapChef" />
      <View style={styles.content}>
        {savedRecipes.length === 0 ? (
          <Text style={styles.emptyText}>No saved recipes yet</Text>
        ) : (
          <FlatList
            data={savedRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item, index) => index.toString()}
            style={styles.list}
          />
        )}
        {selectedRecipe && (
          <RecipeCard
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  list: {
    flex: 1,
  },
  recipeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recipeText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});
