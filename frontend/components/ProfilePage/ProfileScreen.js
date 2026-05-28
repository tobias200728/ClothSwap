import React, { useState, useEffect } from 'react';

import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  COLORS,
  PLANS,
  styles,
} from '../styles/ProfileScreen.styles';

import SettingsModal from './SettingsModal';
import PlanCard from './PlanCard';

// ─── SuccessOverlay ───────────────────────────────────────────────────────────

function SuccessOverlay({ plan, visible, onClose, darkMode }) {
  const colors = darkMode ? COLORS.dark : COLORS.light;
  if (!plan) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.successOverlay}>
        <View style={[styles.successCard, { backgroundColor: colors.card }]}>
          <View style={[styles.successIconCircle, { backgroundColor: plan.color + '25' }]}>
            <Ionicons name="checkmark-circle" size={48} color={plan.color} />
          </View>
          <Text style={[styles.successTitle, { color: colors.text }]}>
            Willkommen im {plan.id}!
          </Text>
          <Text style={[styles.successSub, { color: colors.subtext }]}>
            Dein Abo ist jetzt aktiv. Genieße alle exklusiven Vorteile sofort.
          </Text>
          <Pressable
            style={[styles.successBtn, { backgroundColor: plan.color }]}
            onPress={onClose}
          >
            <Text style={styles.successBtnText}>Los geht's!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

// ─── Bottom-sheet wrapper ─────────────────────────────────────────────────────

