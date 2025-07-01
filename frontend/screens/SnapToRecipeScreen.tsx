import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { analyzeImage, generateRecipeFromIngredients } from '../services/api';
import { Recipe } from '../types/recipe';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const { width, height } = Dimensions.get('window');

export default function SnapToRecipeScreen(): React.ReactElement {
  const { theme } = useTheme();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState<'camera' | 'analysis' | 'recipe'>('camera');

  React.useEffect(() => {
    console.log('SnapToRecipe screen loaded');
  }, []);



  const pickImage = async () => {
    try {
      // For now, let's simulate image picking with a mock image
      // This will let us test the rest of the flow
      console.log('Simulating image pick...');
      
      // Simulate a delay like real image picking
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use a mock image URI (this won't actually work for analysis, but will test the UI)
      const mockImageUri = 'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Mock+Ingredients';
      setCapturedImage(mockImageUri);
      setCurrentStep('analysis');
      
      // For testing, let's also simulate detected ingredients
      setTimeout(() => {
        setDetectedIngredients(['tomato', 'onion', 'garlic', 'bell pepper', 'olive oil']);
      }, 2000);
      
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeCapturedImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    try {
      // For testing with mock data, skip actual image analysis
      if (capturedImage.includes('placeholder.com')) {
        // Simulate analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setDetectedIngredients(['tomato', 'onion', 'garlic', 'bell pepper', 'olive oil']);
        setIsAnalyzing(false);
        return;
      }

      // Real image analysis (for when we fix the image picker)
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        
        const ingredients = await analyzeImage(base64Data);
        setDetectedIngredients(ingredients);
        setIsAnalyzing(false);
      };
      
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to analyze image');
      setIsAnalyzing(false);
    }
  };

  const generateRecipeFromDetectedIngredients = async () => {
    if (detectedIngredients.length === 0) return;

    setIsGenerating(true);
    try {
      const recipe = await generateRecipeFromIngredients(
        detectedIngredients,
        'Any', // cuisine
        'Medium', // difficulty
        'Regular', // diet
        2, // servings
        30 // cookTime
      );
      setGeneratedRecipe(recipe);
      setCurrentStep('recipe');
    } catch (error) {
      console.error('Error generating recipe:', error);
      Alert.alert('Error', 'Failed to generate recipe');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetFlow = () => {
    setCapturedImage(null);
    setDetectedIngredients([]);
    setGeneratedRecipe(null);
    setCurrentStep('camera');
  };

    const renderCameraView = () => (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.cameraContainer}>
        <View style={styles.cameraOverlay}>
          <View style={styles.cameraHeader}>
            <Text style={[styles.cameraTitle, { color: theme.colors.text.primary }]}>
              Snap Your Ingredients
            </Text>
            <Text style={[styles.cameraSubtitle, { color: theme.colors.text.secondary }]}>
              Select a photo of your ingredients to generate a recipe
            </Text>
          </View>
          
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={[styles.cameraButton, { backgroundColor: theme.colors.primary.main }]}
              onPress={pickImage}
            >
              <Ionicons name="images" size={32} color="white" />
            </TouchableOpacity>
            
            <Text style={[styles.cameraSubtitle, { color: theme.colors.text.secondary, marginTop: 20 }]}>
              Tap to select from your photo library
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAnalysisView = () => (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.analysisContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Image Analysis
        </Text>
        
        {capturedImage && (
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        )}
        
        {isAnalyzing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
              Analyzing ingredients...
            </Text>
          </View>
        ) : detectedIngredients.length > 0 ? (
          <Card style={styles.ingredientsCard}>
            <Text style={[styles.ingredientsTitle, { color: theme.colors.text.primary }]}>
              Detected Ingredients:
            </Text>
            <View style={styles.ingredientsList}>
              {detectedIngredients.map((ingredient, index) => (
                <View key={index} style={[styles.ingredientItem, { backgroundColor: theme.colors.neutral.light }]}>
                  <Text style={[styles.ingredientText, { color: theme.colors.text.primary }]}>
                    {ingredient}
                  </Text>
                </View>
              ))}
            </View>
            
            <View style={styles.actionButtons}>
              <Button
                onPress={generateRecipeFromDetectedIngredients}
                title="Generate Recipe"
                loading={isGenerating}
                style={styles.generateButton}
              />
              <Button
                onPress={resetFlow}
                title="Take New Photo"
                variant="outline"
                style={styles.retakeButton}
              />
            </View>
          </Card>
        ) : (
          <View style={styles.analysisActions}>
            <Button
              onPress={analyzeCapturedImage}
              title="Analyze Image"
              style={styles.analyzeButton}
            />
            <Button
              onPress={resetFlow}
              title="Take New Photo"
              variant="outline"
              style={styles.retakeButton}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );

  const renderRecipeView = () => (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.recipeContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          Generated Recipe
        </Text>
        
        {generatedRecipe && (
          <View style={styles.recipeCard}>
            <Text style={[styles.recipeTitle, { color: theme.colors.text.primary }]}>
              {generatedRecipe.title}
            </Text>
            <Text style={[styles.recipeDescription, { color: theme.colors.text.secondary }]}>
              {generatedRecipe.description}
            </Text>
            
            <View style={styles.recipeSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Ingredients
              </Text>
              {generatedRecipe.ingredients.map((ingredient, index) => (
                <Text key={index} style={[styles.ingredientText, { color: theme.colors.text.secondary }]}>
                  • {ingredient}
                </Text>
              ))}
            </View>
            
            <View style={styles.recipeSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Instructions
              </Text>
              {generatedRecipe.instructions.map((instruction, index) => (
                <Text key={index} style={[styles.instructionText, { color: theme.colors.text.secondary }]}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
            
            <View style={styles.recipeDetails}>
              <Text style={[styles.detailText, { color: theme.colors.text.secondary }]}>
                Prep: {generatedRecipe.prepTime}min | Cook: {generatedRecipe.cookTime}min | Servings: {generatedRecipe.servings}
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.recipeActions}>
          <Button
            onPress={resetFlow}
            title="Create Another Recipe"
            style={styles.newRecipeButton}
          />
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      {currentStep === 'camera' && renderCameraView()}
      {currentStep === 'analysis' && renderAnalysisView()}
      {currentStep === 'recipe' && renderRecipeView()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },

  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraHeader: {
    alignItems: 'center',
    marginTop: 60,
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cameraSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    gap: 20,
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  analysisContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  capturedImage: {
    width: width - 40,
    height: (width - 40) * 0.75,
    borderRadius: 12,
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  ingredientsCard: {
    padding: 20,
    marginBottom: 20,
  },
  ingredientsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  ingredientItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    gap: 12,
  },
  generateButton: {
    marginBottom: 8,
  },
  retakeButton: {
    marginBottom: 8,
  },
  analysisActions: {
    gap: 12,
    marginTop: 20,
  },
  analyzeButton: {
    marginBottom: 8,
  },
  recipeContainer: {
    flex: 1,
    padding: 20,
  },
  recipeActions: {
    marginTop: 20,
  },
  newRecipeButton: {
    marginBottom: 8,
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 16,
    marginBottom: 16,
    lineHeight: 24,
  },
  recipeSection: {
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  recipeDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 14,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
}); 