import color from 'color';
import {
  Animated,
  I18nManager,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import type { Theme } from '../../types';
import { white, black } from '../../styles/themes/v2/colors';
import getContrastingColor from '../../utils/getContrastingColor';

type GetCombinedStylesProps = {
  isAnimatedFromRight: boolean;
  isIconStatic: boolean;
  distance: number;
  animFAB: Animated.Value;
};

type CombinedStyles = {
  innerWrapper: Animated.WithAnimatedValue<ViewStyle>;
  iconWrapper: Animated.WithAnimatedValue<ViewStyle>;
  absoluteFill: Animated.WithAnimatedValue<ViewStyle>;
};

type Variant = 'primary' | 'secondary' | 'tertiary' | 'surface';

type BaseProps = {
  isVariant: (variant: Variant) => boolean;
  theme: Theme;
  disabled?: boolean;
};

export const getCombinedStyles = ({
  isAnimatedFromRight,
  isIconStatic,
  distance,
  animFAB,
}: GetCombinedStylesProps): CombinedStyles => {
  const { isRTL } = I18nManager;

  const defaultPositionStyles = { left: -distance, right: undefined };

  const combinedStyles: CombinedStyles = {
    innerWrapper: {
      ...defaultPositionStyles,
    },
    iconWrapper: {
      ...defaultPositionStyles,
    },
    absoluteFill: {},
  };

  const animatedFromRight = isAnimatedFromRight && !isRTL;
  const animatedFromRightRTL = isAnimatedFromRight && isRTL;
  const animatedFromLeft = !isAnimatedFromRight && !isRTL;
  const animatedFromLeftRTL = !isAnimatedFromRight && isRTL;

  if (animatedFromRight) {
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [distance, 0],
        }),
      },
    ];
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic ? 0 : animFAB,
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [Math.abs(distance) / 2, Math.abs(distance)],
        }),
      },
    ];
  } else if (animatedFromRightRTL) {
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic
          ? 0
          : animFAB.interpolate({
              inputRange: [distance, 0],
              outputRange: [-distance, 0],
            }),
      },
    ];
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [-distance, 0],
        }),
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [distance, 0],
          outputRange: [0, distance],
        }),
      },
    ];
  } else if (animatedFromLeft) {
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic
          ? distance
          : animFAB.interpolate({
              inputRange: [0, distance],
              outputRange: [distance, distance * 2],
            }),
      },
    ];
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB,
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [0, distance],
          outputRange: [0, Math.abs(distance) / 2],
        }),
      },
    ];
  } else if (animatedFromLeftRTL) {
    combinedStyles.iconWrapper.transform = [
      {
        translateX: isIconStatic
          ? animFAB.interpolate({
              inputRange: [0, distance],
              outputRange: [-distance, -distance * 2],
            })
          : -distance,
      },
    ];
    combinedStyles.innerWrapper.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }),
      },
    ];
    combinedStyles.absoluteFill.transform = [
      {
        translateX: animFAB.interpolate({
          inputRange: [0, distance],
          outputRange: [0, -distance],
        }),
      },
    ];
  }

  return combinedStyles;
};

const getBackgroundColor = ({
  theme,
  isVariant,
  disabled,
  style,
}: BaseProps & { style?: StyleProp<ViewStyle> }) => {
  const { backgroundColor } = StyleSheet.flatten(style) || {};
  if (backgroundColor && !disabled) {
    return backgroundColor;
  }

  if (theme.isV3) {
    if (disabled) {
      return theme.colors.surfaceDisabled;
    }

    if (isVariant('primary')) {
      return theme.colors.primaryContainer;
    }

    if (isVariant('secondary')) {
      return theme.colors.secondaryContainer;
    }

    if (isVariant('tertiary')) {
      return theme.colors.tertiaryContainer;
    }

    if (isVariant('surface')) {
      return theme.colors.elevation.level3;
    }
  }

  if (disabled) {
    if (theme.dark) {
      return color(white).alpha(0.12).rgb().string();
    }
    return color(black).alpha(0.12).rgb().string();
  }

  //@ts-ignore
  return theme.colors?.accent;
};

const getForegroundColor = ({
  theme,
  isVariant,
  disabled,
  backgroundColor,
  customColor,
}: BaseProps & { backgroundColor: string; customColor?: string }) => {
  if (typeof customColor !== 'undefined' && !disabled) {
    return customColor;
  }

  if (theme.isV3) {
    if (disabled) {
      return theme.colors.onSurfaceDisabled;
    }

    if (isVariant('primary')) {
      return theme.colors.onPrimaryContainer;
    }

    if (isVariant('secondary')) {
      return theme.colors.onSecondaryContainer;
    }

    if (isVariant('tertiary')) {
      return theme.colors.onTertiaryContainer;
    }

    if (isVariant('surface')) {
      return theme.colors.primary;
    }
  }

  if (disabled) {
    if (theme.dark) {
      return color(white).alpha(0.32).rgb().string();
    }
    return color(black).alpha(0.32).rgb().string();
  }

  if (backgroundColor) {
    return getContrastingColor(
      backgroundColor || white,
      white,
      'rgba(0, 0, 0, .54)'
    );
  }

  return getContrastingColor(white, white, 'rgba(0, 0, 0, .54)');
};

export const getFABColors = ({
  theme,
  variant,
  disabled,
  customColor,
  style,
}: {
  theme: Theme;
  variant: string;
  disabled?: boolean;
  customColor?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const isVariant = (variantToCompare: Variant) => {
    return variant === variantToCompare;
  };

  const baseFABColorProps = { theme, isVariant, disabled };

  const backgroundColor = getBackgroundColor({
    ...baseFABColorProps,
    style,
  });

  const foregroundColor = getForegroundColor({
    ...baseFABColorProps,
    customColor,
    backgroundColor,
  });

  return {
    backgroundColor,
    foregroundColor,
    rippleColor: color(foregroundColor).alpha(0.12).rgb().string(),
  };
};
