import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../design/designSystem';
import { Text } from './Text';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  value?: string;
  options: Option[];
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
  variant?: 'outlined' | 'filled';
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  error,
  placeholder = 'Select an option',
  containerStyle,
  variant = 'outlined',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const selectTextStyle: TextStyle = {
    ...styles.selectText,
    ...(!selectedOption ? styles.placeholder : {}),
  };

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
      <TouchableOpacity
        style={[
          styles.select,
          styles[variant],
          error ? styles.error : null,
        ]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={selectTextStyle}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>
      {error && (
        <Text
          variant="caption"
          style={styles.errorText}
        >
          {error}
        </Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text variant="h3">Select an option</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => {
                const optionTextStyle: TextStyle = {
                  ...styles.optionText,
                  ...(item.value === value ? styles.selectedOptionText : {}),
                };

                return (
                  <TouchableOpacity
                    style={[
                      styles.option,
                      item.value === value && styles.selectedOption,
                    ]}
                    onPress={() => {
                      onChange(item.value);
                      setIsOpen(false);
                    }}
                  >
                    <Text style={optionTextStyle}>
                      {item.label}
                    </Text>
                    {item.value === value && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={colors.primary.main}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
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
  select: {
    height: 48,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  selectText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
  },
  placeholder: {
    color: colors.text.tertiary,
  },
  errorText: {
    marginTop: spacing.xs,
    color: colors.semantic.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  closeButton: {
    padding: spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  selectedOption: {
    backgroundColor: colors.primary.light,
  },
  optionText: {
    ...typography.textStyles.body,
    color: colors.text.primary,
  },
  selectedOptionText: {
    color: colors.primary.main,
    fontWeight: typography.fontWeight.medium,
  },
}); 