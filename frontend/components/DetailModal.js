import React from 'react';
import { Text, View, Image, Pressable, Modal, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  light: {
    bg: '#ffffff',
    text: '#1a1a1a',
    subtext: '#666666',
    sub2: '#8e8e93',
    border: '#f0f0f2',
    actionBg: '#ffffff',
    conditionBg: '#ffffff',
    conditionText: '#333',
    dislikeBg: '#ffeaea',
    dislikeText: '#ff3b30',
  },
  dark: {
    bg: '#1d1d1f',
    text: '#ffffff',
    subtext: '#aaaaaa',
    sub2: '#888888',
    border: '#2f2f32',
    actionBg: '#1d1d1f',
    conditionBg: 'rgba(30,30,32,0.9)',
    conditionText: '#fff',
    dislikeBg: '#3a1a1a',
    dislikeText: '#ff6b6b',
  },
};

export default function DetailModal({ item, visible, onClose, onLike, onDislike, darkMode = false }) {
  if (!item) return null;

  const c = darkMode ? COLORS.dark : COLORS.light;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}>
        <View style={{
          width: '100%',
          height: '85%',
          backgroundColor: c.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}>

          {/* ── Bild ── */}
          <View style={{ width: '100%', height: '42%', position: 'relative' }}>
            <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />

            <Pressable
              style={{
                position: 'absolute',
                top: Platform.OS === 'ios' ? 40 : 16,
                left: 16,
                width: 38, height: 38, borderRadius: 19,
                backgroundColor: 'rgba(255,255,255,0.9)',
                justifyContent: 'center', alignItems: 'center',
              }}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>

            <View style={{
              position: 'absolute', bottom: 16, right: 16,
              backgroundColor: c.conditionBg,
              paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12,
            }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: c.conditionText }}>{item.condition}</Text>
            </View>
          </View>

          {/* ── Infos ── */}
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

            <Text style={{ fontSize: 22, fontWeight: '800', color: c.text }}>{item.title}</Text>
            <Text style={{ fontSize: 14, color: c.subtext, marginTop: 6 }}>
              {item.brand}  •  Größe {item.size}
            </Text>

            <View style={{ height: 1, backgroundColor: c.border, marginVertical: 18 }} />

            {/* Besitzer */}
            <Text style={{ fontSize: 15, fontWeight: '700', color: c.text, marginBottom: 10 }}>Besitzer Info</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {item.ownerImage ? (
                <Image
                  source={{ uri: item.ownerImage }}
                  style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12 }}
                />
              ) : (
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: item.avatarColor || '#4ECDC4',
                  justifyContent: 'center', alignItems: 'center', marginRight: 12,
                }}>
                  <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
                    {(item.owner || '?')[0]}
                  </Text>
                </View>
              )}
              <View>
                <Text style={{ fontSize: 15, fontWeight: '600', color: c.text }}>{item.owner}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Ionicons name="location-outline" size={14} color={c.sub2} />
                  <Text style={{ fontSize: 12, color: c.sub2, marginLeft: 4 }}>
                    {item.location}{item.distance ? ` • ${item.distance}` : ''}
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: c.border, marginVertical: 18 }} />

            {/* Beschreibung */}
            <Text style={{ fontSize: 15, fontWeight: '700', color: c.text, marginBottom: 10 }}>Beschreibung</Text>
            <Text style={{ fontSize: 14, color: c.subtext, lineHeight: 22 }}>
              {item.description && item.description.trim()
                ? item.description
                : 'Keine Beschreibung vorhanden.'}
            </Text>

          </ScrollView>

          {/* ── Buttons ── */}
          <View style={{
            flexDirection: 'row',
            padding: 16,
            paddingBottom: Platform.OS === 'ios' ? 32 : 16,
            borderTopWidth: 1,
            borderTopColor: c.border,
            backgroundColor: c.actionBg,
          }}>
            <Pressable
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                paddingVertical: 14, borderRadius: 24, backgroundColor: c.dislikeBg, marginRight: 12,
              }}
              onPress={() => { onDislike(item); onClose(); }}
            >
              <Ionicons name="close" size={24} color={c.dislikeText} />
              <Text style={{ color: c.dislikeText, fontWeight: '700', marginLeft: 6, fontSize: 14 }}>Verwerfen</Text>
            </Pressable>

            <Pressable
              style={{
                flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                paddingVertical: 14, borderRadius: 24, backgroundColor: '#f53b75', marginLeft: 12,
              }}
              onPress={() => { onLike(item); onClose(); }}
            >
              <Ionicons name="heart" size={24} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '700', marginLeft: 6, fontSize: 14 }}>Favorisieren</Text>
            </Pressable>
          </View>

        </View>
      </View>
    </Modal>
  );
}
