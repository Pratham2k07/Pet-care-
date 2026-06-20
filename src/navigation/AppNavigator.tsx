import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import OnboardingPetInfoScreen from '../screens/Auth/OnboardingPetInfoScreen';
import OnboardingScheduleScreen from '../screens/Auth/OnboardingScheduleScreen';
import TabNavigator from './TabNavigator';
import { useAuth } from '../store/useAuth';
import { usePetStore } from '../store/usePetStore';
import { supabase } from '../services/supabase';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { session, setSession, checkSession, loading } = useAuth();
  const { hasCompletedOnboarding, pets, ownerName } = usePetStore();

  useEffect(() => {
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // You could put a splash screen here

  const hasPetProfile = pets.length > 0;
  const hasSchedule = hasPetProfile && (pets[0].wakeTime || pets[0].breakfast || (pets[0].walkTimes && pets[0].walkTimes.length > 0));
  const isFullyOnboarded = hasCompletedOnboarding && hasPetProfile && ownerName && hasSchedule;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          // Not logged in
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (!ownerName || !hasPetProfile) ? (
          // Missing Profile Info
          <Stack.Screen name="OnboardingPetInfo" component={OnboardingPetInfoScreen} />
        ) : (!hasSchedule || !hasCompletedOnboarding) ? (
          // Missing Schedule
          <Stack.Screen name="OnboardingSchedule" component={OnboardingScheduleScreen} initialParams={{ petId: pets[0].id }} />
        ) : (
          // Fully Onboarded
          <Stack.Screen name="MainApp" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
