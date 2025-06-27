import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import GenerateScreen from '../screens/GenerateScreen';
import SavedScreen from '../screens/SavedScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Generate') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Generate" 
        component={GenerateScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
