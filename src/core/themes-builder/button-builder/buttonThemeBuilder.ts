import { StyleSheet } from 'react-native';

import color from 'color';

import { black, white } from '../../../styles/themes/v2/colors';
import type { MD2Theme, MD3Theme } from '../../../types';
import type { ButtonMode, ButtonTheme } from './types';

const white29 = color(white).alpha(0.29).rgb().string();

const black29 = color(black).alpha(0.29).rgb().string();

const white32 = color(white).alpha(0.32).rgb().string();

const black32 = color(black).alpha(0.32).rgb().string();

const white12 = color(white).alpha(0.12).rgb().string();

const black12 = color(black).alpha(0.12).rgb().string();

const isDark = ({
  dark,
  backgroundColor,
}: {
  dark?: boolean;
  backgroundColor?: string;
}) => {
  if (typeof dark === 'boolean') {
    return dark;
  }

  if (backgroundColor === 'transparent') {
    return false;
  }

  if (backgroundColor !== 'transparent') {
    return !color(backgroundColor).isLight();
  }

  return false;
};

const styles = StyleSheet.create({
  md2Label: {
    letterSpacing: 1,
  },
  md3Label: {
    marginVertical: 10,
    marginHorizontal: 24,
  },
  md3LabelTextAddons: {
    marginHorizontal: 16,
  },
  md3LabelText: {
    marginHorizontal: 12,
  },
  md3Icon: {
    marginLeft: 16,
    marginRight: -16,
  },
  md3IconCompact: {
    marginLeft: 8,
    marginRight: 0,
  },
  md3IconReverse: {
    marginLeft: -16,
    marginRight: 16,
  },
  md3IconReverseCompact: {
    marginLeft: 0,
    marginRight: 8,
  },
  md3IconTextMode: {
    marginLeft: 12,
    marginRight: -8,
  },
  md3IconTextModeCompact: {
    marginLeft: 6,
    marginRight: 0,
  },
  md3IconReverseTextMode: {
    marginLeft: -8,
    marginRight: 12,
  },
  md3IconReverseTextModeCompact: {
    marginLeft: 0,
    marginRight: 6,
  },
});
export const getButtonThemeV3 = (theme: MD3Theme) =>
  buttonThemeV3Builder(theme);

export const getButtonThemeV2 = (theme: MD2Theme) =>
  buttonThemeV2Builder(theme);

const buttonThemeV2Builder = (theme: MD2Theme): ButtonTheme => ({
  elevation: {
    initial: 2,
    active: 8,
    supportedMode: 'contained' as ButtonMode,
  },
  font: theme.fonts.medium,
  borderRadius: 1 * theme.roundness,
  iconSize: 16,

  iconStyle: {
    icon: {
      reverse: {
        compact: {},
        normal: {},
      },
      forward: {
        compact: {},
        normal: {},
      },
    },
    textMode: {
      reverse: {
        compact: {},
        normal: {},
      },
      forward: {
        compact: {},
        normal: {},
      },
    },
  },
  textStyle: {
    getTextLabel: () => {
      return styles.md2Label;
    },
  },
  surfaceStyle: {
    getElevationStyle: (elevation) => ({ elevation }),
    getElevationProp: (elevation) => ({ elevation }),
  },
  buttonStyle: {
    backgroundColor: {
      enabled: {
        contained: theme.dark ? white12 : black12,
      },
      disabled: {},
      default: 'transparent',
    },
    borderColor: {
      enabled: {
        outlined: theme.dark ? white29 : black29,
      },
      disabled: {
        outlined: theme.dark ? white29 : black29,
      },
      default: 'transparent',
    },
    borderWidth: {
      outlined: StyleSheet.hairlineWidth,
      default: 0,
    },
    textColor: {
      getTextColor: ({ backgroundColor, isMode, disabled, dark }) => {
        if (disabled) {
          return theme.dark ? white32 : black32;
        }

        if (isMode('contained')) {
          return isDark({ dark, backgroundColor }) ? white : black;
        }

        return theme.colors.primary;
      },
    },
  },
});

const buttonThemeV3Builder = (theme: MD3Theme): ButtonTheme => ({
  elevation: {
    initial: 1,
    active: 2,
    supportedMode: 'elevation' as ButtonMode,
  },
  font: theme.fonts.labelLarge,
  borderRadius: 5 * theme.roundness,
  iconSize: 18,
  iconStyle: {
    icon: {
      reverse: {
        compact: styles.md3IconReverseCompact,
        normal: styles.md3IconReverse,
      },
      forward: {
        compact: styles.md3IconCompact,
        normal: styles.md3Icon,
      },
    },
    textMode: {
      reverse: {
        compact: styles.md3IconReverseTextModeCompact,
        normal: styles.md3IconReverseTextMode,
      },
      forward: {
        compact: styles.md3IconTextModeCompact,
        normal: styles.md3IconTextMode,
      },
    },
  },
  textStyle: {
    getTextLabel: (isTextMode, hasIconOrLoading) => {
      if (!isTextMode) {
        return styles.md3Label;
      }

      if (hasIconOrLoading) {
        return styles.md3LabelTextAddons;
      }

      return styles.md3LabelText;
    },
  },
  surfaceStyle: {
    getElevationStyle: () => ({}),
    getElevationProp: (elevation) => ({ elevation }),
  },
  buttonStyle: {
    backgroundColor: {
      enabled: {
        elevated: theme.colors.elevation.level1,
        contained: theme.colors.primary,
        'contained-tonal': theme.colors.secondaryContainer,
      },
      disabled: {
        elevated: theme.colors.surfaceDisabled,
        contained: theme.colors.surfaceDisabled,
        'contained-tonal': theme.colors.surfaceDisabled,
      },
      default: 'transparent',
    },
    borderColor: {
      enabled: {
        outlined: theme.colors.outline,
      },
      disabled: {
        outlined: theme.colors.surfaceDisabled,
      },
      default: 'transparent',
    },
    borderWidth: {
      outlined: 1,
      default: 0,
    },
    textColor: {
      getTextColor: ({ backgroundColor, isMode, disabled, dark }) => {
        if (disabled) {
          return theme.colors.onSurfaceDisabled;
        }

        if (typeof dark === 'boolean') {
          if (
            isMode('contained') ||
            isMode('contained-tonal') ||
            isMode('elevated')
          ) {
            return isDark({ dark, backgroundColor }) ? white : black;
          }
        }

        if (isMode('outlined') || isMode('text') || isMode('elevated')) {
          return theme.colors.primary;
        }

        if (isMode('contained')) {
          return theme.colors.onPrimary;
        }

        if (isMode('contained-tonal')) {
          return theme.colors.onSecondaryContainer;
        }
        return theme.colors.primary;
      },
    },
  },
});
