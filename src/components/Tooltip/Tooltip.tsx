import * as React from 'react';
import { Dimensions, StyleSheet, Platform, View } from 'react-native';
import type { PointerEvent, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import { takeSingletonSlot, useTooltipFade } from './hooks';
import { Tokens } from './tokens';
import { getTooltipPosition } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { addEventListener } from '../../utils/addEventListener';
import Portal from '../Portal/Portal';
import Text from '../Typography/Text';

/**
 * Props passed to the `children` render function. Spread them onto the trigger
 * element (and merge with your own handlers when you have them).
 */
export type TooltipTriggerProps = {
  onLongPress?: () => void;
  onPressOut?: () => void;
  delayLongPress?: number;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
};

export type Props = {
  /**
   * Render function returning the trigger element. The provided props wire the
   * tooltip's show/hide behavior and must be spread onto the returned element:
   *
   * ```js
   * <Tooltip title="Selected Camera">
   *   {(props) => <IconButton {...props} icon="camera" selected size={24} onPress={() => {}} />}
   * </Tooltip>
   * ```
   */
  children: (props: TooltipTriggerProps) => React.ReactElement;
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
 *     {(props) => <IconButton {...props} icon="camera" selected size={24} onPress={() => {}} />}
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
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  // `visible` is the show/hide intent; the fade hook keeps the tooltip mounted
  // through the exit animation and owns the measurement + opacity.
  const [visible, setVisible] = React.useState(false);
  const { rendered, measurement, fadeStyle, onLayout, childrenWrapperRef } =
    useTooltipFade(theme, visible);

  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  React.useEffect(() => {
    const subscription = addEventListener(Dimensions, 'change', () =>
      setVisible(false)
    );

    return () => subscription.remove();
  }, []);

  const handleTouchStart = React.useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }

    if (Platform.OS === 'web') {
      showTimer.current = setTimeout(() => {
        takeSingletonSlot(() => setVisible(false));
        setVisible(true);
      }, enterTouchDelay);
    } else {
      takeSingletonSlot(() => setVisible(false));
      setVisible(true);
    }
  }, [enterTouchDelay]);

  const handleTouchEnd = React.useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = setTimeout(() => setVisible(false), leaveTouchDelay);
  }, [leaveTouchDelay]);

  // On web, pointer events on the wrapper View handle hover without going
  // through RNW's Pressable lock/unlock mechanism that caused flicker.
  // Long-press in triggerProps lets touchscreen-web users still trigger it.
  //
  // Guard against spurious pointerleave events (e.g. fired when the tooltip
  // renders in the Portal): only start the hide timer when the cursor has
  // actually left the wrapper bounds. In JSDOM getBoundingClientRect() returns
  // a zero-size rect, so the check is skipped and tests continue to pass.
  const handlePointerLeave = React.useCallback(
    (e?: PointerEvent) => {
      if (Platform.OS === 'web' && e?.nativeEvent) {
        const el = childrenWrapperRef.current as unknown as HTMLElement | null;
        if (el) {
          const { clientX, clientY } = e.nativeEvent;
          const rect = el.getBoundingClientRect();
          if (
            (rect.width > 0 || rect.height > 0) &&
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            return;
          }
        }
      }
      handleTouchEnd();
    },
    [handleTouchEnd, childrenWrapperRef]
  );

  const wrapperPointerProps =
    Platform.OS === 'web'
      ? { onPointerEnter: handleTouchStart, onPointerLeave: handlePointerLeave }
      : {};

  const triggerProps: TooltipTriggerProps = {
    onLongPress: handleTouchStart,
    onPressOut: handleTouchEnd,
    delayLongPress: enterTouchDelay,
  };

  return (
    <>
      {rendered && (
        <Portal>
          <Animated.View
            onLayout={onLayout}
            pointerEvents="none"
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors[Tokens.plain.container],
                ...getTooltipPosition(measurement),
                borderRadius: theme.shapes.corner[Tokens.plain.shape],
              },
              fadeStyle,
            ]}
            testID="tooltip-container"
          >
            <Text
              aria-live="polite"
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
      <View
        ref={childrenWrapperRef}
        collapsable={false}
        style={styles.pressContainer}
        testID="tooltip-trigger"
        {...wrapperPointerProps}
      >
        {children(triggerProps)}
      </View>
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
