import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, Image, ScrollView,
  Pressable, ActivityIndicator, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as api from '../services/api';

const COLORS = {
  light: {
    bg: '#ffffff',
    overlay: 'rgba(0,0,0,0.45)',
    text: '#1a1a1a',
    subtext: '#666666',
    border: '#f0f0f2',
    card: '#fafafa',
  },
  dark: {
    bg: '#1d1d1f',
    overlay: 'rgba(0,0,0,0.65)',
    text: '#ffffff',
    subtext: '#aaaaaa',
    border: '#2f2f32',
    card: '#2a2a2d',
  },
};

export default function UserProfileModal({
  userId,
  userName,
  userAvatarColor,
  userImage,
  visible,
  onClose,
  darkMode = false,
}) {
  const c = darkMode ? COLORS.dark : COLORS.light;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible || !userId) return;
    setLoading(true);
    api.getUserItems(userId)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [visible, userId]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: c.overlay, justifyContent: 'flex-end' }}>
        <View style={{
          width: '100%',
          height: '80%',
          backgroundColor: c.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}>

          {/* ── Header ── */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingBottom: 14,
            borderBottomWidth: 1,
            borderBottomColor: c.border,
          }}>
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 14 }}
              />
            ) : (
              <View style={{
                width: 50, height: 50, borderRadius: 25,
                backgroundColor: userAvatarColor || '#4ECDC4',
                justifyContent: 'center', alignItems: 'center', marginRight: 14,
              }}>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '800' }}>
                  {(userName || '?')[0]}
                </Text>
              </View>
            )}

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 20, fontWeight: '800', color: c.text }}>{userName}</Text>
              <Text style={{ fontSize: 13, color: c.subtext, marginTop: 2 }}>Artikel ansehen</Text>
            </View>

            <Pressable
              style={{
                width: 36, height: 36, borderRadius: 18,
                backgroundColor: 'rgba(128,128,128,0.12)',
                justifyContent: 'center', alignItems: 'center',
              }}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={c.text} />
            </Pressable>
          </View>

          {/* ── Items grid ── */}
          <ScrollView
            contentContainerStyle={{ padding: 18, paddingBottom: Platform.OS === 'ios' ? 48 : 28 }}
            showsVerticalScrollIndicator={false}
          >
            {loading && (
              <ActivityIndicator color="#ff7a59" size="large" style={{ marginTop: 48 }} />
            )}

            {!loading && items.length === 0 && (
              <Text style={{ color: c.subtext, textAlign: 'center', marginTop: 48, fontSize: 15 }}>
                Keine Artikel vorhanden
              </Text>
            )}

            {!loading && items.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      width: '48%',
                      borderRadius: 18,
                      overflow: 'hidden',
                      marginBottom: 14,
                      backgroundColor: c.card,
                      borderWidth: 1,
                      borderColor: c.border,
                    }}
                  >
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: '100%', height: 130 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{
                        width: '100%', height: 130,
                        backgroundColor: userAvatarColor || '#4ECDC4',
                        justifyContent: 'center', alignItems: 'center',
                      }}>
                        <Ionicons name="shirt-outline" size={36} color="rgba(255,255,255,0.7)" />
                      </View>
                    )}
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: c.text }} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={{ fontSize: 12, color: c.subtext, marginTop: 2 }}>
                        Größe {item.size}  •  {item.condition}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
