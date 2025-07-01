import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../../design/designSystem';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'elevated',
}) => {
  const Container: React.ComponentType<any> = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.card,
        styles[variant],
        style,
      ]}
      activeOpacity={0.8}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  elevated: {
    ...shadows.md,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  flat: {
    backgroundColor: colors.neutral.background,
  },
}); 