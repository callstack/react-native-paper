import * as React from 'react';

import { getDefaultDirection, LocaleProvider, type Direction } from './locale';
import SafeAreaProviderCompat from './SafeAreaProviderCompat';
import { Provider as SettingsProvider } from './settings';
import type { Settings } from './settings';
import { safeMerge, ThemeProvider } from './theming';
import {
  useResolvedReduceMotion,
  type ReduceMotionPreference,
} from './useResolvedReduceMotion';
import { useSystemColorScheme } from './useSystemColorScheme';
import MaterialCommunityIcon from '../components/MaterialCommunityIcon';
import PortalHost from '../components/Portal/PortalHost';
import { ReduceMotionContext } from '../theme/accessibility/ReduceMotionContext';
import { DarkTheme, LightTheme } from '../theme/schemes';
import type { ThemeProp } from '../theme/types';

export type Props = {
  children: React.ReactNode;
  theme?: ThemeProp;
  settings?: Settings;
  direction?: Direction;
  /**
   * Whether Paper's components reduce motion. With reduce motion on, their
   * transitions jump to the end state instead of animating. The theming guide
   * lists the few animations that don't follow it.
   *
   * - `'auto'` (default): follows the reduce motion setting of the OS, whether
   *   or not a `theme` is passed. It starts from the setting the OS had when
   *   the app launched, then follows every change, as reported by
   *   `AccessibilityInfo`.
   * - `'on'`: reduces motion, whatever the OS setting.
   * - `'off'`: doesn't reduce motion, whatever the OS setting.
   *
   * Components read the resolved value with `useReduceMotion()`.
   */
  reduceMotion?: ReduceMotionPreference;
};

const PaperProvider = (props: Props) => {
  const { reduceMotion = 'auto' } = props;

  const colorScheme = useSystemColorScheme(!props.theme);
  const resolvedReduceMotion = useResolvedReduceMotion(reduceMotion);

  const theme = React.useMemo(() => {
    const isDark = props.theme?.dark ?? colorScheme === 'dark';
    const base = isDark ? DarkTheme : LightTheme;
    return safeMerge(base, props.theme);
  }, [colorScheme, props.theme]);

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
