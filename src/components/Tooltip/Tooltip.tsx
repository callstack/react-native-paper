import * as React from 'react';
import {
  Dimensions,
  View,
  LayoutChangeEvent,
  StyleSheet,
  Platform,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import { addEventListener } from '../../utils/addEventListener';
import Portal from '../Portal/Portal';
import Text from '../Typography/Text';
import { getTooltipPosition, Measurement } from './utils';

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
};

/**
 * Tooltips display informative text when users hover over, focus on, or tap an element.
 *
 * Plain tooltips, when activated, display a text label identifying an element, such as a description of its function. Tooltips should include only short, descriptive text and avoid restating visible UI text.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/tooltip.png" />
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
  const touched = React.useRef(false);

  const isWeb = Platform.OS === 'web';

  React.useEffect(() => {
    return () => {
      if (showTooltipTimer.current) {
        clearTimeout(showTooltipTimer.current);
      }

      if (hideTooltipTimer.current) {
        clearTimeout(hideTooltipTimer.current);
      }
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
    if (hideTooltipTimer.current) {
      clearTimeout(hideTooltipTimer.current);
    }

    showTooltipTimer.current = setTimeout(() => {
      touched.current = true;
      setVisible(true);
    }, enterTouchDelay) as unknown as NodeJS.Timeout;
  };

  const handleTouchEnd = () => {
    touched.current = false;
    if (showTooltipTimer.current) {
      clearTimeout(showTooltipTimer.current);
    }

    hideTooltipTimer.current = setTimeout(() => {
      setVisible(false);
      setMeasurement({ children: {}, tooltip: {}, measured: false });
    }, leaveTouchDelay) as unknown as NodeJS.Timeout;
  };

  const mobilePressProps = {
    onPress: React.useCallback(() => {
      if (touched.current) {
        return null;
      } else {
        return children.props.onPress?.();
      }
    }, [children.props]),
  };

  const webPressProps = {
    onHoverIn: () => {
      handleTouchStart();
      children.props.onHoverIn?.();
    },
    onHoverOut: () => {
      handleTouchEnd();
      children.props.onHoverOut?.();
    },
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
      >
        {React.cloneElement(children, {
          ...rest,
          ref: childrenWrapperRef,
          ...(isWeb ? webPressProps : mobilePressProps),
        })}
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
