import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../types/user';
import { colors, spacing } from '../design/designSystem';

interface UserProfileHeaderProps {
  profile: UserProfile;
  onEditProfile?: () => void;
}

export default function UserProfileHeader({ 
  profile, 
  onEditProfile 
}: UserProfileHeaderProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {profile.profilePicture ? (
            <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={32} color={colors.text.inverse} />
            </View>
          )}
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.memberSince}>
            Member since {new Date(profile.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        {onEditProfile && (
          <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
            <Ionicons name="pencil" size={20} color={colors.primary.main} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.statusSection}>
        <View style={styles.statusItem}>
          <Ionicons name="time" size={16} color={colors.text.secondary} />
          <Text style={styles.statusText}>
            Last active {new Date(profile.lastActive).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  editButton: {
    padding: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.neutral.background,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginLeft: spacing.xs,
  },
}); 