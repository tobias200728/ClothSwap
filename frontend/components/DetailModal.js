import React from 'react';
import { Text, View, Image, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles/DetailModal.styles';

export default function DetailModal({ item, visible, onClose, onLike, onDislike }) {
  if (!item) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
          </View>

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
              Dieses Kleidungsstück ist in einem super Zustand. Es wurde selten getragen und stammt
              aus einem tierfreien Nichtraucherhaushalt. Perfekt für einen Tausch!
            </Text>
          </ScrollView>

          <View style={styles.actionRow}>
            <Pressable
              style={[styles.actionBtn, styles.dislikeBtn]}
              onPress={() => { onDislike(item); onClose(); }}
            >
              <Ionicons name="close" size={24} color="#ff3b30" />
              <Text style={styles.dislikeBtnText}>Verwerfen</Text>
            </Pressable>
            <Pressable
              style={[styles.actionBtn, styles.likeBtn]}
              onPress={() => { onLike(item); onClose(); }}
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