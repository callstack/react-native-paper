import { Animated, I18nManager, ViewStyle } from 'react-native';

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
