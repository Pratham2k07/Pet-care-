import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Main/HomeScreen';
import PetServicesScreen from '../screens/Main/PetServicesScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen 
        name="PetServices" 
        component={PetServicesScreen} 
        options={{
          animation: 'slide_from_right'
        }}
      />
    </Stack.Navigator>
  );
}
