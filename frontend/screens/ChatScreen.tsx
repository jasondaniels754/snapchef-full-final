import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import { sendChatMessage } from '../services/api';
import { ChatMessage, ChatState } from '../types/chat';
import { colors, spacing } from '../design/designSystem';

const STORAGE_KEY = 'chatHistory';

export default function ChatScreen(): React.ReactElement {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });
  const flatListRef = useRef<FlatList>(null);

  // Load chat history from storage
  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const messages: ChatMessage[] = JSON.parse(stored).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setState(prev => ({ ...prev, messages }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Save chat history to storage
  const saveChatHistory = async (messages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  // Send message to AI
  const sendMessageToAI = async (message: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.warn('🔄 Sending message to AI:', message);
      console.error('🔄 Sending message to AI:', message); // This should be more visible
      
      const response = await sendChatMessage(message, 'cooking_assistant');
      
      console.warn('✅ AI Response received:', response);
      console.error('✅ AI Response received:', response); // This should be more visible
      
      // Show alert for debugging
      Alert.alert('Debug Info', `Message sent: ${message}\nResponse: ${response.substring(0, 100)}...`);
      
      return response;
    } catch (error) {
      console.warn('❌ Error sending message to AI:', error);
      console.error('❌ Error sending message to AI:', error); // This should be more visible
      
      // Show error alert for debugging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to send message: ${errorMessage}`);
      
      return 'I\'m sorry, I\'m having trouble connecting right now. Please check your internet connection and try again.';
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    const updatedMessages = [...state.messages, userMessage, aiMessage];
    setState(prev => ({ ...prev, messages: updatedMessages }));
    saveChatHistory(updatedMessages);

    // Get AI response
    const aiResponse = await sendMessageToAI(text);
    
    const finalAiMessage: ChatMessage = {
      ...aiMessage,
      text: aiResponse,
      isLoading: false,
    };

    const finalMessages = [...state.messages, userMessage, finalAiMessage];
    setState(prev => ({ ...prev, messages: finalMessages }));
    saveChatHistory(finalMessages);
  };

  // Clear chat history
  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(STORAGE_KEY);
              setState(prev => ({ ...prev, messages: [] }));
            } catch (error) {
              console.error('Error clearing chat history:', error);
              Alert.alert('Error', 'Failed to clear chat history');
            }
          },
        },
      ]
    );
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (state.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [state.messages]);

  // Load chat history on mount
  useEffect(() => {
    console.warn('🚀 ChatScreen mounted - testing console logs');
    console.error('🚀 ChatScreen mounted - testing console logs');
    loadChatHistory();
  }, []);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubble-outline" size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyStateTitle}>Welcome to SnapChef Assistant!</Text>
      <Text style={styles.emptyStateText}>
        Ask me anything about cooking, recipes, meal planning, or kitchen tips. I'm here to help you become a better cook!
      </Text>
      
      {/* Test button for debugging */}
      <TouchableOpacity 
        style={styles.testButton}
        onPress={async () => {
          try {
            const response = await sendChatMessage('test', 'cooking_assistant');
            Alert.alert('✅ API Test Success', `Response: ${response.substring(0, 100)}...`);
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            Alert.alert('❌ API Test Failed', `Error: ${errorMessage}`);
          }
        }}
      >
        <Text style={styles.testButtonText}>Test API Connection</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Cooking Assistant" />
      
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.clearButtonText}>Clear Chat</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={state.messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={state.isLoading}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  clearButtonText: {
    marginLeft: spacing.sm,
    color: colors.text.secondary,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
  testButton: {
    padding: spacing.md,
    backgroundColor: colors.neutral.background,
    borderWidth: 1,
    borderColor: colors.text.secondary,
    borderRadius: spacing.sm,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.secondary,
  },
}); 