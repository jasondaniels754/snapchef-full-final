import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessageBubbleProps } from '../types/chat';
import { colors, spacing } from '../design/designSystem';

export default function MessageBubble({ message }: MessageBubbleProps): React.ReactElement {
  const isUser = message.isUser;

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <View style={styles.aiIcon}>
            <Ionicons name="restaurant" size={16} color={colors.text.inverse} />
          </View>
        )}
        
        {message.isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={isUser ? colors.text.inverse : colors.primary.main} />
            <Text style={[styles.loadingText, isUser ? styles.userText : styles.aiText]}>
              AI is thinking...
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
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
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
  aiIcon: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: colors.primary.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
}); 