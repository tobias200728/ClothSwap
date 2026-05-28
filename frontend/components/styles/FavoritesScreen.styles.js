import { StyleSheet } from 'react-native';

export const COLORS = {
  light: {
    bg: '#fff7f2',
    card: '#ffffff',
    text: '#1a1a1a',
    sub: '#777777',
    accent: '#ff7a59',
    border: '#f2d9cf',
  },
  dark: {
    bg: '#121212',
    card: '#1e1e1f',
    text: '#ffffff',
    sub: '#aaaaaa',
    accent: '#ff8c69',
    border: '#2f2f32',
  },
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 4,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
  },

  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
  },

  scroll: {
    padding: 18,
    paddingBottom: 120,
  },

  card: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
  },

  image: {
    width: '100%',
    height: 300,
  },

  heartBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  info: {
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },

  msgBtn: {
    height: 52,
    borderRadius: 18,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  msgText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
});
