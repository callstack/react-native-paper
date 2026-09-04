import type { ColorValue } from 'react-native';

import { IconButtonTokens } from './tokens';
import type { ColorSet, Mode, Shape, Size, Width } from './tokens';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { ShapeToken } from '../../theme/utils/shape';
import type { InternalTheme } from '../../types';

const stateOpacity = tokens.md.sys.state.opacity;

export type IconButtonColors = {
  iconColor: ColorValue;
  iconOpacity: number;
  backgroundColor: ColorValue | undefined;
  backgroundOpacity: number;
  borderColor: ColorValue;
  borderWidth: number;
};

export type IconButtonDimensions = {
  width: number;
  height: number;
  iconSize: number;
  outlineWidth: number;
  restingRadius: number;
  pressedRadius: number;
};

const colorSetFor = (mode: Mode, selected: boolean | undefined): ColorSet => {
  if (selected === true) {
    return IconButtonTokens.modes[mode].selected;
  }
  if (selected === false) {
    return IconButtonTokens.modes[mode].unselected;
  }
  return IconButtonTokens.modes[mode].default;
};

const hasDisabledContainer = (
  mode: Mode,
  selected: boolean | undefined
): boolean => {
  if (mode === 'filled' || mode === 'tonal') {
    return true;
  }
  return mode === 'outlined' && selected === true;
};

/**
 * Resolve container, icon, and outline colors for an icon button.
 *
 * `selected` is a tri-state: `undefined` is the default (non-toggle)
 * appearance; `true`/`false` are the toggle-ON / toggle-OFF color sets.
 */
export const getIconButtonColor = ({
  theme,
  disabled,
  mode = 'standard',
  selected,
  customIconColor,
  customContainerColor,
  outlineWidth = 0,
}: {
  theme: InternalTheme;
  disabled?: boolean;
  mode?: Mode;
  selected?: boolean;
  customIconColor?: ColorValue;
  customContainerColor?: ColorValue;
  outlineWidth?: number;
}): IconButtonColors => {
  const iconOpacity = disabled ? stateOpacity.disabled : stateOpacity.enabled;
  const usesDisabledContainer =
    Boolean(disabled) && hasDisabledContainer(mode, selected);

  if (usesDisabledContainer) {
    return {
      iconColor:
        customIconColor ?? theme.colors[IconButtonTokens.disabled.icon],
      iconOpacity,
      backgroundColor: theme.colors[IconButtonTokens.disabled.container],
      backgroundOpacity: IconButtonTokens.disabled.containerOpacity,
      borderColor: theme.colors[IconButtonTokens.disabled.outline],
      borderWidth: 0,
    };
  }

  if (disabled) {
    const set = colorSetFor(mode, selected);
    return {
      iconColor:
        customIconColor ?? theme.colors[IconButtonTokens.disabled.icon],
      iconOpacity,
      backgroundColor: customContainerColor,
      backgroundOpacity: stateOpacity.enabled,
      borderColor:
        theme.colors[set.outline ?? IconButtonTokens.disabled.outline],
      borderWidth: set.outline ? outlineWidth : 0,
    };
  }

  const set = colorSetFor(mode, selected);
  const backgroundColor =
    customContainerColor ??
    (set.container ? theme.colors[set.container] : undefined);

  return {
    iconColor: customIconColor ?? theme.colors[set.icon],
    iconOpacity,
    backgroundColor,
    backgroundOpacity: stateOpacity.enabled,
    borderColor: theme.colors[set.outline ?? 'outlineVariant'],
    borderWidth: set.outline ? outlineWidth : 0,
  };
};

/**
 * Resting container shape. Toggle-ON inverts round↔square; pressed uses
 * the shared pressed shape (same for round and square).
 */
export const resolveShapeToken = ({
  size = 'small',
  shape = 'round',
  selected,
  pressed = false,
}: {
  size?: Size;
  shape?: Shape;
  selected?: boolean;
  pressed?: boolean;
}): ShapeToken => {
  const spec = IconButtonTokens.sizes[size];
  if (pressed) {
    return spec.pressedShape;
  }
  const inverted = selected === true;
  if (shape === 'round') {
    return inverted ? spec.squareShape : 'full';
  }
  return inverted ? 'full' : spec.squareShape;
};

export const getDimensions = ({
  theme,
  size = 'small',
  width = 'default',
  shape = 'round',
  selected,
  iconSize,
}: {
  theme: InternalTheme;
  size?: Size;
  width?: Width;
  shape?: Shape;
  selected?: boolean;
  iconSize?: number;
}): IconButtonDimensions => {
  const spec = IconButtonTokens.sizes[size];
  const padding = spec.widths[width];
  const resolvedIcon = iconSize ?? spec.icon;
  const height = spec.containerHeight;
  const containerWidth = resolvedIcon + padding.leading + padding.trailing;

  const restingToken = resolveShapeToken({
    size,
    shape,
    selected,
    pressed: false,
  });
  const pressedToken = resolveShapeToken({
    size,
    shape,
    selected,
    pressed: true,
  });

  const roundRadius = height / 2;
  const resolveRadius = (token: ShapeToken) =>
    token === 'full' ? roundRadius : resolveCornerRadius(theme, token);

  return {
    width: containerWidth,
    height,
    iconSize: resolvedIcon,
    outlineWidth: spec.outlineWidth,
    restingRadius: resolveRadius(restingToken),
    pressedRadius: resolveRadius(pressedToken),
  };
};

export const getHitSlop = (width: number, height: number) => {
  const min = IconButtonTokens.minTouchTarget;
  const extraX = Math.max(0, (min - width) / 2);
  const extraY = Math.max(0, (min - height) / 2);
  if (extraX === 0 && extraY === 0) {
    return undefined;
  }
  return { top: extraY, bottom: extraY, left: extraX, right: extraX };
};
