import { StyleSheet } from 'react-native';

import color from 'color';

import {
  getButtonThemeV3,
  getButtonThemeV2,
} from '../../core/themes-builder/buttonThemeBuilder';
import { useInternalTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import type { ThemeProp } from '../../types';
import type { ButtonTheme } from './ButtonNew';
import { getButtonTextColor } from './utils';

type UseButtonThemeProp = {
  theme?: ThemeProp;
};

export const useButtonTheme = ({
  theme: themeOverrides,
}: Readonly<UseButtonThemeProp>) => {
  const theme = useInternalTheme(themeOverrides);

  if (theme.isV3) {
    return getButtonThemeV3(theme);
  }
  return getButtonThemeV2(theme);
};

export const useButtonTheme2 = ({
  theme: themeOverrides,
}: UseButtonThemeProp) => {
  const theme = useInternalTheme(themeOverrides);
  const { isV3, roundness } = theme;

  const elevation = {
    initial: isV3 ? 1 : 2,
    active: isV3 ? 2 : 8,
    supportedMode: isV3 ? 'elevation' : 'contained',
  } as ButtonTheme['elevation'];
  const iconStyle = {
    icon: {
      reverse: {
        compact: isV3 ? styles.md3IconReverseCompact : {},
        normal: isV3 ? styles.md3IconReverse : {},
      },
      forward: {
        compact: isV3 ? styles.md3IconCompact : {},
        normal: isV3 ? styles.md3Icon : {},
      },
    },
    textMode: {
      reverse: {
        compact: isV3 ? styles.md3IconReverseTextModeCompact : {},
        normal: isV3 ? styles.md3IconReverseTextMode : {},
      },
      forward: {
        compact: isV3 ? styles.md3IconTextModeCompact : {},
        normal: isV3 ? styles.md3IconTextMode : {},
      },
    },
  };
  const textStyle = {
    getTextLabel: (isTextMode, hasIconOrLoading) => {
      if (!isV3) {
        return styles.md2Label;
      }

      if (!isTextMode) {
        return styles.md3Label;
      }

      if (hasIconOrLoading) {
        return styles.md3LabelTextAddons;
      }

      return styles.md3LabelText;
    },
  } as ButtonTheme['textStyle'];
  const surfaceStyle = {
    getElevationStyle: (elevation) => (!isV3 ? { elevation } : {}),
    getElevationProp: (elevation) => (isV3 ? { elevation } : {}),
  } as ButtonTheme['surfaceStyle'];

  const backgroundColor = {
    enabled: isV3
      ? {
          elevated: theme.colors.surfaceDisabled,
          contained: theme.colors.surfaceDisabled,
          'contained-tonal': theme.colors.surfaceDisabled,
        }
      : {
          contained: color(theme.dark ? white : black)
            .alpha(0.12)
            .rgb()
            .string(),
        },
    disabled: isV3
      ? {
          elevated: theme.colors.elevation.level1,
          contained: theme.colors.primary,
          'contained-tonal': theme.colors.secondaryContainer,
        }
      : {},
    default: 'transparent',
  } as ButtonTheme['buttonStyle']['backgroundColor'];
  const outlineBorderColor = color(theme.dark ? white : black)
    .alpha(0.29)
    .rgb()
    .string();
  const borderColor = {
    enabled: {
      outlined: isV3 ? theme.colors.surfaceDisabled : outlineBorderColor,
    },
    disabled: {
      outlined: isV3 ? theme.colors.outline : outlineBorderColor,
    },
    default: 'transparent',
  } as unknown as ButtonTheme['buttonStyle']['borderColor'];
  const borderWidth = {
    outlined: isV3 ? 1 : StyleSheet.hairlineWidth,
    default: 0,
  } as unknown as ButtonTheme['buttonStyle']['borderWidth'];
  const textColor = {
    getTextColor: ({ backgroundColor, isMode, disabled, dark }) =>
      getButtonTextColor({
        backgroundColor,
        isMode,
        disabled,
        dark,
        theme,
      }),
  } as ButtonTheme['buttonStyle']['textColor'];

  const font = isV3 ? theme.fonts.labelLarge : theme.fonts.medium;
  const borderRadius = isV3 ? 5 : 1;
  const iconSize = isV3 ? 18 : 16;

  const buttonTheme = {
    elevation,
    font,
    borderRadius,
    iconSize,
    iconStyle,
    textStyle,
    surfaceStyle,
    buttonStyle: { backgroundColor, borderColor, borderWidth, textColor },
  };

  return buttonTheme;
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
