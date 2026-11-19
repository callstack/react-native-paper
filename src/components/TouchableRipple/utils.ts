import type { ColorValue, ViewStyle } from 'react-native';

import type { PressableProps, PressableStateCallbackType } from './Pressable';
import type { InternalTheme } from '../../theme/types';

const getUnderlayColor = ({
  calculatedRippleColor,
  underlayColor,
}: {
  calculatedRippleColor: ColorValue;
  underlayColor?: string;
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
  underlayColor?: string;
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

// The plain View a touchable renders without a handler has nothing to press, so
// its render prop and style function always see this idle state. Matches the
// state shape Pressable passes.
export const IDLE_STATE: PressableStateCallbackType = {
  pressed: false,
  hovered: false,
  focused: false,
};

export const resolveChildren = (
  children: PressableProps['children'],
  state: PressableStateCallbackType
) => (typeof children === 'function' ? children(state) : children);

/**
 * The hover layer of a touchable on web. It is a background image, so it
 * paints on top of a background color that `style` sets, such as the color of
 * a selected row, and it keeps the border radius of the touchable.
 */
export const getHoverStyle = (hoverColor: ColorValue): ViewStyle => ({
  backgroundImage: `linear-gradient(${String(hoverColor)}, ${String(hoverColor)})`,
});
