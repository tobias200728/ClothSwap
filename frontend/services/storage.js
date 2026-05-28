import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'clothswap_token';
const USER_KEY = 'clothswap_user';

export const saveToken = (token) => AsyncStorage.setItem(TOKEN_KEY, token);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const removeToken = () => AsyncStorage.removeItem(TOKEN_KEY);

export const saveUser = (user) => AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
export const getUser = async () => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearSession = () => AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
