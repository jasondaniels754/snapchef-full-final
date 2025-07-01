import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface SeasoningsSectionProps {
  seasonings: string[];
  slideAnim: Animated.Value;
}

export const SeasoningsSection: React.FC<SeasoningsSectionProps> = ({
  seasonings,
  slideAnim,
}) => {
  const { theme } = useTheme();

  const getSeasoningEmoji = (seasoning: string) => {
    const lowerSeasoning = seasoning.toLowerCase();
    if (lowerSeasoning.includes('salt')) return '🧂';
    if (lowerSeasoning.includes('pepper')) return '🌶️';
    if (lowerSeasoning.includes('garlic')) return '🧄';
    if (lowerSeasoning.includes('onion')) return '🧅';
    if (lowerSeasoning.includes('basil')) return '🌿';
    if (lowerSeasoning.includes('oregano')) return '🌿';
    if (lowerSeasoning.includes('rosemary')) return '🌿';
    if (lowerSeasoning.includes('thyme')) return '🌿';
    if (lowerSeasoning.includes('ginger')) return '🫚';
    if (lowerSeasoning.includes('turmeric')) return '🟡';
    if (lowerSeasoning.includes('cumin')) return '🟤';
    if (lowerSeasoning.includes('paprika')) return '🔴';
    if (lowerSeasoning.includes('curry')) return '🟡';
    if (lowerSeasoning.includes('cinnamon')) return '🟤';
    if (lowerSeasoning.includes('nutmeg')) return '🟤';
    if (lowerSeasoning.includes('bay')) return '🌿';
    if (lowerSeasoning.includes('lemongrass')) return '🌿';
    if (lowerSeasoning.includes('fish sauce')) return '🐟';
    if (lowerSeasoning.includes('lime')) return '🍋';
    if (lowerSeasoning.includes('coconut')) return '🥥';
    if (lowerSeasoning.includes('soy sauce')) return '🍶';
    if (lowerSeasoning.includes('sesame')) return '🫒';
    if (lowerSeasoning.includes('olive oil')) return '🫒';
    if (lowerSeasoning.includes('lemon')) return '🍋';
    if (lowerSeasoning.includes('cilantro')) return '🌿';
    if (lowerSeasoning.includes('chili')) return '🌶️';
    if (lowerSeasoning.includes('cayenne')) return '🌶️';
    if (lowerSeasoning.includes('cardamom')) return '🟢';
    if (lowerSeasoning.includes('star anise')) return '⭐';
    if (lowerSeasoning.includes('parmesan')) return '🧀';
    if (lowerSeasoning.includes('sage')) return '🌿';
    if (lowerSeasoning.includes('marjoram')) return '🌿';
    if (lowerSeasoning.includes('galangal')) return '🫚';
    if (lowerSeasoning.includes('hoisin')) return '🍯';
    if (lowerSeasoning.includes('oyster')) return '🦪';
    if (lowerSeasoning.includes('fenugreek')) return '🌿';
    if (lowerSeasoning.includes('asafoetida')) return '🌿';
    if (lowerSeasoning.includes('parsley')) return '🌿';
    return '🌿'; // Default emoji
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
          <Ionicons name="leaf" size={20} color={theme.colors.primary.main} />
          <Text style={[
            styles.sectionTitle,
            {
              color: theme.colors.text.primary,
              fontSize: theme.typography.h2.fontSize,
              fontWeight: '600' as const,
            }
          ]}>
            Seasonings
          </Text>
        </View>
        
        {seasonings && seasonings.length > 0 ? (
          seasonings.map((seasoning, index) => {
            const emoji = getSeasoningEmoji(seasoning);
            
            return (
              <View key={index} style={styles.seasoningItem}>
                <Text style={styles.emoji}>{emoji}</Text>
                <Text style={[
                  styles.seasoningText,
                  {
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.body.fontSize,
                  }
                ]}>
                  {seasoning}
                </Text>
              </View>
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
            No seasonings specified
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
  seasoningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  emoji: {
    fontSize: 20,
    marginRight: 12,
  },
  seasoningText: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 8,
  },
}); 