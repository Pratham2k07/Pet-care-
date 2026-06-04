import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../services/supabase';
import { COLORS, SIZES } from '../../constants/theme';
import Button from '../../components/Button';
import Input from '../../components/Input';
import GlassCard from '../../components/GlassCard';

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) Alert.alert('Error', error.message);
    else if (data.session) {
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Check your inbox', 'We sent you a confirmation link.');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join PawBuddy to start organizing</Text>
      </View>

      <GlassCard style={styles.card}>
        <Input
          label="Full Name"
          placeholder="Jane Doe"
          value={fullName}
          onChangeText={setFullName}
        />
        <Input
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        <Button
          title="Sign up"
          onPress={signUpWithEmail}
          loading={loading}
          style={styles.button}
        />
      </GlassCard>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: SIZES.lg,
  },
  header: {
    marginBottom: SIZES.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  card: {
    marginBottom: SIZES.lg,
  },
  button: {
    marginTop: SIZES.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: COLORS.textMain,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
});
