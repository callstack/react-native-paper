import * as React from 'react';
import { I18nManager, Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import {
  DarkTheme,
  LightTheme,
  DynamicLightTheme,
  DynamicDarkTheme,
} from 'react-native-paper';

import type { Preferences } from './PreferencesContext';
import { dynamicThemeSupported } from '../../utils';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

const getInitialRtl = () => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return document.documentElement.dir === 'rtl';
  }

  return I18nManager.getConstants().isRTL;
};

export const navigationPersistor = {
  async persist(state: unknown) {
    await AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
  },
  async restore() {
    const state = await AsyncStorage.getItem(PERSISTENCE_KEY);

    return state ? JSON.parse(state) : undefined;
  },
};

export function useSetupPreferences() {
  const [isReady, setIsReady] = React.useState(false);

  const [initialRtl] = React.useState(getInitialRtl);

  const [shouldUseDynamicTheme, setShouldUseDynamicTheme] =
    React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [rtl, setRtl] = React.useState(initialRtl);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);
  const [preferencesVisible, setPreferencesVisible] = React.useState(false);

  const [navigationKey, setNavigationKey] = React.useState(0);

  const theme =
    dynamicThemeSupported && shouldUseDynamicTheme
      ? isDarkMode
        ? DynamicDarkTheme
        : DynamicLightTheme
      : isDarkMode
        ? DarkTheme
        : LightTheme;

  const direction: 'rtl' | 'ltr' = rtl ? 'rtl' : 'ltr';

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');

          if (typeof preferences.rtl === 'boolean') {
            setRtl(preferences.rtl);
          }
        }
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    void restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      if (!isReady) {
        return;
      }

      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: isDarkMode ? 'dark' : 'light',
            rtl,
          })
        );
      } catch (e) {
        // ignore error
      }

      if (Platform.OS === 'web' && typeof document !== 'undefined') {
        document.documentElement.dir = direction;
      }

      if (I18nManager.getConstants().isRTL !== rtl) {
        I18nManager.forceRTL(rtl);

        if (Platform.OS !== 'web') {
          await Updates.reloadAsync();
        }
      }
    };

    void savePrefs();
  }, [direction, isDarkMode, isReady, rtl]);

  const resetPreferences = React.useCallback(async () => {
    setShouldUseDynamicTheme(true);
    setIsDarkMode(false);
    setCustomFont(false);
    setRippleEffectEnabled(true);
    setPreferencesVisible(false);

    try {
      await AsyncStorage.multiRemove([PREFERENCES_KEY, PERSISTENCE_KEY]);
    } catch (e) {
      // ignore error
    }

    setNavigationKey((oldValue) => oldValue + 1);
  }, []);

  const preferences: Preferences = React.useMemo(
    () => ({
      toggleShouldUseDynamicTheme: () =>
        setShouldUseDynamicTheme((oldValue) => !oldValue),
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleRtl: () => setRtl((oldValue) => !oldValue),
      toggleCustomFont: () => setCustomFont((oldValue) => !oldValue),
      toggleRippleEffect: () => setRippleEffectEnabled((oldValue) => !oldValue),
      togglePreferences: () => setPreferencesVisible((oldValue) => !oldValue),
      resetPreferences,
      preferencesVisible,
      customFontLoaded,
      rippleEffectEnabled,
      shouldUseDynamicTheme,
      theme,
      rtl,
    }),
    [
      rtl,
      theme,
      customFontLoaded,
      preferencesVisible,
      shouldUseDynamicTheme,
      rippleEffectEnabled,
      resetPreferences,
    ]
  );

  return {
    preferences,
    isReady,
    isDarkMode,
    direction,
    navigationKey,
  };
}
