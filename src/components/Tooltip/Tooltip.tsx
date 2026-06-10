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

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Tokens } from './tokens';
import { getTooltipPosition, Measurement, TooltipChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../types';
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
 * For tooltips with a title, supporting text and action buttons, see `Tooltip.Rich`.
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
  const reduceMotion = useReduceMotion();
  // `visible` is the show/hide intent; `rendered` keeps the tooltip mounted
  // through the exit fade so it can animate out before unmounting.
  const [visible, setVisible] = React.useState(false);
  const [rendered, setRendered] = React.useState(false);

  const [measurement, setMeasurement] = React.useState({
    children: {},
    tooltip: {},
    measured: false,
  });
  const showTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);
  const hideTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);

  const childrenWrapperRef = React.useRef<View>(null);
  const touched = React.useRef(false);

  const opacity = useSharedValue(0);
  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  const enterConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration[Tokens.motion.enter.duration],
      easing: Easing.bezier(...theme.motion.easing[Tokens.motion.enter.easing]),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion, reanimatedReduceMotion]
  );
  const exitConfig = React.useMemo(
    () => ({
      duration: theme.motion.duration[Tokens.motion.exit.duration],
      easing: Easing.bezier(...theme.motion.easing[Tokens.motion.exit.easing]),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion, reanimatedReduceMotion]
  );
  // The visual fade-out is handled by Reanimated; the actual unmount is
  // deferred by this same duration so the fade can play. Reduce-motion skips
  // the wait entirely.
  const exitDurationMs = reduceMotion
    ? 0
    : theme.motion.duration[Tokens.motion.exit.duration];

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

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

  // Mount as soon as the tooltip is requested.
  React.useEffect(() => {
    if (visible) {
      setRendered(true);
    }
  }, [visible]);

  // Drive the fade and defer unmount until the exit animation has played.
  React.useEffect(() => {
    if (!rendered) {
      return;
    }

    if (visible) {
      // Hold at 0 until measured so the tooltip never flashes at the wrong
      // position, then fade in.
      opacity.value = measurement.measured ? withTiming(1, enterConfig) : 0;
      return;
    }

    opacity.value = withTiming(0, exitConfig);
    const id = setTimeout(() => {
      setRendered(false);
      setMeasurement({ children: {}, tooltip: {}, measured: false });
    }, exitDurationMs) as unknown as NodeJS.Timeout;

    return () => clearTimeout(id);
  }, [
    visible,
    rendered,
    measurement.measured,
    opacity,
    enterConfig,
    exitConfig,
    exitDurationMs,
  ]);

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
      {rendered && (
        <Portal>
          <Animated.View
            onLayout={handleOnLayout}
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors[Tokens.plain.container],
                ...getTooltipPosition(
                  measurement as Measurement,
                  children as React.ReactElement<TooltipChildProps>
                ),
                borderRadius: theme.shapes.corner[Tokens.plain.shape],
              },
              animatedStyle,
            ]}
            testID="tooltip-container"
          >
            <Text
              accessibilityLiveRegion="polite"
              numberOfLines={1}
              selectable={false}
              variant={Tokens.plain.typescale}
              style={{ color: theme.colors[Tokens.plain.content] }}
              maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
            >
              {title}
            </Text>
          </Animated.View>
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
    paddingHorizontal: Tokens.plain.paddingHorizontal,
    height: Tokens.plain.height,
    maxHeight: Tokens.plain.height,
  },
  pressContainer: {
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default Tooltip;
