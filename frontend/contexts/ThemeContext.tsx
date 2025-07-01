import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme, ColorSchemeName } from 'react-native';
import { Theme, lightTheme, darkTheme } from '../design/theme';

interface ThemeContextType {
  theme: Theme;
  colorScheme: ColorSchemeName;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    theme,
    colorScheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 