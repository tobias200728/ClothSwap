import React, { useState } from 'react';
import {
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, styles } from '../styles/ProfileScreen.styles';

// ─── Zahlungsmethoden ─────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    id: 'paypal',
    label: 'PayPal',
    icon: 'logo-paypal',
    color: '#003087',
    description: 'Schnell & sicher mit PayPal bezahlen',
  },
  {
    id: 'apple',
    label: 'Apple Pay',
    icon: 'logo-apple',
    color: '#000000',
    description: 'Mit Face ID oder Touch ID bezahlen',
  },
  {
    id: 'mastercard',
    label: 'Mastercard',
    icon: 'card',
    color: '#EB001B',
    description: 'Mastercard Kredit- oder Debitkarte',
  },
  {
    id: 'kreditkarte',
    label: 'Kreditkarte',
    icon: 'card-outline',
    color: '#6c63ff',
    description: 'Visa, Amex oder andere Kreditkarte',
  },
];

// ─── PaymentScreen ────────────────────────────────────────────────────────────
//
// Props:
//   plan        object | null   – das gewählte Abo-Objekt
//   visible     boolean
//   onClose     () => void
//   onSuccess   (plan) => void
//   darkMode    boolean
// ─────────────────────────────────────────────────────────────────────────────

export default function PaymentScreen({ plan, visible, onClose, onSuccess, darkMode }) {
  const theme = darkMode ? COLORS.dark : COLORS.light;

  const [step, setStep] = useState('method'); // 'method' | 'card'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!plan) return null;

  const needsCardForm = selectedMethod === 'mastercard' || selectedMethod === 'kreditkarte';

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
    if (needsCardForm) {
      return (
        cardNumber.replace(/\s/g, '').length === 16 &&
        cardExpiry.length === 5 &&
        cardCvc.length >= 3 &&
        cardName.trim().length > 0
      );
    }
    return true;
  };

  const handlePay = () => {
    if (!canPay()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetState();
      onSuccess(plan);
    }, 1800);
  };

  const resetState = () => {
    setStep('method');
    setSelectedMethod(null);
    setCardNumber('');
    setCardExpiry('');
    setCardCvc('');
    setCardName('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleMethodSelect = (id) => {
    setSelectedMethod(id);
    if (id === 'mastercard' || id === 'kreditkarte') {
      setStep('card');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <BlurView
          intensity={50}
          tint={darkMode ? 'dark' : 'light'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
          <Pressable style={{ flex: 1 }} onPress={handleClose} />

          <View
            style={{
              backgroundColor: theme.card,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              borderWidth: 1,
              borderColor: theme.border,
              maxHeight: '92%',
            }}
          >
            {/* Drag Handle */}
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.border,
                alignSelf: 'center',
                marginTop: 12,
              }}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
            >
              {/* ── Header ── */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                {step === 'card' && (
                  <Pressable
                    onPress={() => setStep('method')}
                    style={{ marginRight: 12 }}
                  >
                    <Ionicons name="arrow-back" size={22} color={theme.text} />
                  </Pressable>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text }}>
                    {step === 'method' ? `${plan.id} abonnieren` : 'Kartendaten eingeben'}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 3 }}>
                    {step === 'method'
                      ? 'Wähle deine Zahlungsmethode'
                      : `${plan.id} · ${plan.price}${plan.period}`}
                  </Text>
                </View>
                <Pressable onPress={handleClose}>
                  <Ionicons name="close" size={24} color={theme.text} />
                </Pressable>
              </View>

              {/* ── Plan-Banner ── */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: plan.color + '18',
                  borderRadius: 18,
                  padding: 14,
                  marginTop: 16,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: plan.color + '40',
                }}
              >
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    backgroundColor: plan.color + '30',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 14,
                  }}
                >
                  <Ionicons name={plan.icon} size={20} color={plan.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: plan.color }}>
                    {plan.id}
                  </Text>
                  <Text style={{ fontSize: 13, color: theme.subtext, marginTop: 2 }}>
                    {plan.perks[0]} · {plan.perks[1]}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: plan.color }}>
                    {plan.price}
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.subtext }}>{plan.period}</Text>
                </View>
              </View>

              {/* ══ STEP: Methode wählen ══ */}
              {step === 'method' && (
                <>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                      color: theme.subtext,
                      marginBottom: 12,
                    }}
                  >
                    Zahlungsmethode
                  </Text>

                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <Pressable
                        key={method.id}
                        onPress={() => handleMethodSelect(method.id)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 16,
                          borderRadius: 20,
                          borderWidth: 2,
                          marginBottom: 12,
                          backgroundColor: isSelected
                            ? method.color + '12'
                            : theme.input,
                          borderColor: isSelected ? method.color : theme.border,
                        }}
                      >
                        {/* Icon-Circle */}
                        <View
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: method.color + '18',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 14,
                          }}
                        >
                          <Ionicons name={method.icon} size={22} color={method.color} />
                        </View>

                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '700',
                              color: theme.text,
                            }}
                          >
                            {method.label}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: theme.subtext,
                              marginTop: 2,
                            }}
                          >
                            {method.description}
                          </Text>
                        </View>

                        <Ionicons
                          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                          size={22}
                          color={isSelected ? method.color : theme.border}
                        />
                      </Pressable>
                    );
                  })}

                  {/* Direkt bezahlen (PayPal / Apple Pay) */}
                  {selectedMethod && !needsCardForm && (
                    <>
                      <View
                        style={{
                          height: 1,
                          backgroundColor: theme.border,
                          marginVertical: 20,
                        }}
                      />
                      {/* Order Summary */}
                      <OrderSummary plan={plan} theme={theme} />

                      <Pressable
                        style={{
                          height: 56,
                          borderRadius: 22,
                          backgroundColor: canPay() ? theme.accent : theme.border,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 16,
                        }}
                        onPress={handlePay}
                        disabled={!canPay() || loading}
                      >
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
                          {loading ? 'Wird verarbeitet…' : `Jetzt kaufen · ${plan.price}`}
                        </Text>
                      </Pressable>

                      <SecureHint theme={theme} />
                    </>
                  )}
                </>
              )}

              {/* ══ STEP: Kartenformular ══ */}
              {step === 'card' && (
                <>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '700',
                      letterSpacing: 0.8,
                      textTransform: 'uppercase',
                      color: theme.subtext,
                      marginBottom: 12,
                    }}
                  >
                    Kartendaten
                  </Text>

                  <TextInput
                    placeholder="Karteninhaber"
                    placeholderTextColor={theme.subtext}
                    value={cardName}
                    onChangeText={setCardName}
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor: theme.input,
                        color: theme.text,
                        borderColor: theme.border,
                        marginBottom: 10,
                      },
                    ]}
                  />
                  <TextInput
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={theme.subtext}
                    value={cardNumber}
                    onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                    keyboardType="numeric"
                    maxLength={19}
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor: theme.input,
                        color: theme.text,
                        borderColor: theme.border,
                        marginBottom: 10,
                      },
                    ]}
                  />
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                    <TextInput
                      placeholder="MM/JJ"
                      placeholderTextColor={theme.subtext}
                      value={cardExpiry}
                      onChangeText={(t) => setCardExpiry(formatExpiry(t))}
                      keyboardType="numeric"
                      maxLength={5}
                      style={[
                        styles.cardInput,
                        {
                          flex: 1,
                          backgroundColor: theme.input,
                          color: theme.text,
                          borderColor: theme.border,
                        },
                      ]}
                    />
                    <TextInput
                      placeholder="CVC"
                      placeholderTextColor={theme.subtext}
                      value={cardCvc}
                      onChangeText={(t) => setCardCvc(t.replace(/\D/g, '').slice(0, 4))}
                      keyboardType="numeric"
                      maxLength={4}
                      style={[
                        styles.cardInput,
                        {
                          flex: 1,
                          backgroundColor: theme.input,
                          color: theme.text,
                          borderColor: theme.border,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={{
                      height: 1,
                      backgroundColor: theme.border,
                      marginVertical: 20,
                    }}
                  />

                  <OrderSummary plan={plan} theme={theme} />

                  <Pressable
                    style={{
                      height: 56,
                      borderRadius: 22,
                      backgroundColor: canPay() ? theme.accent : theme.border,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 16,
                    }}
                    onPress={handlePay}
                    disabled={!canPay() || loading}
                  >
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
                      {loading ? 'Wird verarbeitet…' : `Jetzt kaufen · ${plan.price}`}
                    </Text>
                  </Pressable>

                  <SecureHint theme={theme} />
                </>
              )}
            </ScrollView>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function OrderSummary({ plan, theme }) {
  const vatAmount = (parseFloat(plan.price.replace(',', '.')) * 0.19)
    .toFixed(2)
    .replace('.', ',');

  return (
    <View>
      <Text
        style={{
          fontSize: 13,
          fontWeight: '700',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          color: theme.subtext,
          marginBottom: 12,
        }}
      >
        Zusammenfassung
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 14, color: theme.subtext }}>{plan.id} Plan</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{plan.price}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 14, color: theme.subtext }}>MwSt. (19 %)</Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.text }}>{vatAmount} €</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>Gesamt</Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: theme.text }}>{plan.price}</Text>
      </View>
    </View>
  );
}

function SecureHint({ theme }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        marginTop: 14,
        opacity: 0.5,
      }}
    >
      <Ionicons name="lock-closed" size={12} color={theme.subtext} />
      <Text style={{ fontSize: 12, color: theme.subtext }}>
        256-bit SSL verschlüsselt · Sicher & geschützt
      </Text>
    </View>
  );
}