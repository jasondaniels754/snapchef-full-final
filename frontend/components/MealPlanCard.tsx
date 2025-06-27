import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MealPlanCardProps, MealType } from '../types/planner';

export default function MealPlanCard({
  mealPlan,
  onMealAdd,
  onMealRemove,
}: MealPlanCardProps): React.ReactElement {
  const renderMealSlot = (mealType: MealType) => {
    const meal = mealPlan.meals[mealType];
    const mealTitle = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    return (
      <View style={styles.mealSlot}>
        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>{mealTitle}</Text>
          {meal ? (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onMealRemove(mealType)}
            >
              <Ionicons name="close-circle" size={20} color="#FF6B6B" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onMealAdd(mealType)}
            >
              <Ionicons name="add-circle-outline" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {meal ? (
          <View style={styles.mealContent}>
            <Text style={styles.recipeTitle}>{meal.title}</Text>
            <View style={styles.mealDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.detailText}>
                  {meal.prepTime + meal.cookTime} mins
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="flame-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{meal.difficulty}</Text>
              </View>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.emptyMeal}
            onPress={() => onMealAdd(mealType)}
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
        {new Date(mealPlan.date).toLocaleDateString('en-US', {
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    color: '#333',
    marginBottom: 16,
  },
  mealSlot: {
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    padding: 4,
  },
  removeButton: {
    padding: 4,
  },
  mealContent: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  recipeTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  mealDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyMeal: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  emptyMealText: {
    fontSize: 14,
    color: '#666',
  },
}); 