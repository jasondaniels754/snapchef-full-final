import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserStats } from '../types/user';
import { colors, spacing } from '../design/designSystem';

interface StatsCardProps {
  stats: UserStats;
  onPress?: () => void;
}

export default function StatsCard({ stats, onPress }: StatsCardProps): React.ReactElement {
  const StatItem = ({ 
    icon, 
    value, 
    label, 
    color = colors.primary.main 
  }: { 
    icon: string; 
    value: string | number; 
    label: string; 
    color?: string; 
  }) => (
    <View style={styles.statItem}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={20} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Cooking Stats</Text>
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        )}
      </View>
      
      <View style={styles.statsGrid}>
        <StatItem 
          icon="bookmark" 
          value={stats.totalSavedRecipes} 
          label="Saved Recipes" 
        />
        <StatItem 
          icon="calendar" 
          value={stats.totalMealPlans} 
          label="Meal Plans" 
        />
        <StatItem 
          icon="time" 
          value={`${stats.totalCookingTime}h`} 
          label="Cooking Time" 
        />
        <StatItem 
          icon="restaurant" 
          value={stats.cookingStreak} 
          label="Day Streak" 
          color={colors.semantic.success}
        />
      </View>
      
      {stats.favoriteCuisine && (
        <View style={styles.favoriteSection}>
          <Text style={styles.favoriteLabel}>Favorite Cuisine</Text>
          <Text style={styles.favoriteValue}>{stats.favoriteCuisine}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  favoriteSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  favoriteLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  favoriteValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
}); 