import type { ColorValue } from 'react-native';

import color from 'color';

import type { PressableProps, PressableStateCallbackType } from './Pressable';
import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../theme/types';

const stateOpacity = tokens.md.sys.state.opacity;

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

/**
 * Returns the web hover layer color for a ripple color. The ripple is the
 * content color at the pressed-state opacity, so scaling its alpha by the
 * hovered-to-pressed ratio gives the content color at the hovered-state
 * opacity (per Material Design 3). A custom ripple color keeps that ratio.
 *
 * A color that is not a string (a `PlatformColor`, which web doesn't have) is
 * returned as is.
 */
export const getHoverColor = (rippleColor: ColorValue): ColorValue => {
  if (typeof rippleColor !== 'string') {
    return rippleColor;
  }

  const ripple = color(rippleColor);

  return ripple
    .alpha((ripple.alpha() * stateOpacity.hovered) / stateOpacity.pressed)
    .rgb()
    .string();
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
 * Returns the ripple / state layer color for a component's content: the
 * content color at the pressed-state opacity (per Material Design 3).
 *
 * When the content color is not a plain string (e.g. an Android Material You
 * `PlatformColor`), or is a string `color` can't parse (e.g. `var(--x)` or
 * `currentColor` on web), `undefined` is returned so `TouchableRipple` falls
 * back to its own default state-layer color.
 */
export const getRippleColorFromContent = ({
  contentColor,
}: {
  contentColor: ColorValue;
}): ColorValue | undefined => {
  if (typeof contentColor !== 'string') {
    return undefined;
  }

  try {
    return color(contentColor).alpha(stateOpacity.pressed).rgb().string();
  } catch {
    return undefined;
  }
};
