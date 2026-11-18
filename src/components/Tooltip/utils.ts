import { Dimensions, PixelRatio, Platform } from 'react-native';
import type { LayoutRectangle } from 'react-native';

import type { Direction } from '../../core/locale';

type ChildrenMeasurement = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type TooltipLayout = LayoutRectangle;

export type Measurement = {
  // viewport coordinates, as `measure` reports them
  children: ChildrenMeasurement;
  tooltip: TooltipLayout;
  // Web only: page scroll when measured, as the portal sits at the document
  // origin
  scroll: { x: number; y: number };
  measured: boolean;
};

const EDGE_MARGIN = 8;
const ANCHOR_GAP = 4;

/**
 * Return true when the tooltip center x-coordinate relative to the wrapped element is negative.
 * The tooltip will be placed at the starting x-coordinate from the wrapped element.
 */
const overflowLeft = (center: number): boolean => {
  return center < EDGE_MARGIN;
};

/**
 * Return true when the tooltip center x-coordinate + tooltip width is greater than the layout width
 * The tooltip width will grow from right to left relative to the wrapped element.
 */
const overflowRight = (center: number, tooltipWidth: number): boolean => {
  const { width: layoutWidth } = Dimensions.get('window');

  return center + tooltipWidth > layoutWidth - EDGE_MARGIN;
};

/**
 * Return true when the children y-coordinate + its height + tooltip height is greater than the layout height.
 * The tooltip will be placed at the top of the wrapped element.
 */
const overflowBottom = (
  childrenY: number,
  childrenHeight: number,
  tooltipHeight: number
): boolean => {
  const { height: layoutHeight } = Dimensions.get('window');

  return childrenY + childrenHeight + ANCHOR_GAP + tooltipHeight > layoutHeight;
};

const getTooltipXPosition = (
  { pageX: childrenX, width: childrenWidth }: ChildrenMeasurement,
  { width: tooltipWidth }: TooltipLayout
): number => {
  // when the children use position absolute the childrenWidth is measured as 0,
  // so it's best to anchor the tooltip at the start of the children
  const center =
    childrenWidth > 0
      ? childrenX + (childrenWidth - tooltipWidth) / 2
      : childrenX;

  if (overflowLeft(center)) return Math.max(EDGE_MARGIN, childrenX);

  if (overflowRight(center, tooltipWidth)) {
    const { width: layoutWidth } = Dimensions.get('window');
    return Math.min(
      childrenX + childrenWidth - tooltipWidth,
      layoutWidth - tooltipWidth - EDGE_MARGIN
    );
  }

  return center;
};

const getTooltipYPosition = (
  { pageY: childrenY, height: childrenHeight }: ChildrenMeasurement,
  { height: tooltipHeight }: TooltipLayout
): number => {
  // A tooltip too tall for either side stays on screen over the trigger
  if (overflowBottom(childrenY, childrenHeight, tooltipHeight))
    return Math.max(EDGE_MARGIN, childrenY - ANCHOR_GAP - tooltipHeight);

  return childrenY + childrenHeight + ANCHOR_GAP;
};

export const isWithinRect = (
  pointX: number,
  pointY: number,
  { x, y, width, height }: LayoutRectangle
): boolean =>
  pointX >= x && pointX <= x + width && pointY >= y && pointY <= y + height;

type PointerPosition = { clientX: number; clientY: number };

/**
 * Web only: pointer leave also fires spuriously, e.g. when the tooltip mounts
 * in the portal, so a leave is only real once the pointer is outside the
 * element's bounds.
 */
export const isPointerInside = (
  element: { getBoundingClientRect?(): DOMRect } | null,
  { clientX, clientY }: PointerPosition
): boolean => {
  const rect = element?.getBoundingClientRect?.();

  return rect !== undefined && isWithinRect(clientX, clientY, rect);
};

export const getTooltipPosition = (
  { children, tooltip, scroll, measured }: Measurement,
  direction: Direction = 'ltr'
): { left?: number; top?: number } => {
  if (!measured) return {};

  let left = getTooltipXPosition(children, tooltip);
  const top = getTooltipYPosition(children, tooltip);

  if (direction === 'rtl') {
    // `measure` reports the physical left edge, but in RTL the tooltip starts
    // at the right one: native resolves `left` from it, and on web the tooltip
    // isn't absolutely positioned, so `left` offsets it from there.
    const trailingOffset =
      Dimensions.get('window').width - tooltip.width - left;
    left = Platform.OS === 'web' ? -trailingOffset : trailingOffset;
  }

  return Platform.OS === 'web'
    ? { left: left + scroll.x, top: top + scroll.y }
    : {
        left: PixelRatio.roundToNearestPixel(left),
        top: PixelRatio.roundToNearestPixel(top),
      };
};
