import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../design/designSystem';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps): React.ReactElement {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 90,
    paddingTop: 40,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text.inverse,
    fontSize: 20,
    fontWeight: 'bold',
  },
}); 