import { Platform } from 'react-native';

import { createStaticNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useKeepAwake } from 'expo-keep-awake';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';

import { PreferencesContext } from './Preferences/PreferencesContext';
import {
  navigationPersistor,
  useSetupPreferences,
} from './Preferences/useSetupPreferences';
import App from './RootNavigator';
import {
  CombinedDarkTheme,
  CombinedDefaultTheme,
  createConfiguredFontNavigationTheme,
  createConfiguredFontTheme,
} from '../utils/themes';

const Navigation = createStaticNavigation(App);

type RootNavigationType = typeof App;

declare module '@react-navigation/core' {
  interface RootNavigator extends RootNavigationType {}
}

export default function PaperExample() {
  useKeepAwake();

  const [fontsLoaded] = useFonts({
    Abel: require('../assets/fonts/Abel-Regular.ttf'),
  });

  const { preferences, isReady, isDarkMode, direction, navigationKey } =
    useSetupPreferences();

  if (!isReady || !fontsLoaded) {
    return null;
  }

  const { theme, customFontLoaded, rippleEffectEnabled } = preferences;

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
      settings={{ rippleEffectEnabled }}
      theme={paperTheme}
    >
      <PreferencesContext.Provider value={preferences}>
        <Navigation
          key={navigationKey}
          theme={navigationTheme}
          direction={direction}
          persistor={navigationPersistor}
          linking={{ config: { initialRouteName: 'SamplesList' } }}
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
