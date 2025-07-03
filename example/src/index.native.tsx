import * as React from 'react';
import { I18nManager } from 'react-native';

import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import {
  PaperProvider,
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import App from './RootNavigator';
import { deviceColorsSupported } from '../utils';
import { PreferencesContext } from './PreferencesContext';
import {
  CombinedDefaultTheme,
  CombinedDarkTheme,
  createConfiguredFontTheme,
  createConfiguredFontNavigationTheme,
} from '../utils/themes';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

const Drawer = createDrawerNavigator<{ Home: undefined }>();

export default function PaperExample() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Abel: require('../assets/fonts/Abel-Regular.ttf'),
  });

  const [isReady, setIsReady] = React.useState(false);
  const [initialState, setInitialState] = React.useState<
    InitialState | undefined
  >();

  const [shouldUseDeviceColors, setShouldUseDeviceColors] =
    React.useState(true);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [rtl, setRtl] = React.useState<boolean>(
    I18nManager.getConstants().isRTL
  );
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);

  const { theme: mdTheme } = useMaterial3Theme();
  const theme = React.useMemo(() => {
    if (themeVersion === 2) {
      return isDarkMode ? MD2DarkTheme : MD2LightTheme;
    }

    if (!deviceColorsSupported || !shouldUseDeviceColors) {
      return isDarkMode ? MD3DarkTheme : MD3LightTheme;
    }

    return isDarkMode
      ? { ...MD3DarkTheme, colors: mdTheme.dark }
      : { ...MD3LightTheme, colors: mdTheme.light };
  }, [isDarkMode, mdTheme, shouldUseDeviceColors, themeVersion]);

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

          if (typeof preferences.rtl === 'boolean') {
            setRtl(preferences.rtl);
          }
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
            rtl,
          })
        );
      } catch (e) {
        // ignore error
      }

      if (I18nManager.getConstants().isRTL !== rtl) {
        I18nManager.forceRTL(rtl);
        Updates.reloadAsync();
      }
    };

    savePrefs();
  }, [rtl, isDarkMode]);

  const preferences = React.useMemo(
    () => ({
      toggleShouldUseDeviceColors: () =>
        setShouldUseDeviceColors((oldValue) => !oldValue),
      toggleTheme: () => setIsDarkMode((oldValue) => !oldValue),
      toggleRtl: () => setRtl((rtl) => !rtl),
      toggleCollapsed: () => setCollapsed(!collapsed),
      toggleCustomFont: () => setCustomFont(!customFontLoaded),
      toggleRippleEffect: () => setRippleEffectEnabled(!rippleEffectEnabled),
      toggleThemeVersion: () => {
        setCustomFont(false);
        setCollapsed(false);
        setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2));
        setRippleEffectEnabled(true);
      },
      customFontLoaded,
      rippleEffectEnabled,
      collapsed,
      rtl,
      theme,
      shouldUseDeviceColors,
    }),
    [
      rtl,
      theme,
      collapsed,
      customFontLoaded,
      shouldUseDeviceColors,
      rippleEffectEnabled,
    ]
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
        <NavigationContainer
          theme={
            customFontLoaded ? configuredFontNavigationTheme : combinedTheme
          }
          initialState={initialState}
          onStateChange={(state) =>
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
          }
        >
          <SafeAreaInsetsContext.Consumer>
            {(insets) => {
              const { left, right } = insets || { left: 0, right: 0 };
              const collapsedDrawerWidth = 100 + Math.max(left, right);
              return (
                <Drawer.Navigator
                  screenOptions={{
                    drawerStyle: collapsed && {
                      width: collapsedDrawerWidth,
                    },
                  }}
                  drawerContent={() => <DrawerItems />}
                >
                  <Drawer.Screen
                    name="Home"
                    component={App}
                    options={{ headerShown: false }}
                  />
                </Drawer.Navigator>
              );
            }}
          </SafeAreaInsetsContext.Consumer>
          <StatusBar style={!theme.isV3 || theme.dark ? 'light' : 'dark'} />
        </NavigationContainer>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
