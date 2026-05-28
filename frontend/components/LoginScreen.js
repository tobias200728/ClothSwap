import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { login, register } from '../services/api';

const { width } = Dimensions.get('window');

const COLORS = {
  background: '#fff7f2',
  card: '#ffffff',
  accent: '#ff7a59',
  softAccent: '#fff1ea',
  text: '#1a1a1a',
  subtext: '#777777',
  border: '#f3d7cb',
  input: '#fffaf7',
  error: '#e53935',
};

export default function LoginScreen({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) return;
    if (isRegister && !username) return;

    setError('');
    setIsLoading(true);
    try {
      const result = isRegister
        ? await register(email, password, username)
        : await login(email, password);
      onLogin?.(result.token, result.user);
    } catch (e) {
      setError(e.message || 'Fehler beim Anmelden');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="flame" size={42} color="#fff" />
            </View>
            <Text style={styles.logoText}>ClothSwap</Text>
            <Text style={styles.subtitle}>Swipe deine Kleidung</Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.title}>{isRegister ? 'Registrieren' : 'Anmelden'}</Text>

            {isRegister && (
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.accent} />
                <TextInput
                  placeholder="Benutzername"
                  placeholderTextColor={COLORS.subtext}
                  value={username}
                  onChangeText={setUsername}
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={COLORS.accent} />
              <TextInput
                placeholder="E-Mail"
                placeholderTextColor={COLORS.subtext}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.accent} />
              <TextInput
                placeholder="Passwort"
                placeholderTextColor={COLORS.subtext}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
              />
            </View>

            {error !== '' && <Text style={styles.errorText}>{error}</Text>}

            <Pressable
              style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>
                  {isRegister ? 'Registrieren' : 'Anmelden'}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => { setIsRegister(!isRegister); setError(''); }}>
              <Text style={styles.switchText}>
                {isRegister
                  ? 'Bereits ein Konto? Anmelden'
                  : 'Noch kein Konto? Registrieren'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>Tinder Style Fashion Marketplace</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: { alignItems: 'center', marginBottom: 38 },
  logoCircle: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff7a59',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 8,
  },
  logoText: { marginTop: 18, fontSize: 34, fontWeight: '800', color: COLORS.text },
  subtitle: { marginTop: 6, color: COLORS.subtext, fontSize: 15 },
  card: {
    width: width - 42,
    backgroundColor: COLORS.card,
    borderRadius: 32,
    padding: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text, marginBottom: 26 },
  inputWrapper: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  input: { flex: 1, marginLeft: 12, color: COLORS.text, fontSize: 16 },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  switchText: {
    marginTop: 24,
    textAlign: 'center',
    color: COLORS.accent,
    fontWeight: '700',
  },
  footer: { marginTop: 34, color: COLORS.subtext, fontSize: 13 },
});
