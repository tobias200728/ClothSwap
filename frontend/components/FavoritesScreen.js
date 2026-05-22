import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  light: {
    bg: '#fff7f2',
    card: '#ffffff',
    text: '#1a1a1a',
    sub: '#777777',
    accent: '#ff7a59',
    border: '#f2d9cf',
  },

  dark: {
    bg: '#121212',
    card: '#1e1e1f',
    text: '#ffffff',
    sub: '#aaaaaa',
    accent: '#ff8c69',
    border: '#2f2f32',
  },
};

export default function FavoritesScreen({
  favorites,
  onRemoveFavorite,
  onSendMessage,
  darkMode,
}) {
  const colors = darkMode
    ? COLORS.dark
    : COLORS.light;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.bg,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            borderBottomColor:
              colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text },
          ]}
        >
          Deine Likes
        </Text>

        <Text
          style={[
            styles.headerSubtitle,
            { color: colors.sub },
          ]}
        >
          {favorites.length} gespeichert
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scroll
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        {favorites.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor:
                  colors.card,

                borderColor:
                  colors.border,
              },
            ]}
          >
            <Image
              source={{
                uri: item.image,
              }}
              style={styles.image}
            />

            <Pressable
              style={[
                styles.heartBtn,
                {
                  backgroundColor:
                    colors.card,
                },
              ]}
              onPress={() =>
                onRemoveFavorite(
                  item.id
                )
              }
            >
              <Ionicons
                name="heart"
                size={22}
                color={colors.accent}
              />
            </Pressable>

            <View style={styles.info}>
              <Text
                style={[
                  styles.title,
                  {
                    color:
                      colors.text,
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color:
                      colors.sub,
                  },
                ]}
              >
                Größe {item.size} •{' '}
                {item.brand}
              </Text>

              <Pressable
                style={[
                  styles.msgBtn,
                  {
                    backgroundColor:
                      colors.accent,
                  },
                ]}
                onPress={() =>
                  onSendMessage(item)
                }
              >
                <Ionicons
                  name="chatbubble"
                  size={18}
                  color="#fff"
                />

                <Text
                  style={
                    styles.msgText
                  }
                >
                  Nachricht
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 18,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  scroll: {
    padding: 18,
    paddingBottom: 120,
  },

  card: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },

  image: {
    width: '100%',
    height: 300,
  },

  heartBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },

  msgBtn: {
    height: 52,
    borderRadius: 18,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  msgText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
});