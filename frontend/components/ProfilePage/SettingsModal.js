import React, { useState } from 'react';
import {
  Text,
  View,
  Image,
  Pressable,
  Modal,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { COLORS, PLANS, styles } from '../styles/ProfileScreen.styles';
import PlanCard from './PlanCard';
import PaymentScreen from './PaymentScreen';

// ─── SettingsModal ────────────────────────────────────────────────────────────
//
// Props:
//   visible          boolean
//   onClose          () => void
//   darkMode         boolean
//   setDarkMode      (v: boolean) => void
//   editName         string
//   setEditName      (v: string) => void
//   editLocation     string
//   setEditLocation  (v: string) => void
//   profileImage     string | null
//   setProfileImage  (uri: string) => void
//   activePlan       string | null
//   onPaymentSuccess (plan: object) => void   ← ersetzt onBuyPlan
//   onSave           () => void
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsModal({
  visible,
  onClose,
  darkMode,
  setDarkMode,
  editName,
  setEditName,
  editLocation,
  setEditLocation,
  profileImage,
  setProfileImage,
  activePlan,
  onPaymentSuccess,
  onSave,
}) {
  const theme = darkMode ? COLORS.dark : COLORS.light;

  // Welcher Plan ist gerade im Checkout?
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [paymentVisible, setPaymentVisible] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handlePlanPress = (plan) => {
    if (activePlan === plan.id) return;
    setCheckoutPlan(plan);
    setPaymentVisible(true);
  };

  const handlePaymentSuccess = (plan) => {
    setPaymentVisible(false);
    setCheckoutPlan(null);
    onPaymentSuccess(plan);
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <BlurView
          intensity={45}
          tint={darkMode ? 'dark' : 'light'}
          style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}
        >
          {/* Tap-outside-to-close */}
          <Pressable style={{ flex: 1 }} onPress={onClose} />

          {/* Bottom sheet */}
          <View
            style={[
              styles.settingsSheet,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
          >
            {/* Drag handle */}
            <View style={[styles.settingsDragHandle, { backgroundColor: theme.border }]} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.settingsInnerScroll}
            >
              {/* ── Header ── */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Einstellungen
                </Text>
                <Pressable onPress={onClose}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </Pressable>
              </View>

              {/* ── Profil bearbeiten ── */}
              <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Profil</Text>

              <View style={styles.profileEditRow}>
                <Pressable
                  style={[styles.profileEditAvatar, { backgroundColor: theme.softAccent }]}
                  onPress={pickImage}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileEditAvatarImg}
                    />
                  ) : (
                    <Text style={{ fontSize: 26, fontWeight: '800', color: theme.accent }}>
                      {(editName || '?')[0]}
                    </Text>
                  )}
                  <View style={styles.profileEditAvatarBadge}>
                    <Ionicons name="camera" size={10} color="#fff" />
                  </View>
                </Pressable>

                <View style={styles.profileEditName}>
                  <TextInput
                    placeholder="Name"
                    placeholderTextColor={theme.subtext}
                    value={editName}
                    onChangeText={setEditName}
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.input,
                        color: theme.text,
                        borderColor: theme.border,
                        marginBottom: 8,
                      },
                    ]}
                  />
                  <TextInput
                    placeholder="Standort"
                    placeholderTextColor={theme.subtext}
                    value={editLocation}
                    onChangeText={setEditLocation}
                    style={[
                      styles.input,
                      {
                        backgroundColor: theme.input,
                        color: theme.text,
                        borderColor: theme.border,
                        marginBottom: 0,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* ── Dark Mode ── */}
              <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Darstellung</Text>

              <View style={styles.darkModeRow}>
                <View>
                  <Text style={[styles.darkModeTitle, { color: theme.text }]}>Dark Mode</Text>
                  <Text style={[styles.darkModeSub, { color: theme.subtext }]}>Dunkles Design</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ true: theme.accent }}
                />
              </View>

              {/* ── Premium Abos ── */}
              <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Premium</Text>

              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isActive={activePlan === plan.id}
                  theme={darkMode ? 'dark' : 'light'}
                  onPress={() => handlePlanPress(plan)}
                />
              ))}

              {/* ── Speichern ── */}
              <Pressable
                style={[styles.submitBtn, { backgroundColor: theme.accent }]}
                onPress={onSave}
              >
                <Text style={styles.submitBtnText}>Speichern</Text>
              </Pressable>
            </ScrollView>
          </View>
        </BlurView>
      </Modal>

      {/* ── Payment Screen (öffnet sich über dem Settings-Modal) ── */}
      <PaymentScreen
        plan={checkoutPlan}
        visible={paymentVisible}
        onClose={() => {
          setPaymentVisible(false);
          setCheckoutPlan(null);
        }}
        onSuccess={handlePaymentSuccess}
        darkMode={darkMode}
      />
    </>
  );
}