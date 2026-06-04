import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../store/useAuth';
import Button from '../../components/Button';
import { COLORS, SIZES } from '../../constants/theme';
import GlassCard from '../../components/GlassCard';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Dashboard</Text>
      
      <GlassCard style={styles.card}>
        <Text style={styles.subtitle}>Welcome back!</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </GlassCard>

      <Button title="Sign Out" onPress={signOut} variant="outline" style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.xl,
    textAlign: 'center',
  },
  card: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textMain,
    fontWeight: '600',
    marginBottom: SIZES.sm,
  },
  email: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  button: {
    marginTop: SIZES.xl,
  }
});
