import React, { useState, useRef, useEffect } from 'react';

import {
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS, styles } from './styles/ChatScreen.styles';
import UserProfileModal from './UserProfileModal';

export default function ChatScreen({
  chats,
  onSendMessage,
  onMarkAsRead,
  activeChatId,
  setActiveChatId,
  darkMode,
}) {
  const colors = darkMode ? COLORS.dark : COLORS.light;

  const [inputText, setInputText] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const scrollViewRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (activeChatId) onMarkAsRead(activeChatId);
  }, [activeChatId]);

  if (!activeChatId) {
    return (
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>

        <ScrollView>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              style={[styles.chatRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setActiveChatId(chat.id)}
            >
              {chat.otherImage ? (
                <Image
                  source={{ uri: chat.otherImage }}
                  style={[styles.avatar, { overflow: 'hidden' }]}
                />
              ) : (
                <View style={[styles.avatar, { backgroundColor: chat.avatarColor || colors.accent }]}>
                  <Text style={styles.avatarText}>{(chat.name || '?')[0]}</Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={[styles.chatName, { color: colors.text, fontWeight: chat.unreadCount > 0 ? '800' : '700' }]}>
                  {chat.name}
                </Text>
                <Text
                  style={[styles.lastMessage, { color: chat.unreadCount > 0 ? colors.text : colors.sub, fontWeight: chat.unreadCount > 0 ? '600' : '400' }]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                <Text style={{ fontSize: 12, color: colors.sub, marginBottom: 6 }}>{chat.time}</Text>
                {chat.unreadCount > 0 && (
                  <View style={{ minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.activeContainer, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.activeHeader,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <Pressable onPress={() => setActiveChatId(null)}>
            <Ionicons name="chevron-back" size={28} color={colors.accent} />
          </Pressable>

          <Pressable onPress={() => activeChat?.otherUserId && setProfileModalVisible(true)}>
            <Text style={[styles.activeName, { color: colors.text }]}>
              {activeChat?.name}
            </Text>
            {activeChat?.otherUserId && (
              <Text style={{ fontSize: 11, color: colors.accent, textAlign: 'center', marginTop: 1 }}>
                Profil ansehen
              </Text>
            )}
          </Pressable>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        >
          {activeChat?.messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <View key={msg.id} style={[styles.msgRow, { alignSelf: isMe ? 'flex-end' : 'flex-start' }]}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isMe ? colors.accent : colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={{ color: isMe ? '#fff' : colors.text, fontSize: 15 }}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={[styles.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Nachricht..."
            placeholderTextColor={colors.sub}
            style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
          />
          <Pressable
            style={[styles.sendBtn, { backgroundColor: colors.accent }]}
            onPress={() => {
              if (!inputText.trim()) return;
              onSendMessage(activeChatId, inputText);
              setInputText('');
            }}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      {activeChat?.otherUserId && (
        <UserProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          userId={activeChat.otherUserId}
          userName={activeChat.name}
          userAvatarColor={activeChat.avatarColor}
          userImage={activeChat.otherImage}
          darkMode={darkMode}
        />
      )}
    </KeyboardAvoidingView>
  );
}
