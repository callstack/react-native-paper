import { Dimensions, StyleSheet } from 'react-native';
import type { LayoutRectangle, StyleProp, ViewStyle } from 'react-native';

type ChildrenMeasurement = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type TooltipLayout = LayoutRectangle;

export type Measurement = {
  children: ChildrenMeasurement;
  tooltip: TooltipLayout;
  measured: boolean;
};

export type TooltipChildProps = {
  style: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

const EDGE_MARGIN = 8;

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

  return childrenY + childrenHeight + tooltipHeight > layoutHeight;
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
  if (overflowBottom(childrenY, childrenHeight, tooltipHeight))
    return childrenY - tooltipHeight;

  return childrenY + childrenHeight;
};

const getChildrenMeasures = (
  style: StyleProp<ViewStyle>,
  measures: ChildrenMeasurement
): ChildrenMeasurement => {
  const { position, top, bottom, left, right } = StyleSheet.flatten(style);

  if (position === 'absolute') {
    let pageX = 0;
    let pageY = measures.pageY;
    let height = 0;
    let width = 0;
    if (typeof left === 'number') {
      pageX = left;
      width = 0;
    }
    if (typeof right === 'number') {
      pageX = measures.width - right;
      width = 0;
    }
    if (typeof top === 'number') {
      pageY = pageY + top;
    }
    if (typeof bottom === 'number') {
      pageY = pageY - bottom;
    }

    return { pageX, pageY, width, height };
  }

  return measures;
};

export const getTooltipPosition = (
  { children, tooltip, measured }: Measurement,
  childStyle?: StyleProp<ViewStyle>
): {} | { left: number; top: number } => {
  if (!measured) return {};
  let measures = children;
  if (childStyle) {
    measures = getChildrenMeasures(childStyle, children);
  }

  return {
    left: getTooltipXPosition(measures, tooltip),
    top: getTooltipYPosition(measures, tooltip),
  };
};
