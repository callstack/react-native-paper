import { RefObject } from 'react';
import { ColorValue, Platform } from 'react-native';

import {
  FloatingActionButtonSize,
  FloatingActionButtonTokens,
  FloatingActionButtonVariant,
} from './tokens';
import type { TypescaleKey } from '../../theme/types';
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
}: {
  theme: InternalTheme;
  variant?: FloatingActionButtonVariant;
  containerColor?: ColorValue;
  contentColor?: ColorValue;
}): ResolvedColors => {
  const roles = FloatingActionButtonTokens.variants[variant];
  const container = theme.colors[roles.container];
  const content = theme.colors[roles.content];
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
  size?: FloatingActionButtonSize;
  shape?: ShapeToken;
  iconSize?: number;
  leading?: number;
  trailing?: number;
}): Dimensions => {
  const spec = FloatingActionButtonTokens.sizes[size];
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

export const getLabelSizeWeb = (ref: RefObject<HTMLElement | null>) => {
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

let cachedContext: CanvasRenderingContext2D | null = null;

const getCanvasContext = () => {
  if (cachedContext) {
    return cachedContext;
  }

  const canvas = document.createElement('canvas');
  cachedContext = canvas.getContext('2d');

  return cachedContext;
};
