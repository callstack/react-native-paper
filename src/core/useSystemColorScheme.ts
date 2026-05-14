import * as React from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

/**
 * Subscribes to the OS color-scheme setting via `Appearance.addChangeListener`
 * and returns the current value.
 *
 * When `enabled` is false the hook does not subscribe and returns `'light'` —
 * used by `PaperProvider` to skip system tracking when the user has supplied
 * an explicit theme.
 */
export function useSystemColorScheme(enabled: boolean): ColorSchemeName {
  const [colorScheme, setColorScheme] = React.useState<ColorSchemeName>(() =>
    enabled ? Appearance?.getColorScheme() ?? 'light' : 'light'
  );

  React.useEffect(() => {
    if (!enabled) return;
    const sub = Appearance?.addChangeListener((preferences) => {
      setColorScheme(preferences.colorScheme);
    });
    return () => {
      sub?.remove();
    };
  }, [enabled]);

  return colorScheme;
}
