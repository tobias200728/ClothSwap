import React, { useState } from 'react';

import {
  StyleSheet,
  View,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';

// LOGIN
import LoginScreen from './components/LoginScreen';

// Components
import TabBar from './components/TabBar';
import SwipeScreen from './components/SwipeScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfilePage/ProfileScreen';
import DetailModal from './components/DetailModal';

// Mock Data
import {
  INITIAL_SWIPE_ITEMS,
  INITIAL_FAVORITES,
  INITIAL_CHATS,
  INITIAL_USER_ITEMS,
} from './data';

export default function App() {
  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState('swipe');

  const [darkMode, setDarkMode] =
    useState(false);

  // App States
  const [swipeItems, setSwipeItems] =
    useState(INITIAL_SWIPE_ITEMS);

  const [favorites, setFavorites] =
    useState(INITIAL_FAVORITES);

  const [chats, setChats] =
    useState(INITIAL_CHATS);

  const [userItems, setUserItems] =
    useState(INITIAL_USER_ITEMS);

  const [userProfile, setUserProfile] =
    useState({
      name: 'Max Mustermann',

      location:
        'Berlin, Deutschland',
    });

  // Modal / Detail States
  const [
    selectedDetailItem,
    setSelectedDetailItem,
  ] = useState(null);

  const [
    detailModalVisible,
    setDetailModalVisible,
  ] = useState(false);

  // Chat Navigation State
  const [activeChatId, setActiveChatId] =
    useState(null);

  // LOGIN HANDLER

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // HANDLERS

  const handleLike = (item) => {
    if (
      !favorites.some(
        (fav) => fav.id === item.id
      )
    ) {
      setFavorites((prev) => [
        item,
        ...prev,
      ]);
    }
  };

  const handleDislike = () => {};

  const handleRemoveFavorite = (
    itemId
  ) => {
    setFavorites((prev) =>
      prev.filter(
        (item) => item.id !== itemId
      )
    );
  };

  const handleSendMessageFromFavorites =
    (item) => {
      const existingChat = chats.find(
        (c) =>
          c.name === item.owner &&
          c.item === item.title
      );

      if (existingChat) {
        setActiveChatId(
          existingChat.id
        );

        setActiveTab('chat');
      } else {
        const newChatId = `chat_${Date.now()}`;

        const newChat = {
          id: newChatId,

          name: item.owner,

          item: item.title,

          avatarColor:
            item.avatarColor ||
            '#ff8c69',

          unreadCount: 0,

          lastMessage: `Hallo ${item.owner}! Ich habe Interesse an deiner '${item.title}'...`,

          time: 'Jetzt',

          messages: [
            {
              id: `msg_${Date.now()}`,

              sender: 'me',

              text: `Hallo ${item.owner}! Ich habe Interesse an deiner '${item.title}'.`,

              time: 'Jetzt',
            },
          ],
        };

        setChats((prev) => [
          newChat,
          ...prev,
        ]);

        setActiveChatId(newChatId);

        setActiveTab('chat');
      }
    };

  const handleSendMessage = (
    chatId,
    text,
    sender = 'me'
  ) => {
    const timeNow =
      new Date().toLocaleTimeString(
        'de-DE',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      );

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [
            ...chat.messages,

            {
              id: `msg_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,

              sender,

              text,

              time: timeNow,
            },
          ];

          return {
            ...chat,

            messages:
              updatedMessages,

            lastMessage: text,

            time: timeNow,

            unreadCount:
              sender === 'them' &&
              activeChatId !== chatId
                ? chat.unreadCount + 1
                : chat.unreadCount,
          };
        }

        return chat;
      })
    );
  };

  const handleMarkAsRead = (
    chatId
  ) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            unreadCount: 0,
          };
        }

        return chat;
      })
    );
  };

  // PROFILE

  const handleAddItem = (
    newItem
  ) => {
    setUserItems((prev) => [
      newItem,
      ...prev,
    ]);
  };

  const handleUpdateItemStatus = (
    itemId,
    newStatus
  ) => {
    setUserItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );
  };

  const handleUpdateProfile = (
    profileData
  ) => {
    setUserProfile((prev) => ({
      ...prev,
      ...profileData,
    }));
  };

  const handleSelectDetailItem = (
    item
  ) => {
    setSelectedDetailItem(item);

    setDetailModalVisible(true);
  };

  // LOGIN SCREEN

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
      />
    );
  }

  // RENDER CONTENT

  const renderContent = () => {
    switch (activeTab) {
      case 'swipe':
        return (
          <SwipeScreen
            items={swipeItems}
            onLike={handleLike}
            onDislike={
              handleDislike
            }
            onSelectDetail={
              handleSelectDetailItem
            }
            darkMode={darkMode}
          />
        );

      case 'favorites':
        return (
          <FavoritesScreen
            favorites={favorites}
            onRemoveFavorite={
              handleRemoveFavorite
            }
            onSendMessage={
              handleSendMessageFromFavorites
            }
            darkMode={darkMode}
          />
        );

      case 'chat':
        return (
          <ChatScreen
            chats={chats}
            onSendMessage={
              handleSendMessage
            }
            onMarkAsRead={
              handleMarkAsRead
            }
            activeChatId={
              activeChatId
            }
            setActiveChatId={
              setActiveChatId
            }
            darkMode={darkMode}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            userItems={userItems}
            onAddItem={
              handleAddItem
            }
            onUpdateItemStatus={
              handleUpdateItemStatus
            }
            userProfile={
              userProfile
            }
            onUpdateProfile={
              handleUpdateProfile
            }
            darkMode={darkMode}
            setDarkMode={
              setDarkMode
            }
          />
        );

      default:
        return (
          <SwipeScreen
            items={swipeItems}
            onLike={handleLike}
            onDislike={
              handleDislike
            }
            onSelectDetail={
              handleSelectDetailItem
            }
            darkMode={darkMode}
          />
        );
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.container,

        {
          backgroundColor:
            darkMode
              ? '#121212'
              : '#fff7f2',
        },
      ]}
    >
      <StatusBar
        style={
          darkMode
            ? 'light'
            : 'dark'
        }
      />

      <View style={styles.content}>
        {renderContent()}
      </View>

      <TabBar
        darkMode={darkMode}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);

          if (tab === 'chat') {
            setActiveChatId(null);
          }
        }}
      />

      <DetailModal
        item={selectedDetailItem}
        visible={detailModalVisible}
        onClose={() =>
          setDetailModalVisible(
            false
          )
        }
        onLike={handleLike}
        onDislike={
          handleDislike
        }
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    paddingTop:
      Platform.OS === 'android'
        ? RNStatusBar.currentHeight
        : 0,
  },

  content: {
    flex: 1,
  },
});