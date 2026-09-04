import type { OpaqueColorValue } from 'react-native';
import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { red50, red500 } from '../../theme/colors';
import type { InternalTheme } from '../../types';
import { resolveAvatarColors, getAvatarImageSourceKey } from '../Avatar/utils';

// `PlatformColor()` only accepts literal arguments, so the resolved value is
// passed in rather than the resource name.
const withPlatformColor = (
  theme: InternalTheme,
  role: 'primary' | 'primaryContainer' | 'error',
  platformColor: OpaqueColorValue
): InternalTheme => ({
  ...theme,
  colors: {
    ...theme.colors,
    [role]: platformColor,
  },
});

describe('resolveAvatarColors', () => {
  it('uses the MD3 container pair for the default background', () => {
    const theme = getTheme();
    expect(typeof theme.colors.primaryContainer).toBe('string');
    expect(resolveAvatarColors({ theme })).toEqual({
      background: theme.colors.primaryContainer,
      textColor: theme.colors.onPrimaryContainer,
    });
  });

  it('uses onPrimaryContainer for an opaque default container token', () => {
    const theme = withPlatformColor(
      getTheme(),
      'primaryContainer',
      PlatformColor('@android:color/system_primary_container_light')
    );
    expect(resolveAvatarColors({ theme })).toEqual({
      background: theme.colors.primaryContainer,
      textColor: theme.colors.onPrimaryContainer,
    });
  });

  it('pairs a custom opaque theme-role background via contentColorFor', () => {
    const theme = withPlatformColor(
      getTheme(),
      'error',
      PlatformColor('@android:color/system_error_light')
    );
    expect(
      resolveAvatarColors({ theme, backgroundColor: theme.colors.error })
    ).toEqual({
      background: theme.colors.error,
      textColor: theme.colors.onError,
    });
  });

  it('uses the luminance heuristic for a dark hex background', () => {
    const theme = getTheme();
    expect(resolveAvatarColors({ theme, backgroundColor: red500 })).toEqual({
      background: red500,
      textColor: '#ffffff',
    });
  });

  it('uses the luminance heuristic for a light hex background', () => {
    const theme = getTheme();
    expect(resolveAvatarColors({ theme, backgroundColor: red50 })).toEqual({
      background: red50,
      textColor: 'rgba(0, 0, 0, .54)',
    });
  });

  it('falls back to onSurface for an unknown PlatformColor', () => {
    const theme = getTheme();
    const platformColor = PlatformColor('@android:color/holo_blue_bright');

    expect(
      resolveAvatarColors({ theme, backgroundColor: platformColor })
    ).toEqual({
      background: platformColor,
      textColor: theme.colors.onSurface,
    });
  });

  it('lets an explicit color override derived content color', () => {
    const theme = getTheme();
    expect(
      resolveAvatarColors({
        theme,
        backgroundColor: theme.colors.error,
        color: '#00ff00',
      })
    ).toEqual({
      background: theme.colors.error,
      textColor: '#00ff00',
    });
  });
});

describe('getAvatarImageSourceKey', () => {
  it('keys object sources by uri', () => {
    expect(getAvatarImageSourceKey({ uri: 'a.png' })).toBe('a.png');
  });

  it('is stable for function sources', () => {
    expect(getAvatarImageSourceKey(() => null)).toBe('function');
    expect(getAvatarImageSourceKey(() => null)).toBe(
      getAvatarImageSourceKey(() => null)
    );
  });

  it('uses the value for module ids', () => {
    expect(getAvatarImageSourceKey(1)).toBe(1);
  });
});
