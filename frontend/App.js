import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Components
import TabBar from './components/TabBar';
import SwipeScreen from './components/SwipeScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfileScreen';
import DetailModal from './components/DetailModal';

// Mock Data
import {
  INITIAL_SWIPE_ITEMS,
  INITIAL_FAVORITES,
  INITIAL_CHATS,
  INITIAL_USER_ITEMS,
} from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState('swipe');
  
  // App States
  const [swipeItems, setSwipeItems] = useState(INITIAL_SWIPE_ITEMS);
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [userItems, setUserItems] = useState(INITIAL_USER_ITEMS);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Max Mustermann',
    location: 'Berlin, Deutschland',
  });

  // Modal / Detail States
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // Tab Action Handlers
  const handleLike = (item) => {
    // Check if item is already in favorites
    if (!favorites.some((fav) => fav.id === item.id)) {
      setFavorites((prev) => [item, ...prev]);
    }
  };

  const handleDislike = (item) => {
    // Just log or handle if needed
  };

  const handleRemoveFavorite = (itemId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleSendMessageFromFavorites = (item) => {
    const existingChat = chats.find((c) => c.name === item.owner && c.item === item.title);
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setActiveTab('chat');
    } else {
      const newChatId = `chat_${Date.now()}`;
      const newChat = {
        id: newChatId,
        name: item.owner,
        item: item.title,
        avatarColor: item.avatarColor || '#ba68c8',
        unreadCount: 0,
        lastMessage: `Hallo ${item.owner}! Ich habe Interesse an deiner '${item.title}'...`,
        time: 'Jetzt',
        messages: [
          {
            id: `msg_${Date.now()}`,
            sender: 'me',
            text: `Hallo ${item.owner}! Ich habe Interesse an deiner '${item.title}'. Tauschst du gegen etwas aus meiner Liste?`,
            time: 'Jetzt',
          },
        ],
      };
      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChatId);
      setActiveTab('chat');
    }
  };

  // Lift chat thread state to App.js to support navigation triggers
  const [activeChatId, setActiveChatId] = useState(null);

  const handleSendMessage = (chatId, text, sender = 'me') => {
    const timeNow = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [
            ...chat.messages,
            {
              id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              sender,
              text,
              time: timeNow,
            },
          ];
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: text,
            time: timeNow,
            unreadCount: sender === 'them' && activeChatId !== chatId ? chat.unreadCount + 1 : chat.unreadCount,
          };
        }
        return chat;
      })
    );
  };

  const handleMarkAsRead = (chatId) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      })
    );
  };

  // Profile Action Handlers
  const handleAddItem = (newItem) => {
    setUserItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateItemStatus = (itemId, newStatus) => {
    setUserItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
  };

  const handleUpdateProfile = (profileData) => {
    setUserProfile((prev) => ({ ...prev, ...profileData }));
  };

  const handleSelectDetailItem = (item) => {
    setSelectedDetailItem(item);
    setDetailModalVisible(true);
  };

  // Render Active Tab Content
  const renderContent = () => {
    switch (activeTab) {
      case 'swipe':
        return (
          <SwipeScreen
            items={swipeItems}
            onLike={handleLike}
            onDislike={handleDislike}
            onSelectDetail={handleSelectDetailItem}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onSendMessage={handleSendMessageFromFavorites}
          />
        );
      case 'chat':
        return (
          <ChatScreen
            chats={chats}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
            // Passing active state control
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            userItems={userItems}
            onAddItem={handleAddItem}
            onUpdateItemStatus={handleUpdateItemStatus}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return <SwipeScreen items={swipeItems} onLike={handleLike} onDislike={handleDislike} onSelectDetail={handleSelectDetailItem} />;
    }
  };

  // Helper hook to handle activeChatId setting from favorites

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      <TabBar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Reset active chat view when returning to chat list
          if (tab === 'chat') {
            setActiveChatId(null);
          }
        }}
      />

      <DetailModal
        item={selectedDetailItem}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        onLike={handleLike}
        onDislike={handleDislike}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
});
