import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingPetInfoScreen from '../screens/Auth/OnboardingPetInfoScreen';
import OnboardingScheduleScreen from '../screens/Auth/OnboardingScheduleScreen';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingPetInfo" component={OnboardingPetInfoScreen} />
      <Stack.Screen 
        name="OnboardingSchedule" 
        component={OnboardingScheduleScreen} 
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="MainApp" 
        component={TabNavigator} 
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
