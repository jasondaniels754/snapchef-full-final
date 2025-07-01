import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  TextStyle,
  TextProps as RNTextProps,
  Platform,
} from 'react-native';
import { colors, typography } from '../../design/designSystem';
import { useTheme } from '../../contexts/ThemeContext';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  color?: 'primary' | 'secondary' | 'disabled';
  style?: any;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ 
  variant = 'body', 
  color = 'primary', 
  style, 
  children,
  ...props 
}) => {
  const { theme } = useTheme();

  const getTextStyle = () => {
    const baseStyle = {
      color: theme.colors.text[color],
      ...theme.typography[variant],
    };

    return [baseStyle, style];
  };

  return (
    <RNText style={getTextStyle()} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  base: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
  h1: {
    ...typography.textStyles.h1,
  },
  h2: {
    ...typography.textStyles.h2,
  },
  h3: {
    ...typography.textStyles.h3,
  },
  body: {
    ...typography.textStyles.body,
  },
  caption: {
    ...typography.textStyles.caption,
  },
  button: {
    ...typography.textStyles.button,
  },
}); 