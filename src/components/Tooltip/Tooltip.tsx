import * as React from 'react';
import {
  Dimensions,
  View,
  LayoutChangeEvent,
  StyleSheet,
  Platform,
  Pressable,
  ViewStyle,
} from 'react-native';

import type { ThemeProp } from 'src/types';

import { getTooltipPosition, Measurement, TooltipChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import { addEventListener } from '../../utils/addEventListener';
import Portal from '../Portal/Portal';
import Text from '../Typography/Text';

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
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Tooltips display informative text when users hover over, focus on, or tap an element.
 *
 * Plain tooltips, when activated, display a text label identifying an element, such as a description of its function. Tooltips should include only short, descriptive text and avoid restating visible UI text.
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
  theme: themeOverrides,
  titleMaxFontSizeMultiplier,
  ...rest
}: Props) => {
  const isWeb = Platform.OS === 'web';

  const theme = useInternalTheme(themeOverrides);
  const [visible, setVisible] = React.useState(false);

  const [measurement, setMeasurement] = React.useState({
    children: {},
    tooltip: {},
    measured: false,
  });
  const showTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);
  const hideTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);

  const childrenWrapperRef = React.useRef<View>(null);
  const touched = React.useRef(false);

  const isValidChild = React.useMemo(
    () => React.isValidElement<TooltipChildProps>(children),
    [children]
  );

  React.useEffect(() => {
    return () => {
      if (showTooltipTimer.current.length) {
        showTooltipTimer.current.forEach((t) => clearTimeout(t));
        showTooltipTimer.current = [];
      }

      if (hideTooltipTimer.current.length) {
        hideTooltipTimer.current.forEach((t) => clearTimeout(t));
        hideTooltipTimer.current = [];
      }
    };
  }, []);

  React.useEffect(() => {
    const subscription = addEventListener(Dimensions, 'change', () =>
      setVisible(false)
    );

    return () => subscription.remove();
  }, []);

  const handleTouchStart = React.useCallback(() => {
    if (hideTooltipTimer.current.length) {
      hideTooltipTimer.current.forEach((t) => clearTimeout(t));
      hideTooltipTimer.current = [];
    }

    if (isWeb) {
      let id = setTimeout(() => {
        touched.current = true;
        setVisible(true);
      }, enterTouchDelay) as unknown as NodeJS.Timeout;
      showTooltipTimer.current.push(id);
    } else {
      touched.current = true;
      setVisible(true);
    }
  }, [isWeb, enterTouchDelay]);

  const handleTouchEnd = React.useCallback(() => {
    touched.current = false;
    if (showTooltipTimer.current.length) {
      showTooltipTimer.current.forEach((t) => clearTimeout(t));
      showTooltipTimer.current = [];
    }

    let id = setTimeout(() => {
      setVisible(false);
      setMeasurement({ children: {}, tooltip: {}, measured: false });
    }, leaveTouchDelay) as unknown as NodeJS.Timeout;
    hideTooltipTimer.current.push(id);
  }, [leaveTouchDelay]);

  const handlePress = React.useCallback(() => {
    if (touched.current) {
      return null;
    }
    if (!isValidChild) return null;
    const props = children.props as TooltipChildProps;
    if (props.disabled) return null;
    return props.onPress?.();
  }, [children.props, isValidChild]);

  const handleHoverIn = React.useCallback(() => {
    handleTouchStart();
    if (isValidChild) {
      (children.props as TooltipChildProps).onHoverIn?.();
    }
  }, [children.props, handleTouchStart, isValidChild]);

  const handleHoverOut = React.useCallback(() => {
    handleTouchEnd();
    if (isValidChild) {
      (children.props as TooltipChildProps).onHoverOut?.();
    }
  }, [children.props, handleTouchEnd, isValidChild]);

  const handleOnLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    childrenWrapperRef.current?.measure(
      (_x, _y, width, height, pageX, pageY) => {
        setMeasurement({
          children: { pageX, pageY, height, width },
          tooltip: { ...layout },
          measured: true,
        });
      }
    );
  };

  const mobilePressProps = {
    onPress: handlePress,
    onLongPress: () => handleTouchStart(),
    onPressOut: () => handleTouchEnd(),
    delayLongPress: enterTouchDelay,
  };

  const webPressProps = {
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
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
                ...getTooltipPosition(
                  measurement as Measurement,
                  children as React.ReactElement<TooltipChildProps>
                ),
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
              maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
            >
              {title}
            </Text>
          </View>
        </Portal>
      )}
      <Pressable
        ref={childrenWrapperRef}
        style={styles.pressContainer}
        {...(isWeb ? webPressProps : mobilePressProps)}
      >
        {React.cloneElement(children, {
          ...rest,
          ...(isWeb ? webPressProps : mobilePressProps),
        })}
      </Pressable>
    </>
  );
};

Tooltip.displayName = 'Tooltip';

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
  pressContainer: {
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default Tooltip;
