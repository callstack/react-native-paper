import * as React from 'react';
import {
  AccessibilityInfo,
  Appearance,
  ColorSchemeName,
  NativeEventSubscription,
} from 'react-native';

import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import { Provider as SettingsProvider, Settings } from './settings';
import { defaultThemesByVersion, ThemeProvider } from './theming';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import type { ThemeProp } from '../types';
import { addEventListener } from '../utils/addEventListener';

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
};

const PaperProvider = (props: Props) => {
  const colorSchemeName =
    (!props.theme && Appearance?.getColorScheme()) || 'light';

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
    if (!props.theme) {
      appearanceSubscription = Appearance?.addChangeListener(
        handleAppearanceChange
      ) as NativeEventSubscription | undefined;
    }
    return () => {
      if (!props.theme) {
        if (appearanceSubscription) {
          appearanceSubscription.remove();
        } else {
          // @ts-expect-error: We keep deprecated listener remove method for backwards compat with old RN versions
          Appearance?.removeChangeListener(handleAppearanceChange);
        }
      }
    };
  }, [props.theme]);

  const theme = React.useMemo(() => {
    const scheme = colorScheme || 'light';
    const defaultThemeBase = defaultThemesByVersion[scheme];

    const extendedThemeBase = {
      ...defaultThemeBase,
      ...props.theme,
      animation: {
        ...props.theme?.animation,
        scale: reduceMotionEnabled ? 0 : 1,
      },
    };

    return {
      ...extendedThemeBase,
    };
  }, [colorScheme, props.theme, reduceMotionEnabled]);

  const { children, settings } = props;

  const settingsValue = React.useMemo(
    () => ({
      icon: MaterialCommunityIcon,
      rippleEffectEnabled: true,
      ...settings,
    }),
    [settings]
  );

  return (
    <SafeAreaProviderCompat>
      <PortalHost>
        <SettingsProvider value={settingsValue}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </SettingsProvider>
      </PortalHost>
    </SafeAreaProviderCompat>
  );
};

export default PaperProvider;
