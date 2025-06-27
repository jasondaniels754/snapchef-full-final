import React, { useState } from 'react';
import { View, Button, ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import CuisinePicker from '../components/CuisinePicker';
import DifficultyPicker from '../components/DifficultyPicker';
import IngredientSlider from '../components/IngredientSlider';
import RecipeCard from '../components/RecipeCard';
import Header from '../components/Header';
import { generateRecipe } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GenerateScreen() {
  const [cuisine, setCuisine] = useState('Any');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numIngredients, setNumIngredients] = useState(5);
  const [recipes, setRecipes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    Alert.alert('Debug', `Generating recipe:\nDifficulty: ${difficulty}\nCuisine: ${cuisine}\nIngredients: ${numIngredients}`);
    console.log('Generating recipe with:', { difficulty, cuisine, numIngredients });
    setLoading(true);
    try {
      const recipeContent = await generateRecipe(difficulty, cuisine, numIngredients);
      console.log('Recipe generated:', recipeContent);
      
      if (!recipeContent) {
        throw new Error('No recipe content received');
      }
      
      setSelected(recipeContent);
      console.log('Selected recipe set to:', recipeContent);
    } catch (error) {
      console.error('Error generating recipe:', error);
      Alert.alert('Error', 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      const savedRecipes = await AsyncStorage.getItem('savedRecipes');
      const recipes = savedRecipes ? JSON.parse(savedRecipes) : [];
      
      if (!recipes.includes(recipe)) {
        recipes.push(recipe);
        await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipes));
        Alert.alert('Success', 'Recipe saved successfully!');
      } else {
        Alert.alert('Info', 'This recipe is already saved.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe.');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="SnapChef" />
      <View style={styles.content}>
        <Text style={styles.label}>Select Cuisine:</Text>
        <CuisinePicker 
          options={['Any','Italian','Mexican','Thai']} 
          selected={cuisine} 
          onSelect={(value) => {
            console.log('Cuisine selected:', value);
            setCuisine(value);
          }} 
        />
        
        <Text style={styles.label}>Select Difficulty:</Text>
        <DifficultyPicker 
          options={['Easy','Medium','Hard']} 
          selected={difficulty} 
          onSelect={(value) => {
            console.log('Difficulty selected:', value);
            setDifficulty(value);
          }} 
        />
        
        <Text style={styles.label}>Number of Ingredients:</Text>
        <IngredientSlider 
          max={10} 
          value={numIngredients} 
          onChange={(value) => {
            console.log('Ingredients changed:', value);
            setNumIngredients(value);
          }} 
        />
        
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />
        ) : (
          <TouchableOpacity 
            style={styles.generateButton}
            onPress={() => {
              console.log('Generate button pressed');
              handleGenerate();
            }}
          >
            <Text style={styles.generateButtonText}>Generate Recipe</Text>
          </TouchableOpacity>
        )}
        
        {selected ? (
          <RecipeCard 
            recipe={selected} 
            onClose={() => {
              console.log('Closing recipe modal');
              setSelected(null);
            }}
            onSave={() => {
              console.log('Saving recipe:', selected);
              handleSaveRecipe(selected);
            }}
          />
        ) : null}
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  loader: {
    marginVertical: 20,
  },
  generateButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
