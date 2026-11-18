import AsyncStorage from '@react-native-async-storage/async-storage';

const PERSISTENCE_KEY = 'NAVIGATION_STATE_V2';

export const navigationPersistor = {
  async persist(state: unknown) {
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  },
  async restore() {
    const state = await AsyncStorage.getItem(PERSISTENCE_KEY);

    return state ? JSON.parse(state) : undefined;
  },
};

export const clearNavigationState = () =>
  AsyncStorage.removeItem(PERSISTENCE_KEY);
