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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { COLORS, PLANS, styles } from '../styles/ProfileScreen.styles';
import PlanCard from './PlanCard';

const PAYMENT_METHODS = [
  { id: 'paypal',      label: 'PayPal',       icon: 'logo-paypal',   color: '#003087', description: 'Schnell & sicher mit PayPal bezahlen' },
  { id: 'apple',       label: 'Apple Pay',    icon: 'logo-apple',    color: '#000000', description: 'Mit Face ID oder Touch ID bezahlen' },
  { id: 'mastercard',  label: 'Mastercard',   icon: 'card',          color: '#EB001B', description: 'Mastercard Kredit- oder Debitkarte' },
  { id: 'kreditkarte', label: 'Kreditkarte',  icon: 'card-outline',  color: '#6c63ff', description: 'Visa, Amex oder andere Kreditkarte' },
];

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
  onLogout,
}) {
  const theme = darkMode ? COLORS.dark : COLORS.light;

  // 'settings' | 'payment' | 'card'
  const [screen, setScreen] = useState('settings');
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handlePlanPress = (plan) => {
    setCheckoutPlan(plan);
    setSelectedMethod(null);
    setScreen('payment');
  };

  const handleMethodSelect = (id) => {
    setSelectedMethod(id);
    if (id === 'mastercard' || id === 'kreditkarte') setScreen('card');
  };

  const formatCardNumber = (t) => t.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (t) => {
    const c = t.replace(/\D/g, '').slice(0, 4);
    return c.length >= 3 ? c.slice(0, 2) + '/' + c.slice(2) : c;
  };

  const needsCardForm = selectedMethod === 'mastercard' || selectedMethod === 'kreditkarte';
  const canPay = () => {
    if (!selectedMethod) return false;
    if (needsCardForm) return cardNumber.replace(/\s/g, '').length === 16 && cardExpiry.length === 5 && cardCvc.length >= 3 && cardName.trim().length > 0;
    return true;
  };

  const handlePay = () => {
    if (!canPay()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('settings');
      setCheckoutPlan(null);
      setSelectedMethod(null);
      setCardNumber(''); setCardExpiry(''); setCardCvc(''); setCardName('');
      onPaymentSuccess(checkoutPlan);
    }, 1800);
  };

  const handleClose = () => {
    setScreen('settings');
    setCheckoutPlan(null);
    setSelectedMethod(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <BlurView
          intensity={45}
          tint={darkMode ? 'dark' : 'light'}
          style={[styles.modalOverlay, { justifyContent: 'flex-end' }]}
        >
          <Pressable style={{ flex: 1 }} onPress={handleClose} />

          <View style={[styles.settingsSheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
            {/* Drag handle */}
            <View style={[styles.settingsDragHandle, { backgroundColor: theme.border }]} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.settingsInnerScroll}
            >

              {/* ══════════════════════════════════════
                  SCREEN: SETTINGS
              ══════════════════════════════════════ */}
              {screen === 'settings' && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>Einstellungen</Text>
                    <Pressable onPress={handleClose}>
                      <Ionicons name="close" size={24} color={theme.text} />
                    </Pressable>
                  </View>

                  {/* Profil */}
                  <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Profil</Text>
                  <View style={styles.profileEditRow}>
                    <Pressable style={[styles.profileEditAvatar, { backgroundColor: theme.softAccent }]} onPress={pickImage}>
                      {profileImage
                        ? <Image source={{ uri: profileImage }} style={styles.profileEditAvatarImg} />
                        : <Text style={{ fontSize: 26, fontWeight: '800', color: theme.accent }}>{(editName || '?')[0]}</Text>}
                      <View style={styles.profileEditAvatarBadge}>
                        <Ionicons name="camera" size={10} color="#fff" />
                      </View>
                    </Pressable>
                    <View style={styles.profileEditName}>
                      <TextInput
                        placeholder="Name" placeholderTextColor={theme.subtext}
                        value={editName} onChangeText={setEditName}
                        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border, marginBottom: 8 }]}
                      />
                      <TextInput
                        placeholder="Standort" placeholderTextColor={theme.subtext}
                        value={editLocation} onChangeText={setEditLocation}
                        style={[styles.input, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border, marginBottom: 0 }]}
                      />
                    </View>
                  </View>

                  {/* Dark Mode */}
                  <Text style={[styles.sectionLabel, { color: theme.subtext }]}>Darstellung</Text>
                  <View style={styles.darkModeRow}>
                    <View>
                      <Text style={[styles.darkModeTitle, { color: theme.text }]}>Dark Mode</Text>
                      <Text style={[styles.darkModeSub, { color: theme.subtext }]}>Dunkles Design</Text>
                    </View>
                    <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ true: theme.accent }} />
                  </View>

                  {/* Premium */}
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

                  <Pressable style={[styles.submitBtn, { backgroundColor: theme.accent }]} onPress={onSave}>
                    <Text style={styles.submitBtnText}>Speichern</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.submitBtn, { backgroundColor: '#e53935', marginTop: 10 }]}
                    onPress={() => { handleClose(); onLogout?.(); }}
                  >
                    <Text style={styles.submitBtnText}>Abmelden</Text>
                  </Pressable>
                </>
              )}

              {/* ══════════════════════════════════════
                  SCREEN: ZAHLUNGSMETHODE WÄHLEN
              ══════════════════════════════════════ */}
              {(screen === 'payment' || screen === 'card') && checkoutPlan && (
                <>
                  {/* Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                    <Pressable onPress={() => screen === 'card' ? setScreen('payment') : setScreen('settings')} style={{ marginRight: 12 }}>
                      <Ionicons name="arrow-back" size={22} color={theme.text} />
                    </Pressable>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text }}>
                        {screen === 'payment' ? `${checkoutPlan.id} abonnieren` : 'Kartendaten eingeben'}
                      </Text>
                      <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 3 }}>
                        {screen === 'payment' ? 'Wähle deine Zahlungsmethode' : `${checkoutPlan.id} · ${checkoutPlan.price} ${checkoutPlan.period}`}
                      </Text>
                    </View>
                    <Pressable onPress={handleClose}>
                      <Ionicons name="close" size={24} color={theme.text} />
                    </Pressable>
                  </View>

                  {/* Plan-Banner */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: checkoutPlan.color + '18', borderRadius: 18, padding: 14, marginTop: 16, marginBottom: 20, borderWidth: 1, borderColor: checkoutPlan.color + '40' }}>
                    <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: checkoutPlan.color + '30', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                      <Ionicons name={checkoutPlan.icon} size={20} color={checkoutPlan.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '800', color: checkoutPlan.color }}>{checkoutPlan.id}</Text>
                      <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 2 }}>{checkoutPlan.perks[0]} · {checkoutPlan.perks[1]}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 18, fontWeight: '800', color: checkoutPlan.color }}>{checkoutPlan.price}</Text>
                      <Text style={{ fontSize: 12, color: theme.subtext }}>{checkoutPlan.period}</Text>
                    </View>
                  </View>

                  {/* Methode wählen */}
                  {screen === 'payment' && (
                    <>
                      <Text style={{ fontSize: 13, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: theme.subtext, marginBottom: 12 }}>
                        Zahlungsmethode
                      </Text>
                      {PAYMENT_METHODS.map((method) => {
                        const isSelected = selectedMethod === method.id;
                        return (
                          <Pressable
                            key={method.id}
                            onPress={() => handleMethodSelect(method.id)}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, borderWidth: 2, marginBottom: 12, backgroundColor: isSelected ? method.color + '12' : theme.input, borderColor: isSelected ? method.color : theme.border }}
                          >
                            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: method.color + '18', justifyContent: 'center', alignItems: 'center', marginRight: 14 }}>
                              <Ionicons name={method.icon} size={22} color={method.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text }}>{method.label}</Text>
                              <Text style={{ fontSize: 12, color: theme.subtext, marginTop: 2 }}>{method.description}</Text>
                            </View>
                            <Ionicons name={isSelected ? 'radio-button-on' : 'radio-button-off'} size={22} color={isSelected ? method.color : theme.border} />
                          </Pressable>
                        );
                      })}

                      {/* PayPal / Apple Pay direkt bezahlen */}
                      {selectedMethod && !needsCardForm && (
                        <>
                          <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 20 }} />
                          <OrderSummary plan={checkoutPlan} theme={theme} />
                          <Pressable style={{ height: 56, borderRadius: 22, backgroundColor: canPay() ? theme.accent : theme.border, justifyContent: 'center', alignItems: 'center', marginTop: 16 }} onPress={handlePay} disabled={!canPay() || loading}>
                            <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{loading ? 'Wird verarbeitet…' : `Jetzt kaufen · ${checkoutPlan.price}`}</Text>
                          </Pressable>
                          <SecureHint theme={theme} />
                        </>
                      )}
                    </>
                  )}

                  {/* Kartenformular */}
                  {screen === 'card' && (
                    <>
                      <Text style={{ fontSize: 13, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: theme.subtext, marginBottom: 12 }}>Kartendaten</Text>
                      <TextInput placeholder="Karteninhaber" placeholderTextColor={theme.subtext} value={cardName} onChangeText={setCardName}
                        style={[styles.cardInput, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border, marginBottom: 10 }]} />
                      <TextInput placeholder="1234 5678 9012 3456" placeholderTextColor={theme.subtext} value={cardNumber} onChangeText={(t) => setCardNumber(formatCardNumber(t))} keyboardType="numeric" maxLength={19}
                        style={[styles.cardInput, { backgroundColor: theme.input, color: theme.text, borderColor: theme.border, marginBottom: 10 }]} />
                      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                        <TextInput placeholder="MM/JJ" placeholderTextColor={theme.subtext} value={cardExpiry} onChangeText={(t) => setCardExpiry(formatExpiry(t))} keyboardType="numeric" maxLength={5}
                          style={[styles.cardInput, { flex: 1, backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} />
                        <TextInput placeholder="CVC" placeholderTextColor={theme.subtext} value={cardCvc} onChangeText={(t) => setCardCvc(t.replace(/\D/g, '').slice(0, 4))} keyboardType="numeric" maxLength={4}
                          style={[styles.cardInput, { flex: 1, backgroundColor: theme.input, color: theme.text, borderColor: theme.border }]} />
                      </View>
                      <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 20 }} />
                      <OrderSummary plan={checkoutPlan} theme={theme} />
                      <Pressable style={{ height: 56, borderRadius: 22, backgroundColor: canPay() ? theme.accent : theme.border, justifyContent: 'center', alignItems: 'center', marginTop: 16 }} onPress={handlePay} disabled={!canPay() || loading}>
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>{loading ? 'Wird verarbeitet…' : `Jetzt kaufen · ${checkoutPlan.price}`}</Text>
                      </Pressable>
                      <SecureHint theme={theme} />
                    </>
                  )}
                </>
              )}

            </ScrollView>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function OrderSummary({ plan, theme }) {
  const vatAmount = (parseFloat(plan.price.replace(',', '.')) * 0.19).toFixed(2).replace('.', ',');
  return (
    <View>
      <Text style={{ fontSize: 13, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: theme.subtext, marginBottom: 12 }}>Zusammenfassung</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 14, color: theme.subtext }}>{plan.id} Plan</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{plan.price}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 14, color: theme.subtext }}>MwSt. (19 %)</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{vatAmount} €</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: theme.border }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>Gesamt</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>{plan.price}</Text>
      </View>
    </View>
  );
}

function SecureHint({ theme }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 14, opacity: 0.5 }}>
      <Ionicons name="lock-closed" size={12} color={theme.subtext} />
      <Text style={{ fontSize: 12, color: theme.subtext }}>256-bit SSL verschlüsselt · Sicher & geschützt</Text>
    </View>
  );
}