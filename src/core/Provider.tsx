import * as React from 'react';
import {
  AccessibilityInfo,
  Appearance,
  ColorSchemeName,
  I18nManager,
  NativeEventSubscription,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import type { ThemeProp } from '../types';
import { addEventListener } from '../utils/addEventListener';
import { Direction, LocalizationProvider } from './Localization';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import { Provider as SettingsProvider, Settings } from './settings';
import { defaultThemesByVersion, ThemeProvider } from './theming';

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
  direction?: Direction;
};

const Provider = (props: Props) => {
  const isOnlyVersionInTheme =
    props.theme && Object.keys(props.theme).length === 1 && props.theme.version;

  const colorSchemeName =
    ((!props.theme || isOnlyVersionInTheme) && Appearance?.getColorScheme()) ||
    'light';

  const [reduceMotionEnabled, setReduceMotionEnabled] =
    React.useState<boolean>(false);
  const [colorScheme, setColorScheme] =
    React.useState<ColorSchemeName>(colorSchemeName);

  const handleAppearanceChange = (
    preferences: Appearance.AppearancePreferences
  ) => {
    const { colorScheme } = preferences;
    setColorScheme(colorScheme);
  };

  React.useEffect(() => {
    let subscription: NativeEventSubscription | undefined;

    if (!props.theme) {
      subscription = addEventListener(
        AccessibilityInfo,
        'reduceMotionChanged',
        setReduceMotionEnabled
      );
    }
    return () => {
      if (!props.theme) {
        subscription?.remove();
      }
    };
  }, [props.theme]);

  React.useEffect(() => {
    let appearanceSubscription: NativeEventSubscription | undefined;
    if (!props.theme || isOnlyVersionInTheme) {
      appearanceSubscription = Appearance?.addChangeListener(
        handleAppearanceChange
      ) as NativeEventSubscription | undefined;
    }
    return () => {
      if (!props.theme || isOnlyVersionInTheme) {
        if (appearanceSubscription) {
          appearanceSubscription.remove();
        } else {
          // @ts-expect-error: We keep deprecated listener remove method for backwards compat with old RN versions
          Appearance?.removeChangeListener(handleAppearanceChange);
        }
      }
    };
  }, [props.theme, isOnlyVersionInTheme]);

  React.useEffect(() => {
    if (props.direction && Platform.OS !== 'web') {
      I18nManager.forceRTL(props.direction === 'rtl');
    }
  }, [props.direction]);

  const getTheme = () => {
    const themeVersion = props.theme?.version || 3;
    const scheme = colorScheme || 'light';
    const defaultThemeBase = defaultThemesByVersion[themeVersion][scheme];

    const extendedThemeBase = {
      ...defaultThemeBase,
      ...props.theme,
      version: themeVersion,
      animation: {
        ...props.theme?.animation,
        scale: reduceMotionEnabled ? 0 : 1,
      },
    };

    return {
      ...extendedThemeBase,
      isV3: extendedThemeBase.version === 3,
    };
  };

  const {
    children,
    settings,
    direction = I18nManager.getConstants().isRTL ? 'rtl' : 'ltr',
  } = props;

  return (
    <SafeAreaProviderCompat>
      <PortalHost>
        <LocalizationProvider value={direction}>
          <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
            {/* @ts-expect-error check @callstack/react-theme-provider's children prop */}
            <ThemeProvider theme={getTheme()}>
              {
                <View style={styles.container} {...{ dir: direction }}>
                  {children}
                </View>
              }
            </ThemeProvider>
          </SettingsProvider>
        </LocalizationProvider>
      </PortalHost>
    </SafeAreaProviderCompat>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Provider;
