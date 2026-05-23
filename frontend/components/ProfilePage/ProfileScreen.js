import React, { useState } from 'react';

import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfileScreen({
  userItems,
  onAddItem,
  userProfile,
  onUpdateProfile,
  darkMode,
  setDarkMode,
}) {
  const theme = darkMode ? COLORS.dark : COLORS.light;

  // Add modal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSize, setNewSize] = useState('M');
  const [uploadedImage, setUploadedImage] = useState(null);

  // Settings modal
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editName, setEditName] = useState(userProfile.name);
  const [editLocation, setEditLocation] = useState(userProfile.location);
  const [profileImage, setProfileImage] = useState(userProfile.image || null);

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
      id: `item_${Date.now()}`,
      title: newTitle,
      size: newSize,
      status: 'Verfügbar',
      image: uploadedImage || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    });
    setAddModalVisible(false);
    setNewTitle('');
    setUploadedImage(null);
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

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={[styles.header, { backgroundColor: theme.accent }]}>
          <Pressable
            style={[styles.settingsBtn, { backgroundColor: 'rgba(255,255,255,0.22)' }]}
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
            <View
              key={item.id}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.cardSize, { color: theme.subtext }]}>Größe {item.size}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ══ ADD ITEM MODAL ══ */}
      <Modal visible={addModalVisible} transparent animationType="fade">
        <BlurView intensity={45} tint={darkMode ? 'dark' : 'light'} style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Kleidung hinzufügen</Text>
              <Pressable onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </Pressable>
            </View>

            <TextInput
              placeholder="Titel"
              placeholderTextColor={theme.subtext}
              value={newTitle}
              onChangeText={setNewTitle}
              style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]}
            />

            <Pressable
              style={[styles.uploadButton, { backgroundColor: theme.softAccent }]}
              onPress={() => pickImage(setUploadedImage)}
            >
              <Ionicons name="image-outline" size={22} color={theme.accent} />
              <Text style={{ color: theme.accent, marginLeft: 8, fontWeight: '700' }}>
                Bild hochladen
              </Text>
            </Pressable>

            {uploadedImage && (
              <Image source={{ uri: uploadedImage }} style={styles.previewImage} />
            )}

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
          </View>
        </BlurView>
      </Modal>

      {/* ══ SETTINGS MODAL (ausgelagert) ══ */}
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