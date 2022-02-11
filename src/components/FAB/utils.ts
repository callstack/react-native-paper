import color from 'color';
import {
  Animated,
  I18nManager,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import type { MD3Colors, Theme } from '../../types';
import { white, black } from '../../styles/themes/v2/colors';
import getContrastingColor from '../../utils/getContrastingColor';

export type FABVariant = 'primary' | 'secondary' | 'tertiary' | 'surface';

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

export const getFABColors = (
  theme: Theme,
  variant: string,
  disabled?: boolean,
  customColor?: string,
  style?: StyleProp<ViewStyle>
) => {
  const { isV3 } = theme;
  const isSurfaceVariant = variant === 'surface';

  // FAB disabled color
  const disabledColor = isV3
    ? theme.colors.surfaceDisabled
    : color(theme.dark ? white : black)
        .alpha(0.12)
        .rgb()
        .string();

  // FAB backgroundColor
  const backgroundVariantColor = `${variant}${
    isSurfaceVariant ? '' : 'Container'
  }` as keyof MD3Colors;
  const foregroundVariantColor = `on${
    variant.charAt(0).toUpperCase() + variant.slice(1)
  }${isSurfaceVariant ? '' : 'Container'}` as keyof MD3Colors;
  const {
    backgroundColor = disabled
      ? disabledColor
      : isV3
      ? theme.colors[backgroundVariantColor]
      : theme.colors?.accent,
  } = StyleSheet.flatten<ViewStyle>(style) || {};

  // FAB foregroundColor
  let foregroundColor: string;
  if (typeof customColor !== 'undefined') {
    foregroundColor = customColor;
  } else if (disabled) {
    foregroundColor = isV3
      ? theme.colors.onSurfaceDisabled
      : color(theme.dark ? white : black)
          .alpha(0.32)
          .rgb()
          .string();
  } else {
    foregroundColor = isV3
      ? theme.colors[foregroundVariantColor]
      : getContrastingColor(
          backgroundColor || white,
          white,
          'rgba(0, 0, 0, .54)'
        );
  }

  return {
    backgroundColor,
    foregroundColor,
  };
};
