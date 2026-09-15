import { Dimensions } from 'react-native';
import type { LayoutRectangle, View } from 'react-native';

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
  ref?: React.Ref<View>;
  disabled?: boolean;
  onPress?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

/**
 * Return true when the tooltip center x-coordinate relative to the wrapped element is negative.
 * The tooltip will be placed at the starting x-coordinate from the wrapped element.
 */
const overflowLeft = (center: number): boolean => {
  return center < 0;
};

/**
 * Return true when the tooltip center x-coordinate + tooltip width is greater than the layout width
 * The tooltip width will grow from right to left relative to the wrapped element.
 */
const overflowRight = (center: number, tooltipWidth: number): boolean => {
  const { width: layoutWidth } = Dimensions.get('window');

  return center + tooltipWidth > layoutWidth;
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

  if (overflowLeft(center)) return childrenX;

  if (overflowRight(center, tooltipWidth))
    return childrenX + childrenWidth - tooltipWidth;

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

export const getTooltipPosition = ({
  children,
  tooltip,
  measured,
}: Measurement): {} | { left: number; top: number } => {
  if (!measured) return {};

  return {
    left: getTooltipXPosition(children, tooltip),
    top: getTooltipYPosition(children, tooltip),
  };
};