function Sheet({ visible, onClose, title, children, theme, insets }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: theme.card,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            maxHeight: '92%',
            paddingBottom: insets.bottom > 0 ? insets.bottom : 20,
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
            <View style={{ width: 38, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: 22, paddingVertical: 12,
            borderBottomWidth: 1, borderBottomColor: theme.border,
          }}>
            <Text style={{ flex: 1, fontSize: 20, fontWeight: '800', color: theme.text }}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              style={{
                width: 34, height: 34, borderRadius: 17,
                backgroundColor: 'rgba(128,128,128,0.12)',
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 22, paddingBottom: 12 }}
          >
            {children}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileScreen({
  userItems,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  userProfile,
  onUpdateProfile,
  onLogout,
  darkMode,
  setDarkMode,
}) {
  const theme = darkMode ? COLORS.dark : COLORS.light;
  const insets = useSafeAreaInsets();

  // Add modal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSize, setNewSize] = useState('M');
  const [uploadedImage, setUploadedImage] = useState(null);

  // Edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editSize, setEditSize] = useState('M');
  const [editStatus, setEditStatus] = useState('Verfügbar');
  const [editImage, setEditImage] = useState(null);

  // Settings modal
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editLocation, setEditLocation] = useState(userProfile.location);
  const [profileImage, setProfileImage] = useState(userProfile.image || null);

  useEffect(() => {
    setProfileImage(userProfile.image || null);
  }, [userProfile.image]);

  // Plan & payment
  const [activePlan, setActivePlan] = useState(userProfile.plan || null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState(null);

  const pickImage = async (setter) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setter(result.assets[0].uri);
  };

  const handleCreateItem = () => {
    if (!newTitle.trim()) return;
    onAddItem({
      title: newTitle,
      description: newDescription,
      size: newSize,
      brand: '',
      condition: 'Gut',
      status: 'Verfügbar',
      image: uploadedImage || null,
    });
    setAddModalVisible(false);
    setNewTitle('');
    setNewDescription('');
    setUploadedImage(null);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setEditSize(item.size || 'M');
    setEditStatus(item.status || 'Verfügbar');
    setEditImage(item.image || null);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim()) return;
    onUpdateItem(editingItem.id, {
      title: editTitle,
      description: editDescription,
      size: editSize,
      status: editStatus,
      image: editImage,
    });
    setEditModalVisible(false);
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      'Artikel löschen',
      `"${editingItem?.title}" wirklich löschen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            onDeleteItem(editingItem.id);
            setEditModalVisible(false);
          },
        },
      ]
    );
  };

  const handleSaveSettings = () => {
    onUpdateProfile({ name: editName, location: editLocation, image: profileImage, plan: activePlan });
    setSettingsModalVisible(false);
  };

  const handlePaymentSuccess = (plan) => {
    setActivePlan(plan.id);
    setPurchasedPlan(plan);
    setTimeout(() => setSuccessVisible(true), 300);
  };

  const activePlanData = PLANS.find((p) => p.id === activePlan);

  const inputStyle = [styles.input, {
    backgroundColor: theme.input,
    color: theme.text,
    borderColor: theme.border,
  }];

  return (
    <SafeAreaView edges={[]} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={[styles.header, { backgroundColor: theme.accent, paddingTop: 12 }]}>
          <Pressable
            style={[styles.settingsBtn, { backgroundColor: 'rgba(255,255,255,0.22)', top: 12 }]}
            onPress={() => setSettingsModalVisible(true)}
          >
            <Ionicons name="settings-outline" size={22} color="#fff" />
          </Pressable>

          <Pressable style={styles.avatarWrapper} onPress={() => pickImage(setProfileImage)}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(userProfile.name || '?')[0]}</Text>
              </View>
            )}
            <View style={styles.avatarEditBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </Pressable>

          <Text style={styles.name}>{editName || userProfile.name}</Text>
          <Text style={styles.location}>{editLocation || userProfile.location}</Text>

          {activePlanData && (
            <View style={styles.activePlanBadge}>
              <Text style={styles.activePlanBadgeText}>⭐ {activePlanData.id} Mitglied</Text>
            </View>
          )}
        </View>

        {/* ── MY CLOTHES ── */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Meine Kleidung</Text>
          <Pressable
            style={[styles.addBtn, { backgroundColor: theme.accent }]}
            onPress={() => setAddModalVisible(true)}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Hinzufügen</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {userItems.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
              onPress={() => openEditModal(item)}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardEditOverlay}>
                <Ionicons name="pencil" size={16} color="#fff" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.cardSize, { color: theme.subtext }]}>Größe {item.size}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* ══ ADD ITEM SHEET ══ */}
      <Sheet
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        title="Kleidung hinzufügen"
        theme={theme}
        insets={insets}
      >
        <TextInput
          placeholder="Titel"
          placeholderTextColor={theme.subtext}
          value={newTitle}
          onChangeText={setNewTitle}
          style={inputStyle}
        />
        <TextInput
          placeholder="Beschreibung (optional)"
          placeholderTextColor={theme.subtext}
          value={newDescription}
          onChangeText={setNewDescription}
          multiline
          numberOfLines={3}
          style={[inputStyle, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
        />

        <Pressable
          style={[styles.uploadButton, { backgroundColor: theme.softAccent }]}
          onPress={() => pickImage(setUploadedImage)}
        >
          <Ionicons name="image-outline" size={22} color={theme.accent} />
          <Text style={{ color: theme.accent, marginLeft: 8, fontWeight: '700' }}>
            {uploadedImage ? 'Bild ändern' : 'Bild hochladen'}
          </Text>
        </Pressable>

        {uploadedImage && (
          <Image source={{ uri: uploadedImage }} style={[styles.previewImage, { height: 160 }]} />
        )}

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Größe</Text>
        <View style={styles.selectorRow}>
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <Pressable
              key={size}
              style={[styles.selectorBtn, newSize === size && { backgroundColor: theme.accent }]}
              onPress={() => setNewSize(size)}
            >
              <Text style={{ color: newSize === size ? '#fff' : theme.text }}>{size}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.submitBtn, { backgroundColor: theme.accent }]}
          onPress={handleCreateItem}
        >
          <Text style={styles.submitBtnText}>Hinzufügen</Text>
        </Pressable>
      </Sheet>

      {/* ══ EDIT ITEM SHEET ══ */}
      <Sheet
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        title="Artikel bearbeiten"
        theme={theme}
        insets={insets}
      >
        {/* Image row: thumbnail + change button side by side */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 14 }}>
          {editImage ? (
            <Image
              source={{ uri: editImage }}
              style={{ width: 80, height: 80, borderRadius: 16 }}
              resizeMode="cover"
            />
          ) : (
            <View style={{
              width: 80, height: 80, borderRadius: 16,
              backgroundColor: theme.input, borderWidth: 1, borderColor: theme.border,
              justifyContent: 'center', alignItems: 'center',
            }}>
              <Ionicons name="shirt-outline" size={32} color={theme.subtext} />
            </View>
          )}
          <Pressable
            style={[styles.uploadButton, { flex: 1, marginBottom: 0, backgroundColor: theme.softAccent }]}
            onPress={() => pickImage(setEditImage)}
          >
            <Ionicons name="image-outline" size={20} color={theme.accent} />
            <Text style={{ color: theme.accent, marginLeft: 8, fontWeight: '700' }}>Bild ändern</Text>
          </Pressable>
        </View>

        <TextInput
          placeholder="Titel"
          placeholderTextColor={theme.subtext}
          value={editTitle}
          onChangeText={setEditTitle}
          style={inputStyle}
        />
        <TextInput
          placeholder="Beschreibung (optional)"
          placeholderTextColor={theme.subtext}
          value={editDescription}
          onChangeText={setEditDescription}
          multiline
          numberOfLines={3}
          style={[inputStyle, { height: 76, textAlignVertical: 'top', paddingTop: 12 }]}
        />

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Größe</Text>
        <View style={styles.selectorRow}>
          {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
            <Pressable
              key={size}
              style={[styles.selectorBtn, editSize === size && { backgroundColor: theme.accent }]}
              onPress={() => setEditSize(size)}
            >
              <Text style={{ color: editSize === size ? '#fff' : theme.text }}>{size}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Status</Text>
        <View style={[styles.selectorRow, { marginBottom: 20 }]}>
          {['Verfügbar', 'Reserviert', 'Getauscht'].map((s) => (
            <Pressable
              key={s}
              style={[styles.selectorBtn, editStatus === s && { backgroundColor: theme.accent }]}
              onPress={() => setEditStatus(s)}
            >
              <Text style={{ color: editStatus === s ? '#fff' : theme.text, fontSize: 12 }}>{s}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[styles.submitBtn, { backgroundColor: theme.accent }]}
          onPress={handleSaveEdit}
        >
          <Text style={styles.submitBtnText}>Speichern</Text>
        </Pressable>

        <Pressable
          style={[styles.deleteBtn, { backgroundColor: theme.danger }]}
          onPress={handleConfirmDelete}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.deleteBtnText}>Artikel löschen</Text>
        </Pressable>
      </Sheet>

      {/* ══ SETTINGS MODAL ══ */}
      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        editName={editName}
        setEditName={setEditName}
        editLocation={editLocation}
        setEditLocation={setEditLocation}
        profileImage={profileImage}
        setProfileImage={setProfileImage}
        activePlan={activePlan}
        onPaymentSuccess={handlePaymentSuccess}
        onSave={handleSaveSettings}
        onLogout={onLogout}
      />

      {/* ══ SUCCESS OVERLAY ══ */}
      <SuccessOverlay
        plan={purchasedPlan}
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        darkMode={darkMode}
      />
    </SafeAreaView>
  );
}
