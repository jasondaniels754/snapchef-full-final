import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ModalBackdropProps } from '../types/modal';
import { colors } from '../design/designSystem';

export default function ModalBackdrop({ visible, onPress }: ModalBackdropProps): React.ReactElement | null {
  if (!visible) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={onPress}
    >
      <View style={styles.overlay} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
}); 