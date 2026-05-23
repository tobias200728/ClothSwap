import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  light: {
    bg: '#fff7f2',
    card: '#ffffff',
    text: '#1a1a1a',
    sub: '#777777',
    accent: '#ff7a59',
    border: '#f2d9cf',
    input: '#fffaf7',
  },
  dark: {
    bg: '#121212',
    card: '#1e1e1f',
    text: '#ffffff',
    sub: '#aaaaaa',
    accent: '#ff8c69',
    border: '#2f2f32',
    input: '#2a2a2d',
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 18,
  },

  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    marginBottom: 14,
    borderWidth: 1,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },

  chatName: {
    fontSize: 16,
    fontWeight: '700',
  },

  lastMessage: {
    marginTop: 4,
  },

  activeContainer: {
    flex: 1,
  },

  activeHeader: {
    height: 64,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },

  activeName: {
    fontSize: 18,
    fontWeight: '700',
  },

  msgRow: {
    marginBottom: 14,
    maxWidth: '80%',
  },

  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },

  input: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 18,
    fontSize: 15,
    borderWidth: 1,
  },

  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
