import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  light: {
    background: '#fff7f2',
    card: '#ffffff',
    text: '#1a1a1a',
    subtext: '#777',
    accent: '#ff7a59',
    softAccent: '#fff1ea',
    border: '#f2d9cf',
    input: '#fffaf7',
    danger: '#ff3b30',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1f',
    text: '#ffffff',
    subtext: '#aaaaaa',
    accent: '#ff8c69',
    softAccent: '#2c201c',
    border: '#2f2f32',
    input: '#2a2a2d',
    danger: '#ff453a',
  },
};

export const PLANS = [
  {
    id: 'GOLD',
    color: '#f7b731',
    bg: '#fffbea',
    darkBg: '#2a2410',
    price: '4,99 €',
    period: '/ Monat',
    perks: ['Unbegrenzte Likes', 'Profilboost 1x/Woche', 'Keine Werbung'],
    icon: 'star',
  },
  {
    id: 'DIAMANT',
    color: '#45aaf2',
    bg: '#eaf6ff',
    darkBg: '#0d1f2d',
    price: '9,99 €',
    period: '/ Monat',
    perks: ['Alles aus Gold', 'Sehen wer dich geliked hat', 'Priority Support'],
    icon: 'diamond',
  },
  {
    id: 'PLATIN',
    color: '#a5b1c2',
    bg: '#f4f5f7',
    darkBg: '#1e2025',
    price: '14,99 €',
    period: '/ Monat',
    perks: ['Alles aus Diamant', 'Exklusive Matches', 'Persönlicher Berater'],
    icon: 'shield-checkmark',
  },
];

export const PAYMENT_METHODS = [
  { id: 'card',   label: 'Kreditkarte',  icon: 'card-outline' },
  { id: 'paypal', label: 'PayPal',        icon: 'logo-paypal' },
  { id: 'apple',  label: 'Apple Pay',     icon: 'logo-apple' },
  { id: 'google', label: 'Google Pay',    icon: 'logo-google' },
];

export const styles = StyleSheet.create({
  // ─── Layout ────────────────────────────────────────────────────────────────
  container: { flex: 1 },

  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 18 : 28,
    paddingBottom: 34,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },

  settingsBtn: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 20 : 24,
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ─── Avatar ────────────────────────────────────────────────────────────────
  avatarWrapper: {
    marginTop: 20,
    position: 'relative',
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },

  avatarText: {
    color: '#ff7a59',
    fontSize: 42,
    fontWeight: '800',
  },

  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ff7a59',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  name: { fontSize: 28, fontWeight: '800', marginTop: 14, color: '#fff' },
  location: { marginTop: 6, fontSize: 15, color: '#fff' },

  activePlanBadge: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  activePlanBadgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },

  // ─── Section / Grid ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 26,
  },

  sectionTitle: { fontSize: 22, fontWeight: '800' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  addBtnText: { color: '#fff', marginLeft: 6, fontWeight: '700' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 18,
  },

  card: {
    width: (width - 48) / 2,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
  },
  cardImage: { width: '100%', height: 180 },
  cardInfo: { padding: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSize: { marginTop: 4 },

  // ─── Modal shared ──────────────────────────────────────────────────────────
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  modalContent: {
    width: width * 0.88,
    maxHeight: '92%',
    alignSelf: 'center',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 24, fontWeight: '800' },

  input: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 10,
  },

  uploadButton: {
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 18,
  },

  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    marginBottom: 18,
  },

  selectorRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },

  selectorBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,122,89,0.12)',
    marginRight: 10,
    marginBottom: 10,
  },

  submitBtn: {
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },

  // ─── Settings modal ────────────────────────────────────────────────────────
  settingsScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
    width: '100%',
  },

  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 24,
    opacity: 0.5,
  },

  profileEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 14,
  },

  profileEditAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  profileEditAvatarImg: { width: 64, height: 64, borderRadius: 32 },

  profileEditAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ff7a59',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  profileEditName: { flex: 1 },

  darkModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255,122,89,0.08)',
  },
  darkModeTitle: { fontSize: 16, fontWeight: '700' },
  darkModeSub: { fontSize: 13, marginTop: 4 },

  // ─── Plan cards ────────────────────────────────────────────────────────────
  planCard: {
    borderRadius: 22,
    borderWidth: 2,
    padding: 18,
    marginBottom: 12,
    position: 'relative',
  },

  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  planCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  planIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  planName: { fontSize: 17, fontWeight: '800' },

  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 3 },
  planPrice: { fontSize: 18, fontWeight: '800' },
  planPeriod: { fontSize: 13, opacity: 0.6 },

  planPerks: { marginTop: 12, gap: 5 },
  planPerkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  planPerkText: { fontSize: 13 },

  currentBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  currentBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // ─── Payment modal ─────────────────────────────────────────────────────────
  paymentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  paymentSheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 28,
    paddingBottom: Platform.OS === 'ios' ? 48 : 28,
  },

  paymentHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 20,
  },

  paymentTitle: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  paymentSubtitle: { fontSize: 14, marginBottom: 24, opacity: 0.6 },

  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    marginBottom: 12,
    gap: 14,
  },
  paymentMethodLabel: { fontSize: 16, fontWeight: '600', flex: 1 },

  // card form
  cardForm: { marginTop: 8, gap: 10 },
  cardRow: { flexDirection: 'row', gap: 10 },
  cardInput: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
  },

  paymentDivider: { height: 1, marginVertical: 20 },

  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  orderSummaryLabel: { fontSize: 14 },
  orderSummaryValue: { fontSize: 14, fontWeight: '700' },
  orderSummaryTotal: { fontSize: 16, fontWeight: '800' },

  buyBtn: {
    height: 58,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buyBtnText: { color: '#fff', fontWeight: '800', fontSize: 17 },

  secureRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 14,
    opacity: 0.5,
  },
  secureText: { fontSize: 12 },

  // ─── Settings sheet (bottom sheet variant) ────────────────────────────────
  settingsSheet: {
    width: '100%',
    maxHeight: '92%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    overflow: 'hidden',
  },

  settingsDragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  settingsInnerScroll: {
    padding: 24,
    paddingBottom: 40,
  },

  // ─── Success overlay ───────────────────────────────────────────────────────
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  successCard: {
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
  },

  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  successTitle: { fontSize: 26, fontWeight: '900', marginBottom: 8 },
  successSub: { fontSize: 15, textAlign: 'center', opacity: 0.65, lineHeight: 22 },

  successBtn: {
    marginTop: 28,
    height: 54,
    borderRadius: 20,
    paddingHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});