import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import GenerateScreen from '../screens/GenerateScreen';
import SavedScreen from '../screens/SavedScreen';
import PlannerScreen from '../screens/PlannerScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function TabNavigator(): React.ReactElement {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'restaurant-outline';

          if (route.name === 'Generate') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
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