import React, {
  useState,
  useRef,
  useEffect,
} from 'react';

import {
  StyleSheet,
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

const COLORS = {
  light: {
    bg: '#fff7f2',
    card: '#ffffff',
    text: '#1a1a1a',
    sub: '#777777',
    accent: '#ff7a59',
    border: '#f2d9cf',
    input: '#fffaf7',
  },

  dark: {
    bg: '#121212',
    card: '#1e1e1f',
    text: '#ffffff',
    sub: '#aaaaaa',
    accent: '#ff8c69',
    border: '#2f2f32',
    input: '#2a2a2d',
  },
};

export default function ChatScreen({
  chats,
  onSendMessage,
  onMarkAsRead,
  activeChatId,
  setActiveChatId,
  darkMode,
}) {
  const colors = darkMode
    ? COLORS.dark
    : COLORS.light;

  const [inputText, setInputText] =
    useState('');

  const scrollViewRef = useRef(null);

  const activeChat = chats.find(
    (c) => c.id === activeChatId
  );

  useEffect(() => {
    if (activeChatId) {
      onMarkAsRead(activeChatId);
    }
  }, [activeChatId]);

  if (!activeChatId) {
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
        <Text
          style={[
            styles.title,
            { color: colors.text },
          ]}
        >
          Chats
        </Text>

        <ScrollView>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              style={[
                styles.chatRow,
                {
                  backgroundColor:
                    colors.card,

                  borderColor:
                    colors.border,
                },
              ]}
              onPress={() =>
                setActiveChatId(chat.id)
              }
            >
              <View
                style={[
                  styles.avatar,
                  {
                    backgroundColor:
                      colors.accent,
                  },
                ]}
              >
                <Text
                  style={
                    styles.avatarText
                  }
                >
                  {chat.name[0]}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.chatName,
                    {
                      color:
                        colors.text,
                    },
                  ]}
                >
                  {chat.name}
                </Text>

                <Text
                  style={[
                    styles.lastMessage,
                    {
                      color:
                        colors.sub,
                    },
                  ]}
                  numberOfLines={1}
                >
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
      style={[
        styles.activeContainer,
        {
          backgroundColor:
            colors.bg,
        },
      ]}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={[
            styles.activeHeader,
            {
              backgroundColor:
                colors.card,

              borderBottomColor:
                colors.border,
            },
          ]}
        >
          <Pressable
            onPress={() =>
              setActiveChatId(null)
            }
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.accent}
            />
          </Pressable>

          <Text
            style={[
              styles.activeName,
              {
                color: colors.text,
              },
            ]}
          >
            {activeChat.name}
          </Text>

          <View style={{ width: 28 }} />
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            padding: 18,
            paddingBottom: 40,
          }}
        >
          {activeChat.messages.map(
            (msg) => {
              const isMe =
                msg.sender === 'me';

              return (
                <View
                  key={msg.id}
                  style={[
                    styles.msgRow,
                    {
                      alignSelf: isMe
                        ? 'flex-end'
                        : 'flex-start',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      {
                        backgroundColor:
                          isMe
                            ? colors.accent
                            : colors.card,

                        borderColor:
                          colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: isMe
                          ? '#fff'
                          : colors.text,

                        fontSize: 15,
                      }}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </View>
              );
            }
          )}
        </ScrollView>

        <View
          style={[
            styles.inputBar,
            {
              backgroundColor:
                colors.card,

              borderTopColor:
                colors.border,
            },
          ]}
        >
          <TextInput
            value={inputText}
            onChangeText={
              setInputText
            }
            placeholder="Nachricht..."
            placeholderTextColor={
              colors.sub
            }
            style={[
              styles.input,
              {
                backgroundColor:
                  colors.input,

                color: colors.text,

                borderColor:
                  colors.border,
              },
            ]}
          />

          <Pressable
            style={[
              styles.sendBtn,
              {
                backgroundColor:
                  colors.accent,
              },
            ]}
            onPress={() => {
              if (
                !inputText.trim()
              )
                return;

              onSendMessage(
                activeChatId,
                inputText
              );

              setInputText('');
            }}
          >
            <Ionicons
              name="send"
              size={18}
              color="#fff"
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 18,
  },

  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  chatName: {
    fontSize: 16,
    fontWeight: '700',
  },

  lastMessage: {
    marginTop: 4,
  },

  activeContainer: {
    flex: 1,
  },

  activeHeader: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },

  activeName: {
    fontSize: 18,
    fontWeight: '700',
  },

  msgRow: {
    marginBottom: 14,
    maxWidth: '80%',
  },

  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    paddingBottom:
      Platform.OS === 'ios'
        ? 30
        : 12,
  },

  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    fontSize: 15,
    borderWidth: 1,
  },

  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});