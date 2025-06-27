import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, spacing } from '../../design/designSystem';
import { Text } from './Text';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text
            variant="caption"
            color="secondary"
            style={styles.label}
          >
            {label}
          </Text>
          {required && (
            <Text
              variant="caption"
              style={styles.required}
            >
              *
            </Text>
          )}
        </View>
      )}
      {children}
      {error && (
        <Text
          variant="caption"
          style={styles.error}
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    marginRight: spacing.xs,
  },
  required: {
    color: colors.semantic.error,
  },
  error: {
    marginTop: spacing.xs,
    color: colors.semantic.error,
  },
}); 