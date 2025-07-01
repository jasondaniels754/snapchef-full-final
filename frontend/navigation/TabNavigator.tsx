import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

import GenerateScreen from '../screens/GenerateScreen';
import SnapToRecipeScreen from '../screens/SnapToRecipeScreen';
import SavedScreen from '../screens/SavedScreen';
import PlannerScreen from '../screens/PlannerScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator(): React.ReactElement {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'restaurant-outline';

          if (route.name === 'Generate') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'SnapToRecipe') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Planner') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.text.disabled,
        tabBarStyle: {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.neutral.light,
        },
        tabBarLabelStyle: {
          color: theme.colors.text.primary,
        },
      })}
    >
      <Tab.Screen 
        name="Generate" 
        component={GenerateScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="SnapToRecipe" 
        component={SnapToRecipeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Planner" 
        component={PlannerScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Chat" 
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
} 