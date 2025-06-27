import React from 'react';
import { View, Slider, Text } from 'react-native';

export default function IngredientSlider({ max, value, onChange }) {
  return (
    <View style={{ marginVertical: 8 }}>
      <Text>Ingredients: {value}</Text>
      <Slider minimumValue={1} maximumValue={max} step={1} value={value} onValueChange={onChange} />
    </View>
  );
}
