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
  Image,
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
      
      const response = await sendChatMessage(message, 'cooking_assistant');
      
      return response;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      return 'I\'m sorry, I\'m having trouble connecting right now. Please check your internet connection and try again.';
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || state.isLoading) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
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

      // Add user message and loading AI message
      const messagesWithUser = [...state.messages, userMessage];
      const messagesWithLoading = [...messagesWithUser, aiMessage];
      setState(prev => ({ ...prev, messages: messagesWithLoading }));
      saveChatHistory(messagesWithLoading);

      // Get AI response
      const aiResponse = await sendMessageToAI(text);
      
      const finalAiMessage: ChatMessage = {
        ...aiMessage,
        text: aiResponse,
        isLoading: false,
      };

      // Update with final AI message
      const finalMessages = [...messagesWithUser, finalAiMessage];
      setState(prev => ({ 
        ...prev, 
        messages: finalMessages,
        isLoading: false 
      }));
      saveChatHistory(finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      setState(prev => ({ ...prev, isLoading: false }));
    }
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

  // Scroll to bottom when new messages arrive - single reliable trigger
  useEffect(() => {
    if (state.messages.length > 0) {
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [state.messages]);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <MessageBubble message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image 
        source={require('../assets/images/simmer-avatar.png')} 
        style={styles.emptyStateImage}
      />
      <Text style={styles.emptyStateTitle}>Hey, I'm Simmer! 🍳</Text>
      <Text style={styles.emptyStateText}>
        Hi there! I'm Simmer, your friendly cooking assistant. I'm here to help you cook confidently, plan meals creatively, and discover delicious recipes. Ask me anything about cooking — I'll keep it practical and encouraging! ✨
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Simmer 🍳" />
      
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
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
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
    paddingLeft: spacing.lg,
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
  emptyStateImage: {
    width: 128,
    height: 128,
    marginBottom: spacing.sm,
  },
  emptyStateIconContainer: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 