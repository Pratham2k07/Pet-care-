import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Main/HomeScreen';
import PetServicesScreen from '../screens/Main/PetServicesScreen';
import HealthPredictionScreen from '../screens/Main/HealthPredictionScreen';
import HealthHistoryScreen from '../screens/Main/HealthHistoryScreen';
import AIChatScreen from '../screens/Main/AIChatScreen';
import DailyLogScreen from '../screens/Main/DailyLogScreen';

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
      <Stack.Screen 
        name="HealthPrediction" 
        component={HealthPredictionScreen} 
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="HealthHistory" 
        component={HealthHistoryScreen} 
        options={{
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="AIChat" 
        component={AIChatScreen} 
        options={{
          animation: 'slide_from_bottom'
        }}
      />
      <Stack.Screen 
        name="DailyLog" 
        component={DailyLogScreen} 
        options={{
          animation: 'slide_from_bottom'
        }}
      />
    </Stack.Navigator>
  );
}
