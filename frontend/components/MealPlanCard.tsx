import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealPlanCardProps, MealType } from '../types/planner';
import { colors, spacing } from '../design/designSystem';

export default function MealPlanCard({
  date,
  meals,
  onAddMeal,
  onRemoveMeal,
  onMealPress,
}: MealPlanCardProps): React.ReactElement {
  const renderMealSlot = (mealType: MealType) => {
    const meal = meals[mealType];
    const mealTitle = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    return (
      <View style={styles.mealSlot}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{mealTitle}</Text>
          {meal ? (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemoveMeal(mealType)}
            >
              <Ionicons name="close-circle" size={20} color={colors.semantic.error} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onAddMeal(mealType)}
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
        {meal ? (
          <TouchableOpacity
            style={styles.mealContent}
            onPress={() => onMealPress(meal)}
            activeOpacity={0.7}
          >
            <Text style={styles.recipeTitle}>{meal.title}</Text>
            <View style={styles.mealDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.detailText}>
                  {meal.prepTime + meal.cookTime} mins
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="flame-outline" size={16} color={colors.text.secondary} />
                <Text style={styles.detailText}>{meal.difficulty}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptyMeal}
            onPress={() => onAddMeal(mealType)}
            activeOpacity={0.7}
          >
            <Text style={styles.emptyMealText}>Add {mealTitle}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>
        {new Date(date).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </Text>
      {renderMealSlot('breakfast')}
      {renderMealSlot('lunch')}
      {renderMealSlot('dinner')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  mealSlot: {
    marginBottom: spacing.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  addButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  mealContent: {
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    padding: spacing.md,
  },
  recipeTitle: {
    fontSize: 14,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  mealDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  emptyMeal: {
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyMealText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 