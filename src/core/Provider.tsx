import * as React from 'react';
import {
  AccessibilityInfo,
  Appearance,
  ColorSchemeName,
  NativeEventSubscription,
} from 'react-native';
import { ThemeProvider } from './theming';
import { Provider as SettingsProvider, Settings } from './settings';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import LightTheme from '../styles/themes/v2/LightTheme';
import DarkTheme from '../styles/themes/v2/DarkTheme';
import { addEventListener } from '../utils/addEventListener';
import { get } from 'lodash';
import type { MD3Token, Theme } from '../types';

type Props = {
  children: React.ReactNode;
  theme?: Theme;
  settings?: Settings;
};

const Provider = ({ ...props }: Props) => {
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
          Appearance?.removeChangeListener(handleAppearanceChange);
        }
      }
    };
  }, [props.theme]);

  const getTheme = () => {
    const { theme: providedTheme } = props;

    const theme = providedTheme
      ? providedTheme
      : ((colorScheme === 'dark' ? DarkTheme : LightTheme) as Theme);

    const isV3 = theme?.version === 3;

    /**
     * Function that allows to access theme values using Material 3 tokens
     * @param {string} tokenKey - Material 3 token
     *
     * ## Usage
     * md('md.sys.color.secondary')
     */
    const md = (tokenKey: MD3Token) => get(theme.tokens, tokenKey);

    return {
      ...theme,
      isV3,
      animation: {
        ...theme.animation,
        scale: reduceMotionEnabled ? 0 : 1,
      },
      ...(isV3 && {
        md,
      }),
    };
  };

  const { children, settings } = props;

  return (
    <PortalHost>
      <SettingsProvider value={settings || { icon: MaterialCommunityIcon }}>
        <ThemeProvider theme={getTheme()}>{children}</ThemeProvider>
      </SettingsProvider>
    </PortalHost>
  );
};

export default Provider;
