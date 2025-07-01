import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChatInputProps } from '../types/chat';
import { colors, spacing } from '../design/designSystem';

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps): React.ReactElement {
  const [message, setMessage] = useState('');
  const [inputKey, setInputKey] = useState(0); // Force re-render key
  const inputRef = useRef<TextInput>(null);

  const clearInput = () => {
    setMessage('');
    setInputKey(prev => prev + 1);
    if (inputRef.current) {
      inputRef.current.clear();
    }
  };

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const messageToSend = message.trim();
      
      // Clear the input immediately for better UX
      clearInput();
      
      try {
        await onSendMessage(messageToSend);
        
        // Ensure input is cleared after successful send
        clearInput();
        
      } catch (error) {
        console.error('Error in ChatInput handleSend:', error);
        // Only restore message if there was an actual error
        // Don't restore for validation errors or empty messages
        if (messageToSend && error) {
          setMessage(messageToSend);
        }
      }
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
          key={inputKey}
          ref={inputRef}
          style={styles.input}
          placeholder="Ask me about cooking..."
          placeholderTextColor={colors.text.tertiary}
          defaultValue=""
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