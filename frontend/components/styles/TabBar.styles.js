import { StyleSheet, Platform } from 'react-native';

export const COLORS = {
  light: {
    bg: '#fff7f2',
    text: '#111',
    inactive: '#8e8e93',
    accent: '#ff7a59',
    blur: 'light',
  },
  dark: {
    bg: '#121212',
    text: '#fff',
    inactive: '#8d8d93',
    accent: '#ff8c69',
    blur: 'dark',
  },
};

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 92 : 72,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    paddingTop: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
  },
});
