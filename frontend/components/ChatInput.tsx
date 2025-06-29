import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatInputProps } from '../types/chat';
import { colors, spacing } from '../design/designSystem';

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps): React.ReactElement {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me about cooking..."
          placeholderTextColor={colors.text.tertiary}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
          editable={!isLoading}
          onKeyPress={handleKeyPress}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!message.trim() || isLoading) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="send" 
            size={20} 
            color={(!message.trim() || isLoading) ? colors.text.tertiary : colors.text.inverse} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.card,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.neutral.background,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 120,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    maxHeight: 100,
    paddingVertical: 0,
  },
  sendButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.border,
  },
}); 