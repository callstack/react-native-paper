import * as React from 'react';
import { I18nManager, Platform } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  createDrawerScreen,
} from '@react-navigation/drawer';
import { createStaticNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import {
  PaperProvider,
  DarkTheme,
  LightTheme,
  DynamicLightTheme,
  DynamicDarkTheme,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import { PreferencesContext } from './PreferencesContext';
import App from './RootNavigator';
import { dynamicThemeSupported } from '../utils';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  createConfiguredFontNavigationTheme,
  createConfiguredFontTheme,
} from '../utils/themes';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

const getInitialRtl = () => {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return document.documentElement.dir === 'rtl';
  }

  return I18nManager.getConstants().isRTL;
};

const Drawer = createDrawerNavigator({
  screens: {
    Home: createDrawerScreen({
      screen: App,
      options: {
        headerShown: false,
      },
      linking: {
        path: '',
        initialRouteName: 'ExampleList',
      },
    }),
  },
}).with(({ Navigator }) => {
  const preferences = React.useContext(PreferencesContext);
  const insets = useSafeAreaInsets();
  const { left, right } = insets || { left: 0, right: 0 };
  const collapsedDrawerWidth = 100 + Math.max(left, right);

  return (
    <Navigator
      screenOptions={{
        drawerStyle: preferences?.collapsed && {
          width: collapsedDrawerWidth,
        },
      }}
      drawerContent={() => <DrawerItems />}
    />
  );
});

const Navigation = createStaticNavigation(Drawer);

type RootDrawerType = typeof Drawer;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootDrawerType {}
}

export default function PaperExample() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Abel: require('../assets/fonts/Abel-Regular.ttf'),
  });

  const [isReady, setIsReady] = React.useState(false);

  const [shouldUseDynamicTheme, setShouldUseDynamicTheme] =
    React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [rtl, setRtl] = React.useState(getInitialRtl);
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);

  const theme =
    dynamicThemeSupported && shouldUseDynamicTheme
      ? isDarkMode
        ? DynamicDarkTheme
        : DynamicLightTheme
      : isDarkMode
        ? DarkTheme
        : LightTheme;

  const direction = rtl ? 'rtl' : 'ltr';

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

  const preferences = React.useMemo(
    () => ({
      toggleShouldUseDynamicTheme: () =>
        setShouldUseDynamicTheme((oldValue) => !oldValue),
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleRtl: () => setRtl((oldValue) => !oldValue),
      toggleCollapsed: () => setCollapsed((oldValue) => !oldValue),
      toggleCustomFont: () => setCustomFont((oldValue) => !oldValue),
      toggleRippleEffect: () => setRippleEffectEnabled((oldValue) => !oldValue),
      customFontLoaded,
      rippleEffectEnabled,
      shouldUseDynamicTheme,
      theme,
      collapsed,
      rtl,
    }),
    [
      rtl,
      theme,
      collapsed,
      customFontLoaded,
      shouldUseDynamicTheme,
      rippleEffectEnabled,
    ]
  );

  if (!isReady || !fontsLoaded) {
    return null;
  }

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  const configuredFontTheme = createConfiguredFontTheme(combinedTheme);
  const configuredFontNavigationTheme =
    createConfiguredFontNavigationTheme(combinedTheme);
  const paperTheme = customFontLoaded ? configuredFontTheme : theme;
  const navigationTheme = customFontLoaded
    ? configuredFontNavigationTheme
    : combinedTheme;

  return (
    <PaperProvider
      direction={direction}
      settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
      theme={paperTheme}
    >
      <PreferencesContext.Provider value={preferences}>
        <Navigation
          theme={navigationTheme}
          direction={direction}
          persistor={{
            async persist(state) {
              await AsyncStorage.setItem(
                PERSISTENCE_KEY,
                JSON.stringify(state)
              );
            },
            async restore() {
              const state = await AsyncStorage.getItem(PERSISTENCE_KEY);

              return state ? JSON.parse(state) : undefined;
            },
          }}
          onReady={() => {
            void SplashScreen.hideAsync();
          }}
        />
        {Platform.OS !== 'web' ? (
          <StatusBar style={theme.dark ? 'light' : 'dark'} />
        ) : null}
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
