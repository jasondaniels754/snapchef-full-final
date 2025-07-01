import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface IngredientChecklistProps {
  ingredients: string[];
  slideAnim: Animated.Value;
}

export const IngredientChecklist: React.FC<IngredientChecklistProps> = ({
  ingredients,
  slideAnim,
}) => {
  const { theme } = useTheme();
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const getIngredientEmoji = (ingredient: string) => {
    const lowerIngredient = ingredient.toLowerCase();
    if (lowerIngredient.includes('garlic')) return '🧄';
    if (lowerIngredient.includes('onion')) return '🧅';
    if (lowerIngredient.includes('butter')) return '🧈';
    if (lowerIngredient.includes('oil')) return '🫒';
    if (lowerIngredient.includes('salt')) return '🧂';
    if (lowerIngredient.includes('pepper')) return '🌶️';
    if (lowerIngredient.includes('cheese')) return '🧀';
    if (lowerIngredient.includes('milk')) return '🥛';
    if (lowerIngredient.includes('egg')) return '🥚';
    if (lowerIngredient.includes('flour')) return '🌾';
    if (lowerIngredient.includes('sugar')) return '🍯';
    if (lowerIngredient.includes('tomato')) return '🍅';
    if (lowerIngredient.includes('chicken')) return '🍗';
    if (lowerIngredient.includes('beef')) return '🥩';
    if (lowerIngredient.includes('fish')) return '🐟';
    if (lowerIngredient.includes('pasta')) return '🍝';
    if (lowerIngredient.includes('rice')) return '🍚';
    if (lowerIngredient.includes('bread')) return '🍞';
    return '🥄';
  };

  const toggleItem = (index: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedItems(newChecked);
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [{ translateY: slideAnim }],
      }
    ]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={20} color={theme.colors.primary.main} />
          <Text style={[
            styles.sectionTitle,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.h2.fontSize,
              fontWeight: '600' as const,
            }
          ]}>
            Ingredients
          </Text>
        </View>
        
        {ingredients && ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => {
            const isChecked = checkedItems.has(index);
            const emoji = getIngredientEmoji(ingredient);
            
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.ingredientItem,
                  {
                    backgroundColor: isChecked 
                      ? theme.colors.background.tertiary 
                      : theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.md,
                  }
                ]}
                onPress={() => toggleItem(index)}
                activeOpacity={0.7}
              >
                <View style={styles.ingredientContent}>
                  <Text style={styles.emoji}>{emoji}</Text>
                  <Text style={[
                    styles.ingredientText,
                    {
                      color: isChecked 
                        ? theme.colors.text.disabled 
                        : theme.colors.text.primary,
                      fontSize: theme.typography.body.fontSize,
                      textDecorationLine: isChecked ? 'line-through' : 'none',
                    }
                  ]}>
                    {ingredient}
                  </Text>
                </View>
                
                <View style={[
                  styles.checkbox,
                  {
                    backgroundColor: isChecked 
                      ? theme.colors.semantic.success 
                      : theme.colors.background.primary,
                    borderColor: theme.colors.primary.main,
                    borderRadius: theme.borderRadius.sm,
                  }
                ]}>
                  {isChecked && (
                    <Ionicons 
                      name="checkmark" 
                      size={16} 
                      color={theme.colors.background.primary} 
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={[
            styles.emptyText,
            {
              color: theme.colors.text.secondary,
              fontSize: theme.typography.body.fontSize,
            }
          ]}>
            No ingredients available
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
  },
  ingredientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 20,
    marginRight: 12,
  },
  ingredientText: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 