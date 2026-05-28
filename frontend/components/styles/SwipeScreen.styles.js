import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  light: {
    background: '#fff7f2',
    card: '#ffffff',
    text: '#111111',
    subtext: '#777777',
    accent: '#ff7a59',
    border: '#ededf1',
  },
  dark: {
    background: '#121212',
    card: '#1d1d1f',
    text: '#ffffff',
    subtext: '#aaaaaa',
    accent: '#ff8c69',
    border: '#2f2f32',
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },

  card: {
    width: width - 24,
    height: height * 0.61,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'absolute',
    borderWidth: 1,
    renderToHardwareTextureAndroid: true,
    shouldRasterizeIOS: true,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  likeBadge: {
    position: 'absolute',
    top: 115,
    left: 24,
    borderWidth: 5,
    borderColor: '#ffb089',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    transform: [{ rotate: '-14deg' }],
  },

  likeBadgeText: {
    color: '#ffb089',
    fontSize: 34,
    fontWeight: '900',
  },

  nopeBadge: {
    position: 'absolute',
    top: 115,
    right: 24,
    borderWidth: 5,
    borderColor: '#ff7a59',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    transform: [{ rotate: '14deg' }],
  },

  nopeBadgeText: {
    color: '#ff7a59',
    fontSize: 34,
    fontWeight: '900',
  },

  infoContainer: {
    position: 'absolute',
    bottom: 28,
    left: 24,
    right: 24,
  },

  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
  },

  details: {
    marginTop: 6,
    color: '#fff',
    fontSize: 15,
    opacity: 0.9,
  },

  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },

  ownerName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    paddingTop: 14,
  },

  smallButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
  },

  bigButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 18,
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 15,
  },

  reloadButton: {
    marginTop: 26,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 20,
  },

  reloadText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
