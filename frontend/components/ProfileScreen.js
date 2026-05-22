import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen({
  userItems,
  onAddItem,
  onUpdateItemStatus,
  userProfile,
  onUpdateProfile,
}) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  // Form states for adding a new item
  const [newTitle, setNewTitle] = useState('');
  const [newSize, setNewSize] = useState('M');
  const [newStatus, setNewStatus] = useState('Verfügbar');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Profile edit states
  const [editName, setEditName] = useState(userProfile.name);
  const [editLocation, setEditLocation] = useState(userProfile.location);

  // Dynamic available count
  const availableCount = userItems.filter((i) => i.status === 'Verfügbar').length;

  const mockImageOptions = [
    { label: 'Sneaker rot', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { label: 'Hoodie gelb', url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=80' },
    { label: 'Jeans blau', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80' },
    { label: 'Hemden Kollektion', url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' },
    { label: 'Sommerkleid bunt', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleCreateItem = () => {
    if (!newTitle.trim()) return;
    const newItem = {
      id: `user_item_${Date.now()}`,
      title: newTitle.trim(),
      size: newSize,
      status: newStatus,
      image: mockImageOptions[selectedImageIndex].url,
    };
    onAddItem(newItem);
    setNewTitle('');
    setNewSize('M');
    setNewStatus('Verfügbar');
    setSelectedImageIndex(0);
    setAddModalVisible(false);
  };

  const handleSaveSettings = () => {
    if (!editName.trim()) return;
    onUpdateProfile({
      name: editName.trim(),
      location: editLocation.trim(),
    });
    setSettingsModalVisible(false);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Verfügbar':
        return styles.badgeVerfuegbar;
      case 'Reserviert':
        return styles.badgeReserviert;
      case 'Getauscht':
        return styles.badgeGetauscht;
      default:
        return styles.badgeVerfuegbar;
    }
  };

  const handleCycleStatus = (itemId, currentStatus) => {
    const nextStatusMap = {
      'Verfügbar': 'Reserviert',
      'Reserviert': 'Getauscht',
      'Getauscht': 'Verfügbar'
    };
    onUpdateItemStatus(itemId, nextStatusMap[currentStatus]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Pink Header Block */}
        <View style={styles.profileHeaderBlock}>
          {/* Settings button */}
          <Pressable
            style={styles.settingsButton}
            onPress={() => {
              setEditName(userProfile.name);
              setEditLocation(userProfile.location);
              setSettingsModalVisible(true);
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#ffffff" />
          </Pressable>

          {/* Avatar and Info */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{userProfile.name[0] || 'M'}</Text>
          </View>

          <Text style={styles.userName}>{userProfile.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#ffffff" style={styles.locIcon} />
            <Text style={styles.userLocation}>{userProfile.location}</Text>
          </View>

          {/* Stats Bar */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>★ 4.8</Text>
              <Text style={styles.statLabel}>Bewertung</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>23</Text>
              <Text style={styles.statLabel}>Getauscht</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{availableCount}</Text>
              <Text style={styles.statLabel}>Verfügbar</Text>
            </View>
          </View>
        </View>

        {/* Section title & Hinzufügen button */}
        <View style={styles.gridSectionHeader}>
          <Text style={styles.sectionTitle}>Meine Kleidungsstücke</Text>
          <Pressable style={styles.addButton} onPress={() => setAddModalVisible(true)}>
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.addButtonText}>Hinzufügen</Text>
          </Pressable>
        </View>

        {/* Clothes Grid */}
        <View style={styles.gridContainer}>
          {userItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.gridCard}
              onPress={() => handleCycleStatus(item.id, item.status)}
            >
              <Image source={{ uri: item.image }} style={styles.gridCardImage} />
              <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <View style={styles.gridCardInfo}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSize}>Größe {item.size}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* 1. Modal: ADD NEW CLOTHING ITEM */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kleidungsstück hinzufügen</Text>
              <Pressable onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>

            <ScrollView style={styles.modalForm} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Titel / Bezeichnung</Text>
              <TextInput
                style={styles.textInput}
                placeholder="z.B. Winterjacke, Sommerkleid..."
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.label}>Größe</Text>
              <View style={styles.selectorRow}>
                {['XS', 'S', 'M', 'L', 'XL', 'One Size'].map((sz) => (
                  <Pressable
                    key={sz}
                    style={[styles.selectorBtn, newSize === sz && styles.selectorBtnActive]}
                    onPress={() => setNewSize(sz)}
                  >
                    <Text style={[styles.selectorText, newSize === sz && styles.selectorTextActive]}>
                      {sz}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Status</Text>
              <View style={styles.selectorRow}>
                {['Verfügbar', 'Reserviert', 'Getauscht'].map((st) => (
                  <Pressable
                    key={st}
                    style={[styles.selectorBtn, newStatus === st && styles.selectorBtnActive]}
                    onPress={() => setNewStatus(st)}
                  >
                    <Text style={[styles.selectorText, newStatus === st && styles.selectorTextActive]}>
                      {st}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>Vorschaubild wählen</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imgRow}>
                {mockImageOptions.map((opt, idx) => (
                  <Pressable
                    key={idx}
                    style={[
                      styles.imgOptionContainer,
                      selectedImageIndex === idx && styles.imgOptionActive,
                    ]}
                    onPress={() => setSelectedImageIndex(idx)}
                  >
                    <Image source={{ uri: opt.url }} style={styles.imgOption} />
                    <Text style={styles.imgOptionLabel} numberOfLines={1}>{opt.label}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Pressable style={styles.submitBtn} onPress={handleCreateItem}>
                <Text style={styles.submitBtnText}>Hinzufügen</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 2. Modal: PROFILE SETTINGS */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.settingsModal]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profil bearbeiten</Text>
              <Pressable onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </Pressable>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={editName}
                onChangeText={setEditName}
              />

              <Text style={styles.label}>Ort / Bundesland</Text>
              <TextInput
                style={styles.textInput}
                placeholder="z.B. Berlin, Deutschland"
                value={editLocation}
                onChangeText={setEditLocation}
              />

              <Pressable style={styles.submitBtn} onPress={handleSaveSettings}>
                <Text style={styles.submitBtnText}>Speichern</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeaderBlock: {
    backgroundColor: '#f53b75', // Hot Pink
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
    shadowColor: '#f53b75',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 16,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  avatarLetter: {
    color: '#f53b75',
    fontSize: 44,
    fontWeight: '800',
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    opacity: 0.95,
  },
  locIcon: {
    marginRight: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    fontWeight: '500',
  },
  gridSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#f53b75',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    shadowColor: '#f53b75',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 36) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.02)',
  },
  gridCardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  badgeVerfuegbar: {
    backgroundColor: '#4cd964', // Green
  },
  badgeReserviert: {
    backgroundColor: '#ff9500', // Orange
  },
  badgeGetauscht: {
    backgroundColor: '#8e8e93', // Grey
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  gridCardInfo: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
  },
  cardSize: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  // Modal layout
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  settingsModal: {
    maxHeight: 320,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f2',
    paddingBottom: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  modalForm: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    marginTop: 12,
  },
  textInput: {
    height: 44,
    borderColor: '#e5e5ea',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#222',
    backgroundColor: '#fbfbfb',
    outlineStyle: 'none',
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  selectorBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f7',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectorBtnActive: {
    backgroundColor: '#f53b75',
  },
  selectorText: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  selectorTextActive: {
    color: '#ffffff',
  },
  imgRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  imgOptionContainer: {
    width: 70,
    alignItems: 'center',
    marginRight: 10,
    opacity: 0.6,
  },
  imgOptionActive: {
    opacity: 1,
  },
  imgOption: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imgOptionLabel: {
    fontSize: 9,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  submitBtn: {
    backgroundColor: '#f53b75',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#f53b75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
