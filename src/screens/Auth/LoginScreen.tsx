import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Alert, 
  Image, 
  TextInput,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { supabase } from '../../services/supabase';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Login Failed', error.message);
    }
    setLoading(false);
  }

  async function signInWithGoogle() {
    try {
      setLoading(true);

      if (Platform.OS === 'web') {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          }
        });
        if (error) throw error;
        if (data?.url) {
          window.location.href = data.url;
        }
        return;
      }
      
      const redirectUrl = AuthSession.makeRedirectUri();
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success' && result.url) {
          const paramsStr = result.url.split('#')[1] || result.url.split('?')[1];
          if (paramsStr) {
            const params = paramsStr.split('&').reduce((acc, current) => {
              const [key, value] = current.split('=');
              acc[key] = value;
              return acc;
            }, {} as Record<string, string>);
            
            if (params.access_token && params.refresh_token) {
              await supabase.auth.setSession({
                access_token: params.access_token,
                refresh_token: params.refresh_token
              });
            }
          }
        }
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF5F8' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.heading}>Welcome</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.heading}>Back!</Text>
                <Ionicons name="paw" size={28} color="#FF8BA7" style={{ marginLeft: 8, marginTop: 4 }} />
              </View>
              <Text style={styles.subheading}>
                Sign in to continue caring{'\n'}for your furry friend.
              </Text>
            </View>
            <Ionicons name="heart-outline" size={40} color="#FF8BA7" style={styles.topRightHeart} />
          </View>

          {/* Top Section - Illustration */}
          <View style={styles.heroSection}>
            <View style={styles.mainBlob} />
            
            {/* Background decorative elements */}
            <MaterialCommunityIcons name="leaf" size={60} color="#FFD1DC" style={styles.leafLeft} />
            <MaterialCommunityIcons name="leaf" size={40} color="#FFD1DC" style={styles.leafLeftSmall} />
            <Ionicons name="paw" size={30} color="#FFE4EB" style={styles.faintPaw1} />
            <Ionicons name="paw" size={20} color="#FFE4EB" style={styles.faintPaw2} />
            
            <Image 
              source={require('../../../assets/WhatsApp Image 2026-06-13 at 17.37.09n-Photoroom.png')} 
              style={styles.heroImage} 
              resizeMode="contain"
            />
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="mail-outline" size={22} color="#FF8BA7" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed-outline" size={22} color="#FF8BA7" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIconContainer}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={22} 
                  color="#6B7280" 
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={signInWithEmail}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Logging In...' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Social Login */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.socialText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={signInWithGoogle} disabled={loading}>
                <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'}} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-apple" size={24} color="#000000" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom CTA */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 10,
    zIndex: 20,
  },
  heading: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1E293B',
    lineHeight: 44,
  },
  subheading: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 24,
    marginTop: 12,
    fontWeight: '500',
  },
  topRightHeart: {
    marginTop: 10,
  },
  heroSection: {
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  heroImage: {
    width: 320,
    height: 320,
    zIndex: 10,
    marginTop: 0,
  },
  mainBlob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FFE9F0',
    top: 0,
    zIndex: 1,
  },
  leafLeft: {
    position: 'absolute',
    left: -20,
    top: 100,
    transform: [{ rotate: '45deg' }],
    zIndex: 2,
  },
  leafLeftSmall: {
    position: 'absolute',
    left: -10,
    top: 60,
    transform: [{ rotate: '15deg' }],
    zIndex: 2,
  },
  faintPaw1: {
    position: 'absolute',
    right: 20,
    top: 20,
    transform: [{ rotate: '15deg' }],
    zIndex: 2,
  },
  faintPaw2: {
    position: 'absolute',
    right: 50,
    top: -10,
    transform: [{ rotate: '-10deg' }],
    zIndex: 2,
  },
  formSection: {
    width: '100%',
    zIndex: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    height: 60,
    borderWidth: 1.5,
    borderColor: '#FCE7F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  iconContainer: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '500',
    color: '#1E293B',
  },
  eyeIconContainer: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8BA7',
  },
  loginButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B8B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B8B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  socialText: {
    fontSize: 14,
    color: '#94A3B8',
    paddingHorizontal: 12,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  signupText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FF6B8B',
  },
});
