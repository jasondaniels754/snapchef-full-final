import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { colors, spacing } from '../design/designSystem';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { FormField } from '../components/ui/FormField';
import { generateRecipe } from '../services/api';
import { Recipe, RecipeFormData } from '../types/recipe';
import Slider from '@react-native-community/slider';

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

export default function GenerateScreen(): React.ReactElement {
  const [formData, setFormData] = useState<RecipeFormData>({
    cuisine: 'Any',
    difficulty: 'Medium',
    numIngredients: 5,
  });
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      console.log('Generating recipe with:', formData);
      const generatedRecipe = await generateRecipe(
        formData.difficulty,
        formData.cuisine,
        formData.numIngredients
      );
      
      console.log('Generated recipe:', JSON.stringify(generatedRecipe, null, 2));
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      Alert.alert('Error', 'Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text variant="h1" style={styles.logo}>SnapChef</Text>
          </View>
          <Text variant="h2" style={styles.title}>Generate Recipe</Text>
          <Text variant="body" color="secondary" style={styles.subtitle}>
            Create a personalized recipe based on your preferences
          </Text>
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
                minimumTrackTintColor={colors.primary.main}
                maximumTrackTintColor={colors.neutral.border}
                thumbTintColor={colors.primary.main}
              />
              <Text variant="body" style={styles.sliderValue}>
                {formData.numIngredients} {formData.numIngredients === 1 ? 'ingredient' : 'ingredients'}
              </Text>
            </View>
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
            <ActivityIndicator size="large" color={colors.primary.main} />
            <Text variant="body" style={styles.loadingText}>Generating your recipe...</Text>
          </View>
        )}

        {recipe && !loading && (
          <View style={styles.recipeContainer}>
            <Text variant="h2" style={styles.recipeTitle}>{recipe.title}</Text>
            <Text variant="body" color="secondary" style={styles.recipeDescription}>
              {recipe.description}
            </Text>

            <View style={styles.recipeDetails}>
              <View style={styles.detailItem}>
                <Text variant="caption" color="secondary">Difficulty</Text>
                <Text variant="body">{recipe.difficulty}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="caption" color="secondary">Cuisine</Text>
                <Text variant="body">{recipe.cuisine}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="caption" color="secondary">Prep Time</Text>
                <Text variant="body">{recipe.prepTime} mins</Text>
              </View>
              <View style={styles.detailItem}>
                <Text variant="caption" color="secondary">Cook Time</Text>
                <Text variant="body">{recipe.cookTime} mins</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text variant="h3" style={styles.sectionTitle}>Ingredients</Text>
              {recipe.ingredients.map((ingredient, index) => (
                <Text key={index} variant="body" style={styles.ingredient}>
                  • {ingredient}
                </Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text variant="h3" style={styles.sectionTitle}>Instructions</Text>
              {recipe.instructions.map((instruction, index) => (
                <Text key={index} variant="body" style={styles.instruction}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  logoContainer: {
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  logo: {
    color: colors.primary.main,
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  form: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  generateButton: {
    marginTop: spacing.md,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
  },
  recipeContainer: {
    padding: spacing.lg,
    backgroundColor: colors.neutral.white,
    margin: spacing.lg,
    borderRadius: 8,
    shadowColor: colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeTitle: {
    marginBottom: spacing.xs,
  },
  recipeDescription: {
    marginBottom: spacing.lg,
  },
  recipeDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
  },
  detailItem: {
    flex: 1,
    minWidth: '45%',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  ingredient: {
    marginBottom: spacing.xs,
  },
  instruction: {
    marginBottom: spacing.md,
  },
  sliderContainer: {
    marginTop: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: spacing.xs,
    color: colors.text.primary,
  },
}); 