import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface RecipeInstructionsProps {
  instructions: string[];
  slideAnim: Animated.Value;
}

export const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({
  instructions,
  slideAnim,
}) => {
  const { theme } = useTheme();

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [{ translateY: slideAnim }],
      }
    ]}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="create" size={20} color={theme.colors.primary.main} />
          <Text style={[
            styles.sectionTitle,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.h2.fontSize,
              fontWeight: '600' as const,
            }
          ]}>
            Instructions
          </Text>
        </View>
        
        {instructions && instructions.length > 0 ? (
          instructions.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={[
                styles.stepNumber,
                {
                  backgroundColor: theme.colors.primary.main,
                  borderRadius: theme.borderRadius.full,
                }
              ]}>
                <Text style={[
                  styles.stepText,
                  {
                    color: theme.colors.background.primary,
                    fontSize: theme.typography.caption.fontSize,
                    fontWeight: 'bold' as const,
                  }
                ]}>
                  {index + 1}
                </Text>
              </View>
              
              <Text style={[
                styles.instructionText,
                {
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.body.fontSize,
                  lineHeight: 24,
                }
              ]}>
                {instruction}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[
            styles.emptyText,
            {
              color: theme.colors.text.secondary,
              fontSize: theme.typography.body.fontSize,
            }
          ]}>
            No instructions available
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
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepText: {
    textAlign: 'center',
  },
  instructionText: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 