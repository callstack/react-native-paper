import * as React from 'react';

import { getDefaultDirection, LocaleProvider, type Direction } from './locale';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import { Provider as SettingsProvider } from './settings';
import type { Settings } from './settings';
import { ThemeProvider } from './theming';
import {
  useResolvedReduceMotion,
  type ReduceMotionPreference,
} from './useResolvedReduceMotion';
import { useSystemColorScheme } from './useSystemColorScheme';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { ReduceMotionContext } from '../theme/accessibility/ReduceMotionContext';
import { DarkTheme, LightTheme } from '../theme/schemes';
import { createTheme } from '../theme/schemes/createTheme';
import type { ContrastLevel, Theme, ThemeProp } from '../theme/types';

// Built once so that switching contrast does not rebuild a scheme
const contrastThemes: Record<'light' | 'dark', Record<ContrastLevel, Theme>> = {
  light: {
    standard: LightTheme,
    medium: createTheme({ dark: false, contrast: 'medium' }),
    high: createTheme({ dark: false, contrast: 'high' }),
  },
  dark: {
    standard: DarkTheme,
    medium: createTheme({ dark: true, contrast: 'medium' }),
    high: createTheme({ dark: true, contrast: 'high' }),
  },
};

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
  direction?: Direction;
  reduceMotion?: ReduceMotionPreference;
  /**
   * MD3 contrast level. `medium` and `high` raise color contrast to make the
   * app easier to read. Unlike `theme`, setting this keeps automatic system
   * dark mode working.
   * @default 'standard'
   */
  contrast?: ContrastLevel;
};

const PaperProvider = (props: Props) => {
  const { reduceMotion = 'auto', contrast } = props;

  const colorScheme = useSystemColorScheme(!props.theme);
  const resolvedReduceMotion = useResolvedReduceMotion(reduceMotion);

  const theme = React.useMemo(() => {
    const isDark = props.theme?.dark ?? colorScheme === 'dark';
    // The prop wins over a level set on a custom theme object
    const level = contrast ?? props.theme?.contrast ?? 'standard';
    // `level` is the scheme we picked, `theme.colors` still override it
    const base = contrastThemes[isDark ? 'dark' : 'light'][level];
    const scale = resolvedReduceMotion
      ? 0
      : (props.theme?.animation?.scale ?? 1);

    return {
      ...base,
      ...props.theme,
      contrast: level,
      colors: { ...base.colors, ...props.theme?.colors },
      animation: { ...props.theme?.animation, scale },
    };
  }, [colorScheme, contrast, props.theme, resolvedReduceMotion]);

  const { children, settings } = props;

  const direction = props.direction ?? getDefaultDirection();

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
          <ReduceMotionContext.Provider value={resolvedReduceMotion}>
            <LocaleProvider direction={direction}>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </LocaleProvider>
          </ReduceMotionContext.Provider>
        </SettingsProvider>
      </PortalHost>
    </SafeAreaProviderCompat>
  );
};

export default PaperProvider;
