import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({ 
  title, 
  subtitle, 
  children 
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={theme.colors.gradients.brand as [string, string]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <Text style={[
            styles.title,
            {
              color: theme.colors.background.primary,
              fontSize: theme.typography.h1.fontSize,
              fontWeight: 'bold' as const,
            }
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.subtitle,
              {
                color: theme.colors.background.primary,
                fontSize: theme.typography.body.fontSize,
                opacity: 0.9,
              }
            ]}>
              {subtitle}
            </Text>
          )}
          {children}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 