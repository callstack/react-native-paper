import { StyleSheet } from 'react-native';

import color from 'color';

import {
  MD2DarkTheme,
  MD2LightTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from '../../styles/themes';
import { black, white } from '../../styles/themes/v2/colors';

// This should be into another file, is duplicated in Button and utils
type ButtonMode =
  | 'text'
  | 'outlined'
  | 'contained'
  | 'elevated'
  | 'contained-tonal';

const white29 = color(white).alpha(0.29).rgb().string();

const black29 = color(black).alpha(0.29).rgb().string();

const white32 = color(white).alpha(0.32).rgb().string();

const black32 = color(black).alpha(0.32).rgb().string();

const white12 = color(white).alpha(0.32).rgb().string();

const black12 = color(black).alpha(0.32).rgb().string();

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

export const buttonThemeLightV2 = {
  elevation: {
    initial: 2,
    active: 8,
    supportedMode: 'contained' as ButtonMode,
  },
  font: MD2LightTheme.fonts.medium,
  borderRadius: 1,
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
    getTextLabel: (isTextMode, hasIconOrLoading) => {
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
        contained: white12,
      },
      disabled: {},
      default: 'transparent',
    },
    borderColor: {
      enabled: {
        outlined: white29,
      },
      disabled: {
        outlined: white29,
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
          return white32;
        }

        if (isMode('contained')) {
          return isDark({ dark, backgroundColor }) ? white : black;
        }

        return MD2LightTheme.colors.primary;
      },
    },
  },
};

export const buttonThemeDarkV2 = {
  ...buttonThemeLightV2,

  buttonStyle: {
    ...buttonThemeLightV2.buttonStyle,
    backgroundColor: {
      enabled: {
        contained: black12,
      },
      disabled: {},
      default: 'transparent',
    },
    borderColor: {
      enabled: {
        outlined: black29,
      },
      disabled: {
        outlined: black29,
      },
      default: 'transparent',
    },
    textColor: {
      getTextColor: ({ backgroundColor, isMode, disabled, dark }) => {
        if (disabled) {
          return black32;
        }

        if (isMode('contained')) {
          return isDark({ dark, backgroundColor }) ? white : black;
        }

        return MD2DarkTheme.colors.primary;
      },
    },
  },
};

export const buttonThemeLightV3 = {
  elevation: {
    initial: 1,
    active: 2,
    supportedMode: 'elevation' as ButtonMode,
  },
  font: MD3LightTheme.fonts.labelLarge,
  borderRadius: 5,
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
    getElevationStyle: (elevation) => ({}),
    getElevationProp: (elevation) => ({}),
  },
  buttonStyle: {
    backgroundColor: {
      enabled: {
        elevated: MD3LightTheme.colors.surfaceDisabled,
        contained: MD3LightTheme.colors.surfaceDisabled,
        'contained-tonal': MD3LightTheme.colors.surfaceDisabled,
      },
      disabled: {
        elevated: MD3LightTheme.colors.elevation.level1,
        contained: MD3LightTheme.colors.primary,
        'contained-tonal': MD3LightTheme.colors.secondaryContainer,
      },
      default: 'transparent',
    },
    borderColor: {
      enabled: {
        outlined: MD3LightTheme.colors.surfaceDisabled,
      },
      disabled: {
        outlined: MD3LightTheme.colors.outline,
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
          return MD3LightTheme.colors.onSurfaceDisabled;
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
          return MD3LightTheme.colors.primary;
        }

        if (isMode('contained')) {
          return MD3LightTheme.colors.onPrimary;
        }

        if (isMode('contained-tonal')) {
          return MD3LightTheme.colors.onSecondaryContainer;
        }
        return MD3LightTheme.colors.primary;
      },
    },
  },
};

export const buttonThemeDarkV3 = {
  ...buttonThemeLightV3,
  font: MD3DarkTheme.fonts.labelLarge,

  backgroundColor: {
    enabled: {
      elevated: MD3DarkTheme.colors.surfaceDisabled,
      contained: MD3DarkTheme.colors.surfaceDisabled,
      'contained-tonal': MD3DarkTheme.colors.surfaceDisabled,
    },
    disabled: {
      elevated: MD3DarkTheme.colors.elevation.level1,
      contained: MD3DarkTheme.colors.primary,
      'contained-tonal': MD3DarkTheme.colors.secondaryContainer,
    },
    default: 'transparent',
  },
  borderColor: {
    enabled: {
      outlined: MD3DarkTheme.colors.surfaceDisabled,
    },
    disabled: {
      outlined: MD3DarkTheme.colors.outline,
    },
    default: 'transparent',
  },
  textColor: {
    getTextColor: ({ backgroundColor, isMode, disabled, dark }) => {
      if (disabled) {
        return MD3DarkTheme.colors.onSurfaceDisabled;
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
        return MD3DarkTheme.colors.primary;
      }

      if (isMode('contained')) {
        return MD3DarkTheme.colors.onPrimary;
      }

      if (isMode('contained-tonal')) {
        return MD3DarkTheme.colors.onSecondaryContainer;
      }
      return MD3DarkTheme.colors.primary;
    },
  },
};
