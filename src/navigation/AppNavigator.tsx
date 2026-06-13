import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import { useAuth } from '../store/useAuth';
import { supabase } from '../services/supabase';

export default function AppNavigator() {
  const { session, loading, setSession, checkSession } = useAuth();

  useEffect(() => {
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return null; // Could show a custom splash screen here
  }

  return (
    <NavigationContainer>
      {/* Temporarily forcing OnboardingNavigator to show the Flow for preview */}
      <OnboardingNavigator />
    </NavigationContainer>
  );
}
