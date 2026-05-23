import React, { useState, useRef, useEffect } from 'react';

import {
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS, styles } from './styles/ChatScreen.styles';

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
  const scrollViewRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (activeChatId) onMarkAsRead(activeChatId);
  }, [activeChatId]);

  if (!activeChatId) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.title, { color: colors.text }]}>Chats</Text>

        <ScrollView>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              style={[styles.chatRow, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setActiveChatId(chat.id)}
            >
              <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                <Text style={styles.avatarText}>{chat.name[0]}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.chatName, { color: colors.text }]}>{chat.name}</Text>
                <Text style={[styles.lastMessage, { color: colors.sub }]} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.activeContainer, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[
            styles.activeHeader,
            { backgroundColor: colors.card, borderBottomColor: colors.border },
          ]}
        >
          <Pressable onPress={() => setActiveChatId(null)}>
            <Ionicons name="chevron-back" size={28} color={colors.accent} />
          </Pressable>
          <Text style={[styles.activeName, { color: colors.text }]}>{activeChat.name}</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ padding: 18, paddingBottom: 40 }}
        >
          {activeChat.messages.map((msg) => {
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}