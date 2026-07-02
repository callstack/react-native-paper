import { ColorValue } from 'react-native';

import { Size, Tokens, Variant } from './tokens';
import type { TypescaleKey } from '../../theme/types';
import { contentColorFor } from '../../theme/utils/color';
import { resolveCornerRadius, ShapeToken } from '../../theme/utils/shape';
import type { InternalTheme } from '../../types';

export type ResolvedColors = {
  container: ColorValue;
  content: ColorValue;
};

/**
 * Resolve container + content colors. Explicit overrides win; when only
 * `containerColor` is set, the content color is derived via
 * `contentColorFor`.
 */
export const resolveColors = ({
  theme,
  variant = 'tonalPrimary',
  containerColor,
  contentColor,
}: {
  theme: InternalTheme;
  variant?: Variant;
  containerColor?: ColorValue;
  contentColor?: ColorValue;
}): ResolvedColors => {
  const roles = Tokens.variants[variant];
  const container = containerColor ?? theme.colors[roles.container];
  const content =
    contentColor ??
    (containerColor != null
      ? contentColorFor(theme, container)
      : theme.colors[roles.content]);
  return { container, content };
};

export type Dimensions = {
  height: number;
  width: number;
  borderRadius: number;
  iconSize: number;
  leading: number;
  trailing: number;
  iconLabelGap: number;
  labelTypescale: TypescaleKey;
};

/**
 * Resolve geometry for a FAB at a given size, with optional shape, icon
 * size, and leading/trailing overrides for FAB Menu items and the close
 * button.
 */
export const getDimensions = ({
  theme,
  size = 'default',
  shape,
  iconSize,
  leading,
  trailing,
}: {
  theme: InternalTheme;
  size?: Size;
  shape?: ShapeToken;
  iconSize?: number;
  leading?: number;
  trailing?: number;
}): Dimensions => {
  const spec = Tokens.sizes[size];
  const shapeToken: ShapeToken = shape ?? spec.shape;
  return {
    height: spec.container,
    width: spec.container,
    borderRadius: resolveCornerRadius(theme, shapeToken),
    iconSize: iconSize ?? spec.icon,
    leading: leading ?? spec.leading,
    trailing: trailing ?? spec.trailing,
    iconLabelGap: spec.iconLabelGap,
    labelTypescale: spec.labelTypescale,
  };
};
