import * as React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDrawerNavigator,
  createDrawerScreen,
} from '@react-navigation/drawer';
import {
  createStaticNavigation,
  type InitialState,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import { PaperProvider, DarkTheme, LightTheme } from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import { PreferencesContext } from './PreferencesContext';
import App from './RootNavigator';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  createConfiguredFontNavigationTheme,
  createConfiguredFontTheme,
} from '../utils/themes';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';
const noop = () => {};

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
  const insets = React.useContext(SafeAreaInsetsContext);
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
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);

  const theme = React.useMemo(
    () => (isDarkMode ? DarkTheme : LightTheme),
    [isDarkMode]
  );

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  React.useEffect(() => {
    const restorePrefs = async () => {
      try {
        const prefString = await AsyncStorage.getItem(PREFERENCES_KEY);
        const preferences = JSON.parse(prefString || '');

        if (preferences) {
          setIsDarkMode(preferences.theme === 'dark');
        }
      } catch (e) {
        // ignore error
      }
    };

    restorePrefs();
  }, []);

  React.useEffect(() => {
    const savePrefs = async () => {
      try {
        await AsyncStorage.setItem(
          PREFERENCES_KEY,
          JSON.stringify({
            theme: isDarkMode ? 'dark' : 'light',
          })
        );
      } catch (e) {
        // ignore error
      }
    };

    savePrefs();
  }, [isDarkMode]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleCustomFont: () => setCustomFont(!customFontLoaded),
      toggleRippleEffect: () => setRippleEffectEnabled(!rippleEffectEnabled),
      theme,
      collapsed,
      customFontLoaded,
      rippleEffectEnabled,
      // noop for web, specified to avoid type errors
      toggleRtl: noop,
      toggleShouldUseDynamicTheme: noop,
      rtl: false,
      shouldUseDynamicTheme: false,
    }),
    [theme, collapsed, customFontLoaded, rippleEffectEnabled]
  );

  if (!isReady && !fontsLoaded) {
    return null;
  }

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  const configuredFontTheme = createConfiguredFontTheme(combinedTheme);
  const configuredFontNavigationTheme =
    createConfiguredFontNavigationTheme(combinedTheme);

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
      theme={customFontLoaded ? configuredFontTheme : theme}
    >
      <PreferencesContext.Provider value={preferences}>
        <Navigation
          theme={
            customFontLoaded ? configuredFontNavigationTheme : combinedTheme
          }
          initialState={initialState}
          onStateChange={(state) =>
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
          }
        />
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
