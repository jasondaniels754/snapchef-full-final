import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface AnimatedSaveButtonProps {
  onPress: () => void;
  isSaved: boolean;
  disabled?: boolean;
}

export const AnimatedSaveButton: React.FC<AnimatedSaveButtonProps> = ({
  onPress,
  isSaved,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSaved) {
      // Bounce animation when saved
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Show checkmark
      Animated.timing(checkmarkAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Hide checkmark
      Animated.timing(checkmarkAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isSaved]);

  const handlePress = () => {
    if (!disabled) {
      // Press animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      onPress();
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: isSaved 
              ? theme.colors.semantic.success 
              : theme.colors.primary.main,
            borderRadius: theme.borderRadius.full,
          },
          disabled && styles.disabled
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <Animated.View style={[
          styles.iconContainer,
          {
            opacity: checkmarkAnim,
            transform: [{ scale: checkmarkAnim }],
          }
        ]}>
          <Ionicons 
            name="checkmark" 
            size={20} 
            color={theme.colors.background.primary} 
          />
        </Animated.View>
        
        <Text style={[
          styles.text,
          {
            color: theme.colors.background.primary,
            fontSize: theme.typography.body.fontSize,
          }
        ]}>
          {isSaved ? 'Recipe Saved!' : 'Save Recipe'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    minWidth: 140,
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
}); 