import { MutableRefObject } from 'react';
import { Animated, ColorValue, Platform, ViewStyle } from 'react-native';

import type { InternalTheme } from '../../types';

type GetCombinedStylesProps = {
  isAnimatedFromRight: boolean;
  isIconStatic: boolean;
  isRTL: boolean;
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
  theme: InternalTheme;
};

export const getCombinedStyles = ({
  isAnimatedFromRight,
  isIconStatic,
  isRTL,
  distance,
  animFAB,
}: GetCombinedStylesProps): CombinedStyles => {
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
  customBackgroundColor,
}: BaseProps & { customBackgroundColor?: ColorValue }) => {
  if (customBackgroundColor) {
    return customBackgroundColor;
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
    return theme.colors.surfaceContainerHigh;
  }

  return theme.colors.primaryContainer;
};

const getForegroundColor = ({
  theme,
  isVariant,
  customColor,
}: BaseProps & { customColor?: string }) => {
  if (typeof customColor !== 'undefined') {
    return customColor;
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

  return theme.colors.onPrimaryContainer;
};

export const getFABColors = ({
  theme,
  variant,
  customColor,
  customBackgroundColor,
}: {
  theme: InternalTheme;
  variant: string;
  customColor?: string;
  customBackgroundColor?: ColorValue;
}) => {
  const isVariant = (variantToCompare: Variant) => {
    return variant === variantToCompare;
  };

  const baseFABColorProps = { theme, isVariant };

  const backgroundColor = getBackgroundColor({
    ...baseFABColorProps,
    customBackgroundColor,
  });

  const foregroundColor = getForegroundColor({
    ...baseFABColorProps,
    customColor,
  });

  return {
    backgroundColor,
    foregroundColor,
  };
};

const getLabelColor = ({ theme }: { theme: InternalTheme }) => {
  return theme.colors.onSurface;
};

const getStackedFABBackgroundColor = ({ theme }: { theme: InternalTheme }) => {
  return theme.colors.surfaceContainerHigh;
};

export const getFABGroupColors = ({
  theme,
  customBackdropColor,
}: {
  theme: InternalTheme;
  customBackdropColor?: string;
}) => {
  return {
    labelColor: getLabelColor({ theme }),
    backdropColor: customBackdropColor ?? theme.colors.background,
    backdropOpacity: customBackdropColor ? 1 : 0.95,
    stackedFABBackgroundColor: getStackedFABBackgroundColor({ theme }),
  };
};

const v3SmallSize = {
  height: 40,
  width: 40,
};
const v3MediumSize = {
  height: 56,
  width: 56,
};
const v3LargeSize = {
  height: 96,
  width: 96,
};

const getCustomFabSize = (customSize: number, roundness: number) => ({
  height: customSize,
  width: customSize,
  borderRadius: roundness === 0 ? 0 : customSize / roundness,
});

export const getFabStyle = ({
  size,
  theme,
  customSize,
}: {
  customSize?: number;
  size: 'small' | 'medium' | 'large';
  theme: InternalTheme;
}) => {
  const { roundness } = theme;

  if (customSize) return getCustomFabSize(customSize, roundness);

  switch (size) {
    case 'small':
      return { ...v3SmallSize, borderRadius: 3 * roundness };
    case 'medium':
      return { ...v3MediumSize, borderRadius: 4 * roundness };
    case 'large':
      return { ...v3LargeSize, borderRadius: 7 * roundness };
  }
};

const v3Extended = {
  height: 56,
  borderRadius: 16,
  paddingHorizontal: 16,
};

const getExtendedFabDimensions = (customSize: number) => ({
  height: customSize,
  paddingHorizontal: 16,
});

export const getExtendedFabStyle = ({
  customSize,
  theme: _theme,
}: {
  customSize?: number;
  theme: InternalTheme;
}) => {
  if (customSize) return getExtendedFabDimensions(customSize);

  return v3Extended;
};

let cachedContext: CanvasRenderingContext2D | null = null;

const getCanvasContext = () => {
  if (cachedContext) {
    return cachedContext;
  }

  const canvas = document.createElement('canvas');
  cachedContext = canvas.getContext('2d');

  return cachedContext;
};

export const getLabelSizeWeb = (ref: MutableRefObject<HTMLElement | null>) => {
  if (Platform.OS !== 'web' || ref.current === null) {
    return null;
  }

  const canvasContext = getCanvasContext();

  if (!canvasContext) {
    return null;
  }

  const elementStyles = window.getComputedStyle(ref.current);
  canvasContext.font = elementStyles.font;

  const metrics = canvasContext.measureText(ref.current.innerText);

  return {
    width: metrics.width,
    height:
      (metrics.fontBoundingBoxAscent ?? 0) +
      (metrics.fontBoundingBoxDescent ?? 0),
  };
};
