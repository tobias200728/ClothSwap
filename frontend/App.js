import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ClothSwap</Text>
      <Text style={styles.subtitle}>React Native Expo starter app</Text>
      <Pressable style={styles.button} onPress={() => null}>
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#4a4a4a',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
