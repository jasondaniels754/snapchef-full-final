import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DifficultyPicker({ options, selected, onSelect }) {
  return (
    <View style={styles.row}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.button, selected === opt && styles.active]}
          onPress={() => onSelect(opt)}
        >
          <Text>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 8 },
  button: { padding: 8, marginRight: 8, backgroundColor: '#eee' },
  active: { backgroundColor: '#4A90E2' },
});
