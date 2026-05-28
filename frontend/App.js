import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  StatusBar as RNStatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './components/LoginScreen';
import TabBar from './components/TabBar';
import SwipeScreen from './components/SwipeScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ChatScreen from './components/ChatScreen';
import ProfileScreen from './components/ProfilePage/ProfileScreen';
import DetailModal from './components/DetailModal';

import * as api from './services/api';
import { getToken, saveToken, saveUser, getUser, clearSession } from './services/storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [activeTab, setActiveTab] = useState('swipe');
  const [darkMode, setDarkMode] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [swipeItems, setSwipeItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [chats, setChats] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: '', location: '' });

  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);

  // Restore session on app start
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const user = await getUser();
        if (token && user) {
          setCurrentUser(user);
          setUserProfile({ name: user.name, location: user.location, image: user.image, plan: user.plan });
          setIsLoggedIn(true);
          await loadInitialData(user.id);
        }
      } catch (_) {
        // Corrupt session – ignore and show login
      } finally {
        setBootstrapping(false);
      }
    })();
  }, []);

  async function loadInitialData(userId, retry = true) {
    try {
      const [items, favs, chatList, myItems, profile] = await Promise.all([
        api.getSwipeFeed(),
        api.getFavorites(),
        api.getChats(userId),
        api.getMyItems(),
        api.getProfile(),
      ]);
      setSwipeItems(items);
      setFavorites(favs);
      setChats(chatList);
      setUserItems(myItems);
      setUserProfile({ name: profile.name, location: profile.location, image: profile.image, plan: profile.plan });
      const updatedUser = { id: userId, ...profile };
      setCurrentUser(updatedUser);
      await saveUser(updatedUser);
    } catch (e) {
      console.error('Fehler beim Laden der Daten:', e);
      const msg = e?.message || '';
      // Auth errors → clear session and force re-login
      if (msg.includes('401') || msg.toLowerCase().includes('zugangsdaten') || msg.toLowerCase().includes('token')) {
        await handleLogout();
        return;
      }
      // Server cold start → retry once after 6s
      if (retry) {
        await new Promise((res) => setTimeout(res, 6000));
        await loadInitialData(userId, false);
      }
    }
  }

  async function handleLogin(token, user) {
    await saveToken(token);
    await saveUser(user);
    setCurrentUser(user);
    setUserProfile({ name: user.name, location: user.location, image: user.image, plan: user.plan });
    setIsLoggedIn(true);
    await loadInitialData(user.id);
  }

  async function handleLike(item) {
    try {
      await api.likeItem(item.id);
      if (!favorites.some((f) => f.id === item.id)) {
        setFavorites((prev) => [item, ...prev]);
      }
    } catch (e) {
      console.error('Like fehlgeschlagen:', e);
    }
  }

  async function handleDislike(item) {
    try {
      await api.dislikeItem(item.id);
    } catch (e) {
      console.error('Dislike fehlgeschlagen:', e);
    }
  }

  async function handleRemoveFavorite(itemId) {
    try {
      await api.removeFavorite(itemId);
      setFavorites((prev) => prev.filter((item) => item.id !== itemId));
    } catch (e) {
      console.error('Favorit entfernen fehlgeschlagen:', e);
    }
  }

  async function handleSendMessageFromFavorites(item) {
    try {
      const existingChat = chats.find((c) => c.item === item.title && c.name === item.owner);
      if (existingChat) {
        setActiveChatId(existingChat.id);
        setActiveTab('chat');
        return;
      }

      const raw = await api.createChat(
        item.owner_id,
        item.id,
        `Hallo ${item.owner}! Ich interessiere mich für deine '${item.title}'.`
      );

      const newChat = {
        id: raw.id,
        name: raw.name,
        item: raw.item,
        avatarColor: raw.avatar_color,
        unreadCount: 0,
        lastMessage: raw.last_message,
        time: raw.time,
        messages: (raw.messages || []).map((m) => ({
          id: m.id,
          sender: m.sender_id === currentUser.id ? 'me' : 'them',
          text: m.text,
          time: m.time,
        })),
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      setActiveTab('chat');
    } catch (e) {
      console.error('Chat erstellen fehlgeschlagen:', e);
    }
  }

  async function handleSendMessage(chatId, text) {
    try {
      const msg = await api.sendMessage(chatId, text);
      const timeNow = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== chatId) return chat;
          return {
            ...chat,
            messages: [
              ...chat.messages,
              { id: msg.id, sender: 'me', text, time: timeNow },
            ],
            lastMessage: text,
            time: timeNow,
          };
        })
      );
    } catch (e) {
      console.error('Nachricht senden fehlgeschlagen:', e);
    }
  }

  async function handleOpenChat(chatId) {
    setActiveChatId(chatId);
    if (!chatId) return;
    try {
      const full = await api.getChatWithMessages(chatId, currentUser.id);
      setChats((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, messages: full.messages } : c))
      );
    } catch (e) {
      console.error('Chat-Nachrichten laden fehlgeschlagen:', e);
    }
  }

  async function handleMarkAsRead(chatId) {
    try {
      await api.markChatAsRead(chatId);
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat))
      );
    } catch (_) {}
  }

  async function handleAddItem(newItem) {
    try {
      let imageUrl = newItem.image;
      // If it's a local file URI, upload to Supabase Storage first
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = await api.uploadImage(imageUrl);
      }
      const created = await api.createItem({ ...newItem, image: imageUrl });
      setUserItems((prev) => [created, ...prev]);
    } catch (e) {
      console.error('Item erstellen fehlgeschlagen:', e);
    }
  }

  function handleUpdateItemStatus(itemId, newStatus) {
    setUserItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
  }

  async function handleUpdateItem(itemId, data) {
    try {
      let imageUrl = data.image;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = await api.uploadImage(imageUrl);
      }
      const updated = await api.updateItem(itemId, { ...data, image: imageUrl });
      setUserItems((prev) => prev.map((item) => (item.id === itemId ? updated : item)));
    } catch (e) {
      console.error('Item aktualisieren fehlgeschlagen:', e);
    }
  }

  async function handleDeleteItem(itemId) {
    try {
      await api.deleteItem(itemId);
      setUserItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (e) {
      console.error('Item löschen fehlgeschlagen:', e);
    }
  }

  async function handleUpdateProfile(profileData) {
    try {
      let imageUrl = profileData.image;
      // Upload local image to Supabase Storage if it's not already a URL
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = await api.uploadImage(imageUrl);
      }
      const updated = await api.updateProfile({ ...profileData, image: imageUrl });
      const merged = { ...currentUser, ...updated };
      setUserProfile((prev) => ({ ...prev, ...profileData, image: imageUrl, ...updated }));
      setCurrentUser(merged);
      await saveUser(merged);
    } catch (e) {
      console.error('Profil aktualisieren fehlgeschlagen:', e);
    }
  }

  async function handleLogout() {
    await clearSession();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSwipeItems([]);
    setFavorites([]);
    setChats([]);
    setUserItems([]);
    setUserProfile({ name: '', location: '' });
    setActiveTab('swipe');
  }

  function handleSelectDetailItem(item) {
    setSelectedDetailItem(item);
    setDetailModalVisible(true);
  }

  if (bootstrapping) {
    return (
      <SafeAreaProvider>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff7a59" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <LoginScreen onLogin={handleLogin} />
      </SafeAreaProvider>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'swipe':
        return (
          <SwipeScreen
            items={swipeItems}
            onLike={handleLike}
            onDislike={handleDislike}
            onSelectDetail={handleSelectDetailItem}
            darkMode={darkMode}
          />
        );
      case 'favorites':
        return (
          <FavoritesScreen
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
            onSendMessage={handleSendMessageFromFavorites}
            darkMode={darkMode}
          />
        );
      case 'chat':
        return (
          <ChatScreen
            chats={chats}
            onSendMessage={handleSendMessage}
            onMarkAsRead={handleMarkAsRead}
            activeChatId={activeChatId}
            setActiveChatId={handleOpenChat}
            darkMode={darkMode}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            userItems={userItems}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onUpdateItemStatus={handleUpdateItemStatus}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        );
      default:
        return (
          <SwipeScreen
            items={swipeItems}
            onLike={handleLike}
            onDislike={handleDislike}
            onSelectDetail={handleSelectDetailItem}
            darkMode={darkMode}
          />
        );
    }
  };

  const safeAreaBg = activeTab === 'profile'
    ? (darkMode ? '#ff8c69' : '#ff7a59')
    : (darkMode ? '#121212' : '#fff7f2');

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={['top']}
        style={[styles.container, { backgroundColor: safeAreaBg }]}
      >
        <StatusBar style={darkMode ? 'light' : 'dark'} />
        <View style={styles.content}>{renderContent()}</View>
        <TabBar
          darkMode={darkMode}
          activeTab={activeTab}
          unreadCount={chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0)}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'chat') handleOpenChat(null);
          }}
        />
        <DetailModal
          item={selectedDetailItem}
          visible={detailModalVisible}
          onClose={() => setDetailModalVisible(false)}
          onLike={handleLike}
          onDislike={handleDislike}
          darkMode={darkMode}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  content: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff7f2',
  },
});
