import React, { useState } from 'react';

import {
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  Modal,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

import {
  COLORS,
  PLANS,
  PAYMENT_METHODS,
  styles,
} from './styles/ProfileScreen.styles';

// ─── Small helper components ────────────────────────────────────────────────

function PlanCard({ plan, isActive, onPress, theme }) {
  const bg = theme === 'dark' ? plan.darkBg : plan.bg;
  return (
    <Pressable
      style={[
        styles.planCard,
        { backgroundColor: bg, borderColor: isActive ? plan.color : 'transparent' },
      ]}
      onPress={onPress}
    >
      {isActive && (
        <View style={[styles.currentBadge, { backgroundColor: plan.color }]}>
          <Text style={styles.currentBadgeText}>Aktiv</Text>
        </View>
      )}

      <View style={styles.planCardHeader}>
        <View style={styles.planCardLeft}>
          <View style={[styles.planIconCircle, { backgroundColor: plan.color + '30' }]}>
            <Ionicons name={plan.icon} size={18} color={plan.color} />
          </View>
          <Text style={[styles.planName, { color: plan.color }]}>{plan.id}</Text>
        </View>

        <View style={styles.planPriceRow}>
          <Text style={[styles.planPrice, { color: plan.color }]}>{plan.price}</Text>
          <Text style={[styles.planPeriod, { color: plan.color }]}>{plan.period}</Text>
        </View>
      </View>

      <View style={styles.planPerks}>
        {plan.perks.map((perk) => (
          <View key={perk} style={styles.planPerkRow}>
            <Ionicons name="checkmark-circle" size={15} color={plan.color} />
            <Text style={[styles.planPerkText, { color: plan.color }]}>{perk}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

// ─── Payment Sheet ──────────────────────────────────────────────────────────

function PaymentSheet({ plan, visible, onClose, onSuccess, darkMode }) {
  const colors = darkMode ? COLORS.dark : COLORS.light;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    return cleaned;
  };

  const canPay = () => {
    if (!selectedMethod) return false;
    if (selectedMethod === 'card') {
      return cardNumber.replace(/\s/g, '').length === 16 &&
        cardExpiry.length === 5 &&
        cardCvc.length >= 3 &&
        cardName.trim().length > 0;
    }
    return true;
  };

  const handlePay = () => {
    if (!canPay()) return;
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      onSuccess(plan);
    }, 1800);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.paymentModalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View style={[styles.paymentSheet, { backgroundColor: colors.card }]}>
          <View style={styles.paymentHandle} />

          <Text style={[styles.paymentTitle, { color: colors.text }]}>
            {plan.id} abonnieren
          </Text>
          <Text style={[styles.paymentSubtitle, { color: colors.subtext }]}>
            Zahlungsmethode auswählen
          </Text>

          {/* Payment method buttons */}
          {PAYMENT_METHODS.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <Pressable
                key={method.id}
                style={[
                  styles.paymentMethodRow,
                  {
                    backgroundColor: isSelected ? colors.accent + '15' : colors.input,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setSelectedMethod(method.id)}
              >
                <Ionicons
                  name={method.icon}
                  size={24}
                  color={isSelected ? colors.accent : colors.subtext}
                />
                <Text style={[styles.paymentMethodLabel, { color: colors.text }]}>
                  {method.label}
                </Text>
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected ? colors.accent : colors.subtext}
                />
              </Pressable>
            );
          })}

          {/* Card form — only shown when 'card' is selected */}
          {selectedMethod === 'card' && (
            <View style={styles.cardForm}>
              <TextInput
                placeholder="Karteninhaber"
                placeholderTextColor={colors.subtext}
                value={cardName}
                onChangeText={setCardName}
                style={[styles.cardInput, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border, flex: 1 }]}
              />
              <TextInput
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={colors.subtext}
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                keyboardType="numeric"
                maxLength={19}
                style={[styles.cardInput, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border, flex: 1 }]}
              />
              <View style={styles.cardRow}>
                <TextInput
                  placeholder="MM/JJ"
                  placeholderTextColor={colors.subtext}
                  value={cardExpiry}
                  onChangeText={(t) => setCardExpiry(formatExpiry(t))}
                  keyboardType="numeric"
                  maxLength={5}
                  style={[styles.cardInput, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border, flex: 1 }]}
                />
                <TextInput
                  placeholder="CVC"
                  placeholderTextColor={colors.subtext}
                  value={cardCvc}
                  onChangeText={(t) => setCardCvc(t.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="numeric"
                  maxLength={4}
                  style={[styles.cardInput, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border, flex: 1 }]}
                />
              </View>
            </View>
          )}

          {/* Order summary */}
          <View style={[styles.paymentDivider, { backgroundColor: colors.border }]} />

          <View style={styles.orderSummaryRow}>
            <Text style={[styles.orderSummaryLabel, { color: colors.subtext }]}>{plan.id} Plan</Text>
            <Text style={[styles.orderSummaryValue, { color: colors.text }]}>{plan.price}</Text>
          </View>
          <View style={styles.orderSummaryRow}>
            <Text style={[styles.orderSummaryLabel, { color: colors.subtext }]}>MwSt. (19 %)</Text>
            <Text style={[styles.orderSummaryValue, { color: colors.text }]}>
              {(parseFloat(plan.price.replace(',', '.')) * 0.19).toFixed(2).replace('.', ',')} €
            </Text>
          </View>
          <View style={[styles.orderSummaryRow, { marginTop: 6 }]}>
            <Text style={[styles.orderSummaryLabel, styles.orderSummaryTotal, { color: colors.text }]}>
              Gesamt
            </Text>
            <Text style={[styles.orderSummaryValue, styles.orderSummaryTotal, { color: colors.text }]}>
              {plan.price}
            </Text>
          </View>

          <Pressable
            style={[
              styles.buyBtn,
              { backgroundColor: canPay() ? colors.accent : colors.border },
            ]}
            onPress={handlePay}
            disabled={!canPay() || loading}
          >
            <Text style={styles.buyBtnText}>
              {loading ? 'Wird verarbeitet…' : `Jetzt kaufen · ${plan.price}`}
            </Text>
          </Pressable>

          <View style={styles.secureRow}>
            <Ionicons name="lock-closed" size={12} color={colors.subtext} />
            <Text style={[styles.secureText, { color: colors.subtext }]}>
              256-bit SSL verschlüsselt · Sicher & geschützt
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Success Overlay ─────────────────────────────────────────────────────────

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
          <Text style={[styles.successTitle, { color: colors.text }]}>Willkommen im {plan.id}!</Text>
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

// ─── Main Component ──────────────────────────────────────────────────────────

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
  const [paymentPlan, setPaymentPlan] = useState(null);   // plan currently in checkout
  const [paymentVisible, setPaymentVisible] = useState(false);
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

  const handleBuyPlan = (plan) => {
    setPaymentPlan(plan);
    setPaymentVisible(true);
  };

  const handlePaymentSuccess = (plan) => {
    setPaymentVisible(false);
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

      {/* ══ SETTINGS MODAL ══ */}
      <Modal visible={settingsModalVisible} transparent animationType="fade">
        <BlurView intensity={45} tint={darkMode ? 'dark' : 'light'} style={styles.modalOverlay}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.settingsScrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>

              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Einstellungen</Text>
                <Pressable onPress={() => setSettingsModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </Pressable>
              </View>

              {/* ── Profil bearbeiten ── */}
              <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Profil</Text>

              <View style={styles.profileEditRow}>
                <Pressable
                  style={[styles.profileEditAvatar, { backgroundColor: theme.softAccent }]}
                  onPress={() => pickImage(setProfileImage)}
                >
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileEditAvatarImg} />
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
                    style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border, marginBottom: 8 }]}
                  />
                  <TextInput
                    placeholder="Standort"
                    placeholderTextColor={theme.subtext}
                    value={editLocation}
                    onChangeText={setEditLocation}
                    style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border, marginBottom: 0 }]}
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
                  onValueChange={(v) => setDarkMode(v)}
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
                  onPress={() => {
                    if (activePlan === plan.id) return;
                    handleBuyPlan(plan);
                  }}
                />
              ))}

              {/* Save button */}
              <Pressable
                style={[styles.submitBtn, { backgroundColor: theme.accent }]}
                onPress={handleSaveSettings}
              >
                <Text style={styles.submitBtnText}>Speichern</Text>
              </Pressable>
            </View>
          </ScrollView>
        </BlurView>
      </Modal>

      {/* ══ PAYMENT SHEET ══ */}
      <PaymentSheet
        plan={paymentPlan}
        visible={paymentVisible}
        onClose={() => setPaymentVisible(false)}
        onSuccess={handlePaymentSuccess}
        darkMode={darkMode}
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