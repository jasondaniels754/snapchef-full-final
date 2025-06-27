import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../design/designSystem';

interface RadioProps {
  selected: boolean;
  onChange: (selected: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Radio: React.FC<RadioProps> = ({
  selected,
  onChange,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selected,
        disabled && styles.disabled,
        style,
      ]}
      onPress={() => !disabled && onChange(!selected)}
      disabled={disabled}
    >
      {selected && <View style={styles.inner} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: colors.primary.main,
  },
  inner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
  disabled: {
    opacity: 0.5,
  },
}); 