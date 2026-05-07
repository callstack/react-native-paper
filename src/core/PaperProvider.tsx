import * as React from 'react';

import { getDefaultDirection, LocaleProvider, type Direction } from './locale';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import { Provider as SettingsProvider, Settings } from './settings';
import { defaultThemes, ThemeProvider } from './theming';
import {
  useResolvedReduceMotion,
  type ReduceMotionPreference,
} from './useResolvedReduceMotion';
import { useSystemColorScheme } from './useSystemColorScheme';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { ReduceMotionContext } from '../theme/accessibility/ReduceMotionContext';
import {
  isDynamicColorSupported,
  lightDynamicColors,
  darkDynamicColors,
} from '../theme/schemes/DynamicTheme';
import type { ThemeProp } from '../types';

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
  direction?: Direction;
  reduceMotion?: ReduceMotionPreference;
  dynamicColor?: boolean;
};

const PaperProvider = (props: Props) => {
  const { reduceMotion = 'auto', dynamicColor = false } = props;

  const colorScheme = useSystemColorScheme(!props.theme);
  const resolvedReduceMotion = useResolvedReduceMotion(reduceMotion);

  const theme = React.useMemo(() => {
    const isDark = props.theme?.dark ?? colorScheme === 'dark';
    const base = defaultThemes[isDark ? 'dark' : 'light'];
    const dynamicColors =
      dynamicColor && isDynamicColorSupported
        ? isDark
          ? darkDynamicColors
          : lightDynamicColors
        : undefined;
    const scale = resolvedReduceMotion ? 0 : props.theme?.animation?.scale ?? 1;

    return {
      ...base,
      ...props.theme,
      colors: { ...base.colors, ...props.theme?.colors, ...dynamicColors },
      animation: { ...props.theme?.animation, scale },
    };
  }, [colorScheme, props.theme, resolvedReduceMotion, dynamicColor]);

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
