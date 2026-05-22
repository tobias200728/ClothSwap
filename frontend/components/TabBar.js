import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'swipe', label: 'Swipe', iconOutline: 'home-outline', iconFilled: 'home' },
    { id: 'favorites', label: 'Favoriten', iconOutline: 'heart-outline', iconFilled: 'heart' },
    { id: 'chat', label: 'Chat', iconOutline: 'chatbubble-outline', iconFilled: 'chatbubble' },
    { id: 'profile', label: 'Profil', iconOutline: 'person-outline', iconFilled: 'person' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const iconName = isActive ? tab.iconFilled : tab.iconOutline;
        
        return (
          <Pressable
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isActive ? '#f53b75' : '#8e8e93'}
            />
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 64,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#8e8e93',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#f53b75',
    fontWeight: '600',
  },
});
