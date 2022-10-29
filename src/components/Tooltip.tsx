import * as React from 'react';
import {
  Dimensions,
  View,
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../core/theming';
import { addEventListener } from '../utils/addEventListener';
import Portal from './Portal/Portal';
import Text from './Typography/Text';

export type Props = {
  /**
   * Tooltip reference element. Needs to be able to hold a ref.
   */
  children: React.ReactElement;
  /**
   * The number of milliseconds a user must touch the element before showing the tooltip.
   */
  enterTouchDelay?: number;
  /**
   * The number of milliseconds after the user stops touching an element before hiding the tooltip.
   */
  leaveTouchDelay?: number;
  /**
   * Tooltip title
   */
  title: string;
  /**
   * Style for the wrapper view
   */
  wrapperStyle?: StyleProp<ViewStyle>;
};

type ChildrenMeasurement = {
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

type TooltipLayout = LayoutRectangle;

type Measurement = {
  children: ChildrenMeasurement;
  tooltip: TooltipLayout;
  measured: boolean;
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
  const center = childrenX + (childrenWidth - tooltipWidth) / 2;

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

const getTooltipPosition = ({
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

/**
 * Tooltips display informative text when users hover over, focus on, or tap an element.
 *
 * Plain tooltips, when activated, display a text label identifying an element, such as a description of its function. Tooltips should include only short, descriptive text and avoid restating visible UI text.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/TODO.png" />
 *     <figcaption>TODO</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { IconButton, Tooltip } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Tooltip title="Selected Camera">
 *     <IconButton icon="camera" selected size={24} onPress={() => {}} />
 *   </Tooltip>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Tooltip = ({
  children,
  enterTouchDelay = 500,
  leaveTouchDelay = 1500,
  title,
  wrapperStyle,
  ...rest
}: Props) => {
  const theme = useInternalTheme();
  const [visible, setVisible] = React.useState(false);
  const [measurement, setMeasurement] = React.useState({
    children: {},
    tooltip: {},
    measured: false,
  });
  const showTooltipTimer = React.useRef<NodeJS.Timeout>();
  const hideTooltipTimer = React.useRef<NodeJS.Timeout>();
  const childrenWrapperRef = React.useRef() as React.MutableRefObject<View>;

  React.useEffect(() => {
    return () => {
      if (showTooltipTimer.current) clearTimeout(showTooltipTimer.current);
      if (hideTooltipTimer.current) clearTimeout(hideTooltipTimer.current);
    };
  }, []);

  React.useEffect(() => {
    const subscription = addEventListener(Dimensions, 'change', () =>
      setVisible(false)
    );

    return () => subscription.remove();
  }, []);

  const handleOnLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    childrenWrapperRef.current.measure(
      (_x, _y, width, height, pageX, pageY) => {
        setMeasurement({
          children: { pageX, pageY, height, width },
          tooltip: { ...layout },
          measured: true,
        });
      }
    );
  };

  const handleTouchStart = () => {
    if (hideTooltipTimer.current) clearTimeout(hideTooltipTimer.current);

    showTooltipTimer.current = setTimeout(
      () => setVisible(true),
      enterTouchDelay
    ) as unknown as NodeJS.Timeout;
  };

  const handleTouchEnd = () => {
    if (showTooltipTimer.current) clearTimeout(showTooltipTimer.current);

    hideTooltipTimer.current = setTimeout(() => {
      setVisible(false);
      setMeasurement({ children: {}, tooltip: {}, measured: false });
    }, leaveTouchDelay) as unknown as NodeJS.Timeout;
  };

  return (
    <>
      {visible && (
        <Portal>
          <View
            onLayout={handleOnLayout}
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.isV3
                  ? theme.colors.onSurface
                  : theme.colors.tooltip,
                ...getTooltipPosition(measurement as Measurement),
                borderRadius: theme.roundness,
                ...(measurement.measured ? styles.visible : styles.hidden),
              },
            ]}
            testID="tooltip-container"
          >
            <Text
              accessibilityLiveRegion="polite"
              numberOfLines={1}
              selectable={false}
              variant="labelLarge"
              style={{ color: theme.colors.surface }}
            >
              {title}
            </Text>
          </View>
        </Portal>
      )}
      <View
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={wrapperStyle}
      >
        {React.cloneElement(children, { ...rest, ref: childrenWrapperRef })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 32,
    maxHeight: 32,
  },
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
});

export default Tooltip;
