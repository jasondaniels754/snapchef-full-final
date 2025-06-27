import React from 'react';
import {
  Text as RNText,
  StyleSheet,
  TextStyle,
  TextProps as RNTextProps,
  Platform,
} from 'react-native';
import { colors, typography } from '../../design/designSystem';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
type TextColor = 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse';

interface TextProps {
  variant?: TextVariant;
  color?: TextColor;
  style?: any;
  children: React.ReactNode;
}

export function Text({ variant = 'body', color = 'primary', style, children }: TextProps) {
  const textStyle = [
    styles.base,
    styles[variant],
    { color: colors.text[color] },
    style,
  ];

  return <RNText style={textStyle}>{children}</RNText>;
}

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