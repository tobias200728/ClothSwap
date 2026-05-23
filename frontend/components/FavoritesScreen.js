import React from 'react';
import { Text, View, ScrollView, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, styles } from './styles/FavoritesScreen.styles';

export default function FavoritesScreen({
  favorites,
  onRemoveFavorite,
  onSendMessage,
  darkMode,
}) {
  const colors = darkMode ? COLORS.dark : COLORS.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Deine Likes</Text>
        <Text style={[styles.headerSubtitle, { color: colors.sub }]}>
          {favorites.length} gespeichert
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {favorites.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Image source={{ uri: item.image }} style={styles.image} />

            <Pressable
              style={[styles.heartBtn, { backgroundColor: colors.card }]}
              onPress={() => onRemoveFavorite(item.id)}
            >
              <Ionicons name="heart" size={22} color={colors.accent} />
            </Pressable>

            <View style={styles.info}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.subtitle, { color: colors.sub }]}>
                Größe {item.size} • {item.brand}
              </Text>

              <Pressable
                style={[styles.msgBtn, { backgroundColor: colors.accent }]}
                onPress={() => onSendMessage(item)}
              >
                <Ionicons name="chatbubble" size={18} color="#fff" />
                <Text style={styles.msgText}>Nachricht</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}