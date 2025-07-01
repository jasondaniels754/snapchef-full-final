import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: any;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({ 
  children, 
  style 
}) => {
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
      },
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
  },
}); 