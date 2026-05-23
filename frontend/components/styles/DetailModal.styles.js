import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  modalContent: {
    width: '100%',
    maxWidth: 500,
    height: '85%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },

  imageContainer: {
    width: '100%',
    height: '42%',
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  conditionBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  conditionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },

  scrollInfo: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a1a1a',
  },

  brandSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: '#f0f0f2',
    marginVertical: 18,
  },

  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 10,
  },

  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  ownerDetails: {
    justifyContent: 'center',
  },

  ownerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },

  locationText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 4,
  },

  descriptionText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },

  actionRow: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f2',
    backgroundColor: '#ffffff',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    justifyContent: 'space-between',
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 24,
    flex: 1,
  },

  dislikeBtn: {
    backgroundColor: '#ffeaea',
    marginRight: 12,
  },

  dislikeBtnText: {
    color: '#ff3b30',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 14,
  },

  likeBtn: {
    backgroundColor: '#f53b75',
    marginLeft: 12,
  },

  likeBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 14,
  },
});
