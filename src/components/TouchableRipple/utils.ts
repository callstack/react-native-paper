import * as React from 'react';
import type { ColorValue } from 'react-native';

import type { PressableProps, PressableStateCallbackType } from './Pressable';
import type { InternalTheme } from '../../theme/types';

const getUnderlayColor = ({
  calculatedRippleColor,
  underlayColor,
}: {
  calculatedRippleColor: ColorValue;
  underlayColor?: ColorValue;
}) => {
  if (underlayColor != null) {
    return underlayColor;
  }

  return calculatedRippleColor;
};

const getRippleColor = ({
  theme,
  rippleColor,
}: {
  theme: InternalTheme;
  rippleColor?: ColorValue;
}) => {
  if (rippleColor) {
    return rippleColor;
  }

  return theme.colors.stateLayerPressed;
};

export const getTouchableRippleColors = ({
  theme,
  rippleColor,
  underlayColor,
}: {
  theme: InternalTheme;
  rippleColor?: ColorValue;
  underlayColor?: ColorValue;
}): {
  calculatedRippleColor: ColorValue;
  calculatedUnderlayColor: ColorValue;
} => {
  const calculatedRippleColor = getRippleColor({ theme, rippleColor });
  return {
    calculatedRippleColor,
    calculatedUnderlayColor: getUnderlayColor({
      calculatedRippleColor,
      underlayColor,
    }),
  };
};

export const resolveChildren = (
  children: PressableProps['children'],
  state: PressableStateCallbackType
) =>
  React.Children.only(
    typeof children === 'function' ? children(state) : children
  );
