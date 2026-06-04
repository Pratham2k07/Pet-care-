import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Main/HomeScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: COLORS.white,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* Additional tabs will go here */}
    </Tab.Navigator>
  );
}
