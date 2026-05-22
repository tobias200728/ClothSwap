import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DetailModal({ item, visible, onClose, onLike, onDislike }) {
  if (!item) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Image Area */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
          </View>

          {/* Details Scroll Area */}
          <ScrollView contentContainerStyle={styles.scrollInfo} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.brandSize}>
              Brand: {item.brand}  •  Größe: {item.size}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Besitzer Info</Text>
            <View style={styles.ownerRow}>
              <View style={[styles.avatar, { backgroundColor: item.avatarColor }]}>
                <Text style={styles.avatarText}>{item.owner[0]}</Text>
              </View>
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>{item.owner}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#8e8e93" />
                  <Text style={styles.locationText}>
                    {item.location} • {item.distance || '2 km'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Beschreibung</Text>
            <Text style={styles.descriptionText}>
              Dieses Kleidungsstück ist in einem super Zustand. Es wurde selten getragen und stammt aus einem tierfreien Nichtraucherhaushalt. Perfekt für einen Tausch!
            </Text>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.dislikeBtn]}
              onPress={() => {
                onDislike(item);
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color="#ff3b30" />
              <Text style={styles.dislikeBtnText}>Verwerfen</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.likeBtn]}
              onPress={() => {
                onLike(item);
                onClose();
              }}
            >
              <Ionicons name="heart" size={24} color="#fff" />
              <Text style={styles.likeBtnText}>Favorisieren</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    height: '85%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
  imageContainer: {
    width: '100%',
    height: '42%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  conditionBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  scrollInfo: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  brandSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f2',
    marginVertical: 18,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  ownerDetails: {
    justifyContent: 'center',
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f2',
    backgroundColor: '#ffffff',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    flex: 1,
  },
  dislikeBtn: {
    backgroundColor: '#ffeaea',
    marginRight: 12,
  },
  dislikeBtnText: {
    color: '#ff3b30',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 14,
  },
  likeBtn: {
    backgroundColor: '#f53b75',
    marginLeft: 12,
  },
  likeBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 14,
  },
});
