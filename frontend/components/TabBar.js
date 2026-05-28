import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { COLORS, styles } from './styles/TabBar.styles';

const TABS = [
  { id: 'swipe',     label: 'Swipe',  iconOutline: 'flame-outline',      iconFilled: 'flame' },
  { id: 'favorites', label: 'Likes',  iconOutline: 'heart-outline',      iconFilled: 'heart' },
  { id: 'chat',      label: 'Chats',  iconOutline: 'chatbubble-outline', iconFilled: 'chatbubble' },
  { id: 'profile',   label: 'Profil', iconOutline: 'person-outline',     iconFilled: 'person' },
];

export default function TabBar({ activeTab, setActiveTab, darkMode, unreadCount = 0 }) {
  const colors = darkMode ? COLORS.dark : COLORS.light;

  return (
    <BlurView
      intensity={90}
      tint={colors.blur}
      style={[
        styles.container,
        { backgroundColor: darkMode ? 'rgba(18,18,18,0.92)' : 'rgba(255,247,242,0.92)' },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const showBadge = tab.id === 'chat' && unreadCount > 0;

        return (
          <Pressable key={tab.id} style={styles.tabItem} onPress={() => setActiveTab(tab.id)}>
            <View style={[styles.iconContainer, isActive && { backgroundColor: colors.accent + '20' }]}>
              <Ionicons
                name={isActive ? tab.iconFilled : tab.iconOutline}
                size={22}
                color={isActive ? colors.accent : colors.inactive}
              />
              {showBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, { color: isActive ? colors.accent : colors.inactive }]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}
