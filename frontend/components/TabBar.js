import React from 'react';

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { BlurView } from 'expo-blur';

export default function TabBar({
  activeTab,
  setActiveTab,
  darkMode,
}) {
  const tabs = [
    {
      id: 'swipe',
      label: 'Swipe',
      iconOutline:
        'flame-outline',
      iconFilled: 'flame',
    },

    {
      id: 'favorites',
      label: 'Likes',
      iconOutline:
        'heart-outline',
      iconFilled: 'heart',
    },

    {
      id: 'chat',
      label: 'Chats',
      iconOutline:
        'chatbubble-outline',
      iconFilled:
        'chatbubble',
    },

    {
      id: 'profile',
      label: 'Profil',
      iconOutline:
        'person-outline',
      iconFilled: 'person',
    },
  ];

  const colors = darkMode
    ? {
        bg: '#121212',
        text: '#fff',
        inactive: '#8d8d93',
        accent: '#ff8c69',
        blur: 'dark',
      }
    : {
        bg: '#fff7f2',
        text: '#111',
        inactive: '#8e8e93',
        accent: '#ff7a59',
        blur: 'light',
      };

  return (
    <BlurView
      intensity={90}
      tint={colors.blur}
      style={[
        styles.container,
        {
          backgroundColor:
            darkMode
              ? 'rgba(18,18,18,0.92)'
              : 'rgba(255,247,242,0.92)',
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive =
          activeTab === tab.id;

        return (
          <Pressable
            key={tab.id}
            style={styles.tabItem}
            onPress={() =>
              setActiveTab(tab.id)
            }
          >
            <View
              style={[
                styles.iconContainer,

                isActive && {
                  backgroundColor:
                    colors.accent +
                    '20',
                },
              ]}
            >
              <Ionicons
                name={
                  isActive
                    ? tab.iconFilled
                    : tab.iconOutline
                }
                size={22}
                color={
                  isActive
                    ? colors.accent
                    : colors.inactive
                }
              />
            </View>

            <Text
              style={[
                styles.tabLabel,

                {
                  color: isActive
                    ? colors.accent
                    : colors.inactive,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',

    height:
      Platform.OS === 'ios'
        ? 92
        : 72,

    paddingBottom:
      Platform.OS === 'ios'
        ? 28
        : 10,

    paddingTop: 10,

    justifyContent:
      'space-around',

    alignItems: 'center',

    borderTopWidth: 0,
  },

  tabItem: {
    flex: 1,

    alignItems: 'center',
  },

  iconContainer: {
    width: 40,

    height: 40,

    borderRadius: 20,

    justifyContent: 'center',

    alignItems: 'center',
  },

  tabLabel: {
    marginTop: 4,

    fontSize: 11,

    fontWeight: '600',
  },
});