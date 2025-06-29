import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../design/designSystem';

interface DataSectionProps {
  title: string;
  icon: string;
  data: Array<{
    id: string;
    title: string;
    subtitle?: string;
    timestamp?: string;
  }>;
  onPress?: () => void;
  onItemPress?: (item: any) => void;
  emptyMessage?: string;
}

export default function DataSection({ 
  title, 
  icon, 
  data, 
  onPress, 
  onItemPress,
  emptyMessage = "No items yet"
}: DataSectionProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={20} color={colors.primary.main} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        )}
      </TouchableOpacity>
      
      <View style={styles.content}>
        {data.length > 0 ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {data.slice(0, 5).map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemCard}
                onPress={() => onItemPress?.(item)}
                activeOpacity={0.7}
              >
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.subtitle && (
                  <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {item.subtitle}
                  </Text>
                )}
                {item.timestamp && (
                  <Text style={styles.itemTimestamp}>
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
            {data.length > 5 && (
              <TouchableOpacity style={styles.moreCard} onPress={onPress}>
                <Ionicons name="ellipsis-horizontal" size={24} color={colors.text.secondary} />
                <Text style={styles.moreText}>View All</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={32} color={colors.text.tertiary} />
            <Text style={styles.emptyText}>{emptyMessage}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
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
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.main + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  content: {
    padding: spacing.lg,
  },
  scrollContent: {
    paddingRight: spacing.md,
  },
  itemCard: {
    width: 140,
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    padding: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  itemSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  itemTimestamp: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  moreCard: {
    width: 80,
    backgroundColor: colors.neutral.background,
    borderRadius: 8,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  moreText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
}); 