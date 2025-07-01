import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { FormField } from '../components/ui/FormField';
import { generateRecipe } from '../services/api';
import { Recipe, RecipeFormData } from '../types/recipe';
import { SavedRecipe } from '../types/savedRecipe';
import Slider from '@react-native-community/slider';
import RecipeModal from '../components/RecipeModal';

const CUISINE_OPTIONS = [
  { label: 'Any', value: 'Any' },
  { label: 'Italian', value: 'Italian' },
  { label: 'Mexican', value: 'Mexican' },
  { label: 'Thai', value: 'Thai' },
  { label: 'Chinese', value: 'Chinese' },
  { label: 'Indian', value: 'Indian' },
  { label: 'Japanese', value: 'Japanese' },
  { label: 'Mediterranean', value: 'Mediterranean' },
];

const DIFFICULTY_OPTIONS = [
  { label: 'Easy', value: 'Easy' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Hard', value: 'Hard' },
];

const DIET_OPTIONS = [
  { label: 'None', value: 'None' },
  { label: 'Vegetarian', value: 'Vegetarian' },
  { label: 'Vegan', value: 'Vegan' },
  { label: 'Keto', value: 'Keto' },
  { label: 'Gluten-Free', value: 'Gluten-Free' },
  { label: 'Low-Carb', value: 'Low-Carb' },
];

const COOK_TIME_OPTIONS = [
  { label: '15 minutes', value: 15 },
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '60 minutes', value: 60 },
];

const SERVINGS_OPTIONS = [
  { label: '1 person', value: 1 },
  { label: '2 people', value: 2 },
  { label: '4 people', value: 4 },
  { label: '6 people', value: 6 },
  { label: '8 people', value: 8 },
];

