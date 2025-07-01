import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from '../../contexts/ThemeContext';
import { RecipeBadge } from './RecipeBadge';
import { Recipe } from '../../types/recipe';

interface RecipeHeaderProps {
  recipe: Recipe;
  onClose: () => void;
  fadeAnim: Animated.Value;
  slideAnim: Animated.Value;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  recipe,
  onClose,
  fadeAnim,
  slideAnim,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        ...theme.shadows.lg,
      }
    ]}>
      {/* Header with overlapping badge */}
      <View style={styles.header}>
        <View style={styles.badgeContainer}>
          <RecipeBadge recipe={recipe} />
        </View>
        
        <TouchableOpacity 
          onPress={onClose} 
          style={[
            styles.closeButton,
            {
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.full,
            }
          ]}
        >
          <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Animated title and description */}
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}>
        <Text style={[
          styles.title,
          {
            color: theme.colors.text.primary,
            fontSize: theme.typography.h1.fontSize,
            fontWeight: 'bold' as const,
          }
        ]}>
          {recipe.title || 'Untitled Recipe'}
        </Text>
        
        {recipe.description && (
          <Text style={[
            styles.description,
            {
              color: theme.colors.text.secondary,
              fontSize: theme.typography.body.fontSize,
            }
          ]}>
            {recipe.description}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  badgeContainer: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 40,
  },
  description: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
}); 