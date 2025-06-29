import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserPreferences } from '../types/user';
import { colors, spacing } from '../design/designSystem';

interface SettingsSectionProps {
  preferences: UserPreferences;
  onPreferenceChange: (key: string, value: any) => void;
  onExportData?: () => void;
  onImportData?: () => void;
  onClearData?: () => void;
}

export default function SettingsSection({ 
  preferences, 
  onPreferenceChange,
  onExportData,
  onImportData,
  onClearData
}: SettingsSectionProps): React.ReactElement {
  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    action, 
    type = 'chevron' 
  }: { 
    icon: string; 
    title: string; 
    subtitle?: string; 
    action?: () => void; 
    type?: 'chevron' | 'switch' | 'danger';
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={action}
      activeOpacity={action ? 0.7 : 1}
    >
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={icon as any} 
            size={20} 
            color={type === 'danger' ? colors.semantic.error : colors.primary.main} 
          />
        </View>
        <View style={styles.settingContent}>
          <Text style={[styles.settingTitle, type === 'danger' && styles.dangerText]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      
      {type === 'switch' ? (
        <Switch
          value={preferences.notifications.newRecipes}
          onValueChange={(value) => onPreferenceChange('notifications.newRecipes', value)}
          trackColor={{ false: colors.neutral.border, true: colors.primary.main + '40' }}
          thumbColor={preferences.notifications.newRecipes ? colors.primary.main : colors.neutral.border}
        />
      ) : type === 'chevron' ? (
        <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingItem
          icon="notifications"
          title="New Recipe Suggestions"
          subtitle="Get notified about new recipe ideas"
          type="switch"
        />
        <SettingItem
          icon="time"
          title="Meal Reminders"
          subtitle="Reminders for planned meals"
          type="switch"
        />
        <SettingItem
          icon="bulb"
          title="Cooking Tips"
          subtitle="Daily cooking tips and tricks"
          type="switch"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <SettingItem
          icon="download"
          title="Export Data"
          subtitle="Download your recipes and meal plans"
          action={onExportData}
        />
        <SettingItem
          icon="upload"
          title="Import Data"
          subtitle="Import recipes from other sources"
          action={onImportData}
        />
        <SettingItem
          icon="trash"
          title="Clear All Data"
          subtitle="Remove all saved recipes and meal plans"
          action={onClearData}
          type="danger"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <SettingItem
          icon="color-palette"
          title="Theme"
          subtitle={preferences.theme === 'auto' ? 'Auto' : preferences.theme === 'dark' ? 'Dark' : 'Light'}
        />
        <SettingItem
          icon="language"
          title="Language"
          subtitle={preferences.language}
        />
        <SettingItem
          icon="shield-checkmark"
          title="Privacy"
          subtitle="Manage data sharing and analytics"
        />
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
  section: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  dangerText: {
    color: colors.semantic.error,
  },
}); 