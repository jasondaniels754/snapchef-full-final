import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../design/designSystem';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  variant?: 'outlined' | 'filled';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  variant = 'outlined',
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="caption"
          color="secondary"
          style={styles.label}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          styles[variant],
          error ? styles.error : null,
          inputStyle,
        ]}
        placeholderTextColor={colors.text.tertiary}
        {...props}
      />
      {error && (
        <Text
          variant="caption"
          style={styles.errorText}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    ...typography.textStyles.body,
    color: colors.text.primary,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
  },
  filled: {
    backgroundColor: colors.neutral.background,
    borderWidth: 0,
  },
  error: {
    borderColor: colors.semantic.error,
  },
  errorText: {
    marginTop: spacing.xs,
    color: colors.semantic.error,
  },
}); 