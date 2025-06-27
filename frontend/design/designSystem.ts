import { Platform } from 'react-native';

// Color System
export const colors = {
  // Primary Colors
  primary: {
    main: '#007AFF', // iOS Blue
    light: '#47A3FF',
    dark: '#0055B3',
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    background: '#F5F5F7', // Light gray background
    card: '#FFFFFF',
    border: '#E5E5EA',
    divider: '#C7C7CC',
  },
  
  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#3C3C43',
    tertiary: '#8E8E93',
    disabled: '#C7C7CC',
    inverse: '#FFFFFF',
  },
  
  // Semantic Colors
  semantic: {
    success: '#34C759', // Green
    warning: '#FF9500', // Orange
    error: '#FF3B30',   // Red
    info: '#5856D6',    // Purple
  },
  
  // Recipe-specific Colors
  recipe: {
    breakfast: '#FF9500', // Orange
    lunch: '#34C759',     // Green
    dinner: '#5856D6',    // Purple
    snack: '#FF2D55',     // Pink
  },
};

// Typography System
export const typography = {
  // Font Families
  fontFamily: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
    }),
    medium: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Medium',
    }),
    semibold: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Medium',
    }),
    bold: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Bold',
    }),
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Text Styles
  textStyles: {
    h1: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      lineHeight: 38,
      fontWeight: '700' as const,
      letterSpacing: -0.25,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      letterSpacing: 0.15,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0.4,
    },
    button: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600' as const,
      letterSpacing: 0.5,
    },
  },
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border Radius
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Component Styles
export const components = {
  // Button Styles
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
    secondary: {
      backgroundColor: colors.neutral.background,
      borderRadius: borderRadius.md,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
    },
  },
  
  // Input Styles
  input: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  
  // Card Styles
  card: {
    backgroundColor: colors.neutral.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
};

// Animation Durations
export const animation = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
};

// Grid System
export const grid = {
  columns: 12,
  gutter: spacing.md,
  margin: spacing.md,
  maxWidth: 428, // iPhone 12 Pro Max width
};

// Export all design tokens
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  components,
  animation,
  grid,
}; 