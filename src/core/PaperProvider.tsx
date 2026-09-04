import * as React from 'react';

import { getDefaultDirection, LocaleProvider, type Direction } from './locale';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import { Provider as SettingsProvider } from './settings';
import type { Settings } from './settings';
import { defaultThemes, safeMerge, ThemeProvider } from './theming';
import {
  useResolvedReduceMotion,
  type ReduceMotionPreference,
} from './useResolvedReduceMotion';
import { useSystemColorScheme } from './useSystemColorScheme';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { ReduceMotionContext } from '../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../types';

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
  direction?: Direction;
  reduceMotion?: ReduceMotionPreference;
};

const PaperProvider = (props: Props) => {
  const { reduceMotion = 'auto' } = props;

  const colorScheme = useSystemColorScheme(!props.theme);
  const resolvedReduceMotion = useResolvedReduceMotion(reduceMotion);

  const theme = React.useMemo(() => {
    const isDark = props.theme?.dark ?? colorScheme === 'dark';
    const base = defaultThemes[isDark ? 'dark' : 'light'];
    const scale = resolvedReduceMotion
      ? 0
      : (props.theme?.animation?.scale ?? 1);

    // Deep merge so a partial theme extends the defaults instead of replacing
    // them. `safeMerge` is the same helper `useInternalTheme` uses for the
    // per-component `theme` prop, which keeps both levels consistent.
    const merged = safeMerge(base, props.theme);

    return {
      ...merged,
      animation: { ...merged.animation, scale },
    };
  }, [colorScheme, props.theme, resolvedReduceMotion]);

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
