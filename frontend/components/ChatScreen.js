import React, { useState, useRef, useEffect } from 'react';
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

export default function ChatScreen({ chats, onSendMessage, onMarkAsRead, activeChatId, setActiveChatId }) {
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Mark active chat as read when opened
  useEffect(() => {
    if (activeChatId) {
      onMarkAsRead(activeChatId);
    }
  }, [activeChatId]);

  // Scroll to bottom of chat details
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText.trim();
    setInputText('');
    
    onSendMessage(activeChatId, text);
    
    // Auto-respond simulation
    setTimeout(() => {
      let replyText = 'Klingt super! Wollen wir uns treffen oder verschicken?';
      if (text.toLowerCase().includes('hallo') || text.toLowerCase().includes('hi')) {
        replyText = 'Hi! Ja, gerne. Wie wollen wir vorgehen?';
      } else if (text.toLowerCase().includes('preis') || text.toLowerCase().includes('kosten') || text.toLowerCase().includes('bieten')) {
        replyText = 'Ich tausche am liebsten gegen etwas aus deiner Liste! Hast du neue Sachen hochgeladen?';
      } else if (text.toLowerCase().includes('wo') || text.toLowerCase().includes('treffen') || text.toLowerCase().includes('zeit')) {
        replyText = 'Ich wohne in Berlin. Wir können uns gerne am Wochenende treffen!';
      } else if (text.toLowerCase().includes('zustand') || text.toLowerCase().includes('foto')) {
        replyText = 'Der Zustand ist wie beschrieben. Ich kann dir später noch ein Bild schicken.';
      }
      
      onSendMessage(activeChatId, replyText, 'them');
    }, 1500);
  };

  const handleBack = () => {
    setActiveChatId(null);
  };

  // If in list view
  if (!activeChatId) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>

        <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
          {chats.map((chat) => (
            <Pressable
              key={chat.id}
              style={styles.chatRow}
              onPress={() => setActiveChatId(chat.id)}
            >
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: chat.avatarColor }]}>
                  <Text style={styles.avatarText}>{chat.name[0]}</Text>
                </View>
                {chat.unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{chat.unreadCount}</Text>
                  </View>
                )}
              </View>

              <View style={styles.chatInfo}>
                <View style={styles.chatHeaderRow}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={[styles.chatTime, chat.unreadCount > 0 && styles.activeTime]}>
                    {chat.time}
                  </Text>
                </View>
                <Text
                  style={[styles.lastMessage, chat.unreadCount > 0 && styles.unreadMessage]}
                  numberOfLines={1}
                >
                  {chat.lastMessage}
                </Text>
                <Text style={styles.itemTag}>{chat.item}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  // Active chat view
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.activeContainer}
    >
      {/* Active Chat Header */}
      <View style={styles.activeHeader}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#f53b75" />
          <Text style={styles.backButtonText}>Zurück</Text>
        </Pressable>
        <View style={styles.activeHeaderTitleContainer}>
          <Text style={styles.activeHeaderName}>{activeChat.name}</Text>
          <Text style={styles.activeHeaderItem}>{activeChat.item}</Text>
        </View>
        <View style={styles.headerRightSpacer} />
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messageScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeChat.messages.map((msg) => {
          const isMe = msg.sender === 'me';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isMe ? styles.messageRowMe : styles.messageRowThem,
              ]}
            >
              {!isMe && (
                <View style={[styles.miniAvatar, { backgroundColor: activeChat.avatarColor }]}>
                  <Text style={styles.miniAvatarText}>{activeChat.name[0]}</Text>
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  isMe ? styles.bubbleMe : styles.bubbleThem,
                ]}
              >
                <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                  {msg.text}
                </Text>
                {msg.time && (
                  <Text style={[styles.msgTime, isMe ? styles.msgTimeMe : styles.msgTimeThem]}>
                    {msg.time}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Nachricht schreiben..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f2',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  chatList: {
    flex: 1,
  },
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8fa',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff3b30',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  chatName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
  },
  chatTime: {
    fontSize: 12,
    color: '#8e8e93',
  },
  activeTime: {
    color: '#f53b75',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  unreadMessage: {
    color: '#1a1a1a',
    fontWeight: '600',
  },
  itemTag: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 4,
  },
  // Active Chat styles
  activeContainer: {
    flex: 1,
    backgroundColor: '#f6f6f9',
  },
  activeHeader: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e9',
    paddingHorizontal: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  backButtonText: {
    fontSize: 14,
    color: '#f53b75',
    fontWeight: '600',
    marginLeft: -2,
  },
  activeHeaderTitleContainer: {
    alignItems: 'center',
  },
  activeHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  activeHeaderItem: {
    fontSize: 11,
    color: '#8e8e93',
    marginTop: 2,
  },
  headerRightSpacer: {
    width: 80,
  },
  messageScrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    maxWidth: '80%',
  },
  messageRowMe: {
    alignSelf: 'flex-end',
  },
  messageRowThem: {
    alignSelf: 'flex-start',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  miniAvatarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bubbleMe: {
    backgroundColor: '#f53b75',
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 18,
  },
  bubbleTextMe: {
    color: '#ffffff',
  },
  bubbleTextThem: {
    color: '#222222',
  },
  msgTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  msgTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  msgTimeThem: {
    color: '#8e8e93',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e9',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f2f2f7',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#333',
    marginRight: 10,
    outlineStyle: 'none', // Remove web outline
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f53b75',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ffb3ca',
  },
});
