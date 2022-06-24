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
import MD2LightTheme from '../styles/themes/v2/LightTheme';
import MD2DarkTheme from '../styles/themes/v2/DarkTheme';
import MD3LightTheme from '../styles/themes/v3/LightTheme';
import MD3DarkTheme from '../styles/themes/v3/DarkTheme';
import { addEventListener } from '../utils/addEventListener';
import type { Theme, ThemeBase } from '../types';
import { typescale } from '../styles/themes/v3/tokens';

type ThemeProp =
  | ThemeBase
  | {
      version: 2 | 3;
    };

type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
};

const Provider = (props: Props) => {
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
    const defaultThemesByVersion = {
      2: {
        light: MD2LightTheme,
        dark: MD2DarkTheme,
      },
      3: {
        light: MD3LightTheme,
        dark: MD3DarkTheme,
      },
    };

    const themeVersion = props.theme?.version || 3;
    const scheme = colorScheme || 'light';
    const defaultThemeBase = defaultThemesByVersion[themeVersion][scheme];

    const extendedThemeBase = {
      ...defaultThemeBase,
      ...(props.theme as ThemeBase),
      version: props.theme?.version || 3,
      animation: {
        scale: reduceMotionEnabled ? 0 : 1,
      },
      typescale,
    };

    return {
      ...extendedThemeBase,
      isV3: extendedThemeBase.version === 3,
    } as Theme;
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
