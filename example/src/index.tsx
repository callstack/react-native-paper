import * as React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { InitialState, NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import {
  PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD2DarkTheme,
  MD2LightTheme,
  MD2Theme,
  MD3Theme,
  useTheme,
} from 'react-native-paper';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import DrawerItems from './DrawerItems';
import App from './RootNavigator';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  createConfiguredFontTheme,
} from '../utils/themes';

const PERSISTENCE_KEY = 'NAVIGATION_STATE';
const PREFERENCES_KEY = 'APP_PREFERENCES';

export const PreferencesContext = React.createContext<{
  toggleTheme: () => void;
  toggleThemeVersion: () => void;
  toggleCollapsed: () => void;
  toggleCustomFont: () => void;
  toggleRippleEffect: () => void;
  customFontLoaded: boolean;
  rippleEffectEnabled: boolean;
  collapsed: boolean;
  theme: MD2Theme | MD3Theme;
} | null>(null);

export const useExampleTheme = () => useTheme<MD2Theme | MD3Theme>();

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

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [themeVersion, setThemeVersion] = React.useState<2 | 3>(3);
  const [collapsed, setCollapsed] = React.useState(false);
  const [customFontLoaded, setCustomFont] = React.useState(false);
  const [rippleEffectEnabled, setRippleEffectEnabled] = React.useState(true);

  const theme = React.useMemo(() => {
    if (themeVersion === 2) {
      return isDarkMode ? MD2DarkTheme : MD2LightTheme;
    }

    return isDarkMode ? MD3DarkTheme : MD3LightTheme;
  }, [isDarkMode, themeVersion]);

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
      toggleThemeVersion: () => {
        setCustomFont(false);
        setCollapsed(false);
        setThemeVersion((oldThemeVersion) => (oldThemeVersion === 2 ? 3 : 2));
        setRippleEffectEnabled(true);
      },
      customFontLoaded,
      rippleEffectEnabled,
      collapsed,
      theme,
    }),
    [theme, collapsed, customFontLoaded, rippleEffectEnabled]
  );

  if (!isReady && !fontsLoaded) {
    return null;
  }

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;
  const configuredFontTheme = createConfiguredFontTheme(combinedTheme);

  return (
    <PaperProvider
      settings={{ rippleEffectEnabled: preferences.rippleEffectEnabled }}
      theme={customFontLoaded ? configuredFontTheme : theme}
    >
      <PreferencesContext.Provider value={preferences}>
        <NavigationContainer
          // @ts-ignore - will be adjusted after merging https://github.com/callstack/react-native-paper/pull/4690
          theme={combinedTheme}
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
        </NavigationContainer>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
}
