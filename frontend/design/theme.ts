export interface ColorPalette {
  main: string;
  light: string;
  dark: string;
}

export interface SemanticColors {
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  disabled: string;
}

export interface GradientPalette {
  warm: string[];
  cool: string[];
  brand: string[];
}

export interface EmojiPalette {
  difficulty: Record<string, string>;
  cuisine: Record<string, string>;
  badges: Record<string, string>;
}

export interface SpacingSystem {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadiusSystem {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface ShadowSystem {
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface TypographySystem {
  h1: {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  };
  h2: {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  };
  h3: {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  };
  body: {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  };
  caption: {
    fontSize: number;
    fontWeight: string;
    lineHeight: number;
  };
}

export interface AnimationSystem {
  duration: {
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

export interface Theme {
  colors: {
    primary: ColorPalette;
    secondary: ColorPalette;
    neutral: ColorPalette;
    semantic: SemanticColors;
    background: BackgroundColors;
    text: TextColors;
    gradients: GradientPalette;
    emojis: EmojiPalette;
  };
  spacing: SpacingSystem;
  borderRadius: BorderRadiusSystem;
  shadows: ShadowSystem;
  typography: TypographySystem;
  animations: AnimationSystem;
}

// Light Theme - SnapChef Brand Colors
export const lightTheme: Theme = {
  colors: {
    primary: {
      main: '#2D7EF9', // SnapChef Blue
      light: '#60A5FA',
      dark: '#1D4ED8'
    },
    secondary: {
      main: '#F97316', // Soft Orange
      light: '#FB923C',
      dark: '#EA580C'
    },
    neutral: {
      main: '#6B7280',
      light: '#9CA3AF',
      dark: '#374151'
    },
    semantic: {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6'
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      disabled: '#9CA3AF'
    },
    gradients: {
      warm: ['#FEF3C7', '#FDE68A'], // Soft yellow to orange
      cool: ['#DBEAFE', '#BFDBFE'], // Light blue gradient
      brand: ['#2D7EF9', '#F97316'] // SnapChef blue to orange
    },
    emojis: {
      difficulty: {
        Easy: '🟢',
        Medium: '🟡',
        Hard: '🔴'
      },
      cuisine: {
        Any: '🌍',
        Italian: '🇮🇹',
        Mexican: '🇲🇽',
        Thai: '🇹🇭',
        Chinese: '🇨🇳',
        Indian: '🇮🇳',
        Japanese: '🇯🇵',
        Mediterranean: '🌊'
      },
      badges: {
        'Chef\'s Pick': '🔥',
        'Healthy': '🥗',
        'Quick': '⚡',
        'Easy Peasy': '🟢',
        'Plant-Based': '🥗',
        'Quick Fix': '⚡'
      }
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8
    }
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32
    },
    h3: {
      fontSize: 20,
      fontWeight: '500',
      lineHeight: 28
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20
    }
  },
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  }
};

// Dark Theme - SnapChef Brand Colors
export const darkTheme: Theme = {
  colors: {
    primary: {
      main: '#2D7EF9', // SnapChef Blue (same as light)
      light: '#60A5FA',
      dark: '#1D4ED8'
    },
    secondary: {
      main: '#FDBA74', // Lighter orange for dark mode
      light: '#FED7AA',
      dark: '#F97316'
    },
    neutral: {
      main: '#D1D5DB',
      light: '#9CA3AF',
      dark: '#6B7280'
    },
    semantic: {
      success: '#6EE7B7',
      error: '#F87171',
      warning: '#FCD34D',
      info: '#93C5FD'
    },
    background: {
      primary: '#121212',
      secondary: '#1E1E1E',
      tertiary: '#2D2D2D'
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      disabled: '#9CA3AF'
    },
    gradients: {
      warm: ['#451A03', '#7C2D12'], // Dark orange tones
      cool: ['#1E3A8A', '#1E40AF'], // Dark blue tones
      brand: ['#2D7EF9', '#FDBA74'] // SnapChef blue to light orange
    },
    emojis: {
      // Same emojis for consistency
      difficulty: {
        Easy: '🟢',
        Medium: '🟡',
        Hard: '🔴'
      },
      cuisine: {
        Any: '🌍',
        Italian: '🇮🇹',
        Mexican: '🇲🇽',
        Thai: '🇹🇭',
        Chinese: '🇨🇳',
        Indian: '🇮🇳',
        Japanese: '🇯🇵',
        Mediterranean: '🌊'
      },
      badges: {
        'Chef\'s Pick': '🔥',
        'Healthy': '🥗',
        'Quick': '⚡',
        'Easy Peasy': '🟢',
        'Plant-Based': '🥗',
        'Quick Fix': '⚡'
      }
    }
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 4
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8
    }
  },
  typography: lightTheme.typography,
  animations: lightTheme.animations
};

// Legacy export for backward compatibility
export const colors = lightTheme.colors;
export const spacing = lightTheme.spacing;
export const borderRadius = lightTheme.borderRadius;
export const shadows = lightTheme.shadows; 