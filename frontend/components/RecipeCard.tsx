import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RecipeCardProps } from '../types/recipe';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../design/designSystem';

export default function RecipeCard({ recipe, onClose, onSave }: RecipeCardProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionContainer}>
              <Text style={styles.instructionNumber}>{index + 1}</Text>
              <Text style={styles.instruction}>{instruction}</Text>
            </View>
          ))}
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{recipe.prepTime + recipe.cookTime} mins</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="restaurant-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{recipe.servings} servings</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="flame-outline" size={20} color="#666" />
            <Text style={styles.detailText}>{recipe.difficulty}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Ionicons name="bookmark-outline" size={24} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.text.primary,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text.primary,
    flex: 1,
    marginRight: spacing.md,
  },
  closeButton: {
    padding: spacing.xs,
  },
  content: {
    padding: spacing.md,
  },
  description: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  ingredient: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    lineHeight: 24,
  },
  instructionContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.main,
    color: colors.text.inverse,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
  instruction: {
    flex: 1,
    fontSize: 16,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: spacing.sm,
    fontSize: 14,
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  saveButton: {
    backgroundColor: colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
}); 