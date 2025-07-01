import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubbleProps } from '../types/chat';
import { colors, spacing } from '../design/designSystem';

export default function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
  const isUser = message.isUser;

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Image 
            source={require('../assets/images/simmer-avatar.png')} 
            style={styles.avatar}
          />
        </View>
      )}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {message.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={isUser ? colors.text.inverse : colors.primary.main} />
            <Text style={[styles.loadingText, isUser ? styles.userText : styles.aiText]}>
              Simmer is thinking...
            </Text>
          </View>
        ) : (
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {message.text}
          </Text>
        )}
      </View>
      
      <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.aiTimestamp]}>
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingLeft: spacing.xl,
  },
  userContainer: {
    alignItems: 'flex-end',
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  aiContainer: {
    alignItems: 'flex-start',
    paddingLeft: spacing.xl,
    paddingRight: spacing.md,
  },
  bubble: {
    maxWidth: '80%',
    padding: spacing.md,
    borderRadius: 20,
    position: 'relative',
  },
  userBubble: {
    backgroundColor: colors.primary.main,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.neutral.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  avatarContainer: {
    position: 'absolute',
    top: -10,
    left: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.neutral.card,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: colors.text.inverse,
  },
  aiText: {
    color: colors.text.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    marginTop: spacing.xs,
    opacity: 0.7,
  },
  userTimestamp: {
    color: colors.text.secondary,
    textAlign: 'right',
  },
  aiTimestamp: {
    color: colors.text.secondary,
    textAlign: 'left',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.neutral.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 