export default function GenerateScreen(): React.ReactElement {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<RecipeFormData>({
    cuisine: 'Any',
    difficulty: 'Medium',
    numIngredients: 5,
    diet: 'None',
    cookTime: 30,
    servings: 4,
  });
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setIsSaved(false); // Reset saved status when generating new recipe
    try {
      console.log('Generating recipe with:', formData);
      const generatedRecipe = await generateRecipe(
        formData.difficulty,
        formData.cuisine,
        formData.numIngredients,
        formData.diet,
        formData.cookTime,
        formData.servings
      );
      
      console.log('Generated recipe:', JSON.stringify(generatedRecipe, null, 2));
      setRecipe(generatedRecipe);
      setModalVisible(true); // Open modal when recipe is generated
    } catch (error) {
      console.error('Error generating recipe:', error);
      Alert.alert('Error', 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async () => {
    if (!recipe) return;

    try {
      // Load existing saved recipes
      const savedRecipesJson = await AsyncStorage.getItem('savedRecipes');
      const existingRecipes: SavedRecipe[] = savedRecipesJson ? JSON.parse(savedRecipesJson) : [];

      // Check if recipe is already saved
      const isAlreadySaved = existingRecipes.some(r => r.id === recipe.id);
      if (isAlreadySaved) {
        Alert.alert('Already Saved', 'This recipe is already in your saved recipes.');
        return;
      }

      // Create saved recipe object
      const savedRecipe: SavedRecipe = {
        ...recipe,
        savedAt: new Date().toISOString(),
        isFavorite: false,
      };

      // Add to saved recipes
      const updatedRecipes = [...existingRecipes, savedRecipe];
      await AsyncStorage.setItem('savedRecipes', JSON.stringify(updatedRecipes));

      setIsSaved(true);
      Alert.alert('Success', 'Recipe saved to your collection!');
    } catch (error) {
      console.error('Error saving recipe:', error);
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenModal = () => {
    if (recipe) {
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.background.primary, borderBottomColor: theme.colors.neutral.light }]}>
          <View style={styles.logoContainer}>
            <Text variant="h1" style={[styles.logo, { color: theme.colors.primary.main }]}>
              🍳 SnapChef
            </Text>
            <Text variant="h2" style={styles.title}>
              Generate Recipe
            </Text>
            <Text variant="body" color="secondary" style={styles.subtitle}>
              Create a personalized recipe based on your preferences
            </Text>
          </View>
        </View>

        <View style={styles.form}>
          <FormField
            label="Cuisine Type"
            required
          >
            <Select
              value={formData.cuisine}
              options={CUISINE_OPTIONS}
              onChange={(value) => setFormData(prev => ({ ...prev, cuisine: value }))}
              placeholder="Select cuisine type"
            />
          </FormField>

          <FormField
            label="Difficulty Level"
            required
          >
            <Select
              value={formData.difficulty}
              options={DIFFICULTY_OPTIONS}
              onChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as 'Easy' | 'Medium' | 'Hard' }))}
              placeholder="Select difficulty level"
            />
          </FormField>

          <FormField
            label="Number of Ingredients"
            required
          >
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={formData.numIngredients}
                onValueChange={(value) => setFormData(prev => ({ ...prev, numIngredients: value }))}
                minimumTrackTintColor={theme.colors.primary.main}
                maximumTrackTintColor={theme.colors.neutral.light}
                thumbTintColor={theme.colors.primary.main}
              />
              <Text variant="body" style={styles.sliderValue}>
                {formData.numIngredients} {formData.numIngredients === 1 ? 'ingredient' : 'ingredients'}
              </Text>
            </View>
          </FormField>

          <FormField
            label="Diet"
            required
          >
            <Select
              value={formData.diet}
              options={DIET_OPTIONS}
              onChange={(value) => setFormData(prev => ({ ...prev, diet: value }))}
              placeholder="Select diet"
            />
          </FormField>

          <FormField
            label="Cook Time"
            required
          >
            <Select
              value={formData.cookTime.toString()}
              options={COOK_TIME_OPTIONS.map(option => ({ ...option, value: option.value.toString() }))}
              onChange={(value) => setFormData(prev => ({ ...prev, cookTime: parseInt(value) }))}
              placeholder="Select cook time"
            />
          </FormField>

          <FormField
            label="Servings"
            required
          >
            <Select
              value={formData.servings.toString()}
              options={SERVINGS_OPTIONS.map(option => ({ ...option, value: option.value.toString() }))}
              onChange={(value) => setFormData(prev => ({ ...prev, servings: parseInt(value) }))}
              placeholder="Select servings"
            />
          </FormField>

          <Button
            title={loading ? 'Generating...' : 'Generate Recipe'}
            onPress={handleGenerate}
            disabled={loading}
            loading={loading}
            style={styles.generateButton}
          />
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text variant="body" style={styles.loadingText}>Generating your recipe...</Text>
          </View>
        )}

        {recipe && !loading && (
          <View style={[
            styles.recipePreviewContainer,
            {
              backgroundColor: theme.colors.background.primary,
              shadowColor: theme.colors.text.primary,
            }
          ]}>
            <Text variant="h3" style={[
              styles.recipePreviewTitle,
              { color: theme.colors.primary.main }
            ]}>
              Recipe Generated Successfully! 🎉
            </Text>
            <Text variant="body" color="secondary" style={styles.recipePreviewDescription}>
              Your personalized recipe is ready to view
            </Text>
            <Button
              title="View Recipe"
              onPress={handleOpenModal}
              style={[
                styles.viewRecipeButton,
                {
                  backgroundColor: theme.colors.primary.main,
                  paddingHorizontal: theme.spacing.xl,
                  paddingVertical: theme.spacing.md,
                }
              ]}
            />
          </View>
        )}
      </ScrollView>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={recipe}
        visible={modalVisible}
        onClose={handleCloseModal}
        onSave={handleSaveRecipe}
        isSaved={isSaved}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
  },
  logoContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    padding: 24,
    gap: 24,
  },
  generateButton: {
    marginTop: 16,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
  },
  recipePreviewContainer: {
    padding: 24,
    margin: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  recipePreviewTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  recipePreviewDescription: {
    marginBottom: 16,
    textAlign: 'center',
  },
  viewRecipeButton: {
    borderRadius: 25,
  },
  sliderContainer: {
    marginTop: 4,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 4,
  },
}); 