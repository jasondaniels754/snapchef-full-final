import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { IngredientSliderProps } from '../types/recipe';

export default function IngredientSlider({ max, value, onChange }: IngredientSliderProps): React.ReactElement {
  return (
    <View style={styles.container}>
      <View style={styles.valueContainer}>
        <Text style={styles.valueText}>{value} ingredients</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#FF6B6B"
        maximumTrackTintColor="#E0E0E0"
        thumbTintColor="#FF6B6B"
      />
      <View style={styles.labelsContainer}>
        <Text style={styles.label}>1</Text>
        <Text style={styles.label}>{max}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
}); 