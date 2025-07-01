import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './contexts/ThemeContext';
import TabNavigator from './navigation/TabNavigator';


export default function App(): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
} 