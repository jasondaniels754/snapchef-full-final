import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  textStyle?: any;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.full,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minHeight: 44,
      },
      large: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minHeight: 52,
      },
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary.main,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.colors.secondary.main,
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.primary.main,
      },
    };

    return [
      baseStyle,
      sizeStyles[size],
      variantStyles[variant],
      disabled && { opacity: 0.6 },
      style,
    ];
  };

  const getTextStyle = () => {
    const baseTextStyle = {
      fontWeight: '600' as const,
    };

    const variantTextStyles = {
      primary: {
        color: theme.colors.background.primary,
      },
      secondary: {
        color: theme.colors.background.primary,
      },
      outline: {
        color: theme.colors.primary.main,
      },
    };

    const sizeTextStyles = {
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
    };

    return [
      baseTextStyle,
      variantTextStyles[variant],
      sizeTextStyles[size],
      textStyle,
    ];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? theme.colors.primary.main : theme.colors.background.primary}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}; 