import * as React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Platform,
  Pressable,
  ViewStyle,
} from 'react-native';
import type { PointerEvent, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import {
  takeSingletonSlot,
  useTooltipFade,
  registerRichTrigger,
  unregisterRichTrigger,
  forwardPressToTriggerAt,
  subscribeToTriggerRefresh,
} from './hooks';
import { Tokens } from './tokens';
import { getTooltipPosition } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { addEventListener } from '../../utils/addEventListener';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import Text from '../Typography/Text';

/**
 * Props passed to the `children` render function. Spread them onto the trigger
 * element (and merge with your own handlers when you have them).
 */
export type TooltipRichTriggerProps = {
  onPress?: () => void;
  onHoverIn?: () => void;
  onHoverOut?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export type Props = {
  /**
   * Render function returning the trigger element. The provided props wire the
   * tooltip's show/hide behavior and must be spread onto the returned element:
   *
   * ```js
   * <Tooltip.Rich content="...">
   *   {(props) => <IconButton {...props} icon="plus" />}
   * </Tooltip.Rich>
   * ```
   */
  children: (props: TooltipRichTriggerProps) => React.ReactElement;
  /**
   * Optional subhead shown above the content.
   */
  title?: string;
  /**
   * Supporting body text. A string is rendered with the `bodyMedium` type
   * style; pass an element to compose inline links or custom content.
   */
  content: string | React.ReactElement;
  /**
   * Render function for the action buttons (and/or links) shown in a row below
   * the content. Call `dismiss` from an action to hide the tooltip:
   *
   * ```js
   * actions={({ dismiss }) => (
   *   <Button onPress={() => { doThing(); dismiss(); }}>Learn more</Button>
   * )}
   * ```
   */
  actions?: (props: { dismiss: () => void }) => React.ReactNode;
  /**
   * The number of milliseconds a user must hover the element before showing
   * the tooltip (web only).
   */
  enterTouchDelay?: number;
  /**
   * The number of milliseconds after the pointer leaves both the trigger and
   * the tooltip before hiding it (web only).
   */
  leaveTouchDelay?: number;
  /**
   * Specifies the largest possible scale the title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * Specifies the largest possible scale the content font can reach.
   */
  contentMaxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Rich tooltips display informative text along with an optional subhead and
 * action buttons. Unlike plain tooltips they are persistent and interactive:
 * tap the element to toggle the tooltip, then tap outside or an action to
 * dismiss it. On web they open on hover and on keyboard focus.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, IconButton, Tooltip } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Tooltip.Rich
 *     title="Add to library"
 *     content="Save this item to read it later."
 *     actions={({ dismiss }) => (
 *       <Button compact onPress={dismiss}>
 *         Learn more
 *       </Button>
 *     )}
 *   >
 *     {(props) => <IconButton {...props} icon="plus" />}
 *   </Tooltip.Rich>
 * );
 *
 * export default MyComponent;
 * ```
 */
const RichTooltip = ({
  children,
  title,
  content,
  actions,
  enterTouchDelay = 100,
  leaveTouchDelay = 500,
  titleMaxFontSizeMultiplier,
  contentMaxFontSizeMultiplier,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  // `visible` is the show/hide intent; the fade hook keeps the tooltip mounted
  // through the exit animation and owns the measurement + opacity.
  const [visible, setVisible] = React.useState(false);
  const {
    rendered,
    measurement,
    fadeStyle,
    onLayout,
    childrenWrapperRef,
    enterDuration,
  } = useTooltipFade(theme, visible);

  // Android: elevation shadows don't participate in opacity compositing.
  // Keep elevation at 0 during the enter fade so there's no grey-border
  // artifact, then add it exactly when the content reaches full opacity.
  const [elevationReady, setElevationReady] = React.useState(false);
  React.useEffect(() => {
    if (Platform.OS !== 'android') {
      setElevationReady(true);
      return;
    }
    if (visible && measurement.measured) {
      const id = setTimeout(() => setElevationReady(true), enterDuration);
      return () => clearTimeout(id);
    }
    setElevationReady(false);
    return undefined;
  }, [visible, measurement.measured, enterDuration]);

  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearShowTimer = React.useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
  }, []);

  const clearHideTimer = React.useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearShowTimer();
      clearHideTimer();
    };
  }, [clearShowTimer, clearHideTimer]);

  React.useEffect(() => {
    const subscription = addEventListener(Dimensions, 'change', () =>
      setVisible(false)
    );

    return () => subscription.remove();
  }, []);

  const show = React.useCallback(() => {
    takeSingletonSlot(() => setVisible(false));
    clearHideTimer();
    setVisible(true);
  }, [clearHideTimer]);

  const hide = React.useCallback(() => {
    clearShowTimer();
    setVisible(false);
  }, [clearShowTimer]);

  const scheduleHide = React.useCallback(() => {
    clearShowTimer();
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(() => setVisible(false), leaveTouchDelay);
  }, [clearShowTimer, leaveTouchDelay]);

  // Mobile: a tap toggles the tooltip.
  // takeSingletonSlot must be called outside the setVisible updater — calling
  // setVisible inside an updater queues it for a later render, so the dismiss
  // of the stale slot would undo the show on the same cycle.
  const handlePress = React.useCallback(() => {
    if (!visible) {
      takeSingletonSlot(() => setVisible(false));
      setVisible(true);
    } else {
      setVisible(false);
    }
    clearShowTimer();
    clearHideTimer();
  }, [visible, clearShowTimer, clearHideTimer]);

  // Web: open on hover (with a short enter delay) and on keyboard focus.
  const handleHoverIn = React.useCallback(() => {
    clearHideTimer();
    showTimer.current = setTimeout(() => {
      takeSingletonSlot(() => setVisible(false));
      setVisible(true);
    }, enterTouchDelay);
  }, [clearHideTimer, enterTouchDelay]);

  // On web, pointer events on the wrapper View handle hover without going
  // through RNW's Pressable lock/unlock mechanism that caused flicker.
  // Guard against spurious pointerleave: only schedule hide when cursor has
  // actually left wrapper bounds (same reasoning as Tooltip.tsx).
  const handlePointerLeave = React.useCallback(
    (e?: PointerEvent) => {
      if (Platform.OS === 'web' && e?.nativeEvent) {
        const el = childrenWrapperRef.current;
        if (el?.getBoundingClientRect) {
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
      scheduleHide();
    },
    [scheduleHide, childrenWrapperRef]
  );

  const wrapperPointerProps =
    Platform.OS === 'web'
      ? { onPointerEnter: handleHoverIn, onPointerLeave: handlePointerLeave }
      : {};

  const triggerProps: TooltipRichTriggerProps =
    Platform.OS === 'web'
      ? { onFocus: show, onBlur: scheduleHide }
      : { onPress: handlePress };

  // Web only: keep the tooltip open while the pointer travels from the trigger
  // into the tooltip (and re-schedule the hide once it leaves the tooltip).
  const tooltipHoverProps =
    Platform.OS === 'web'
      ? { onHoverIn: clearHideTimer, onHoverOut: scheduleHide }
      : {};

  // Mobile: stable id + ref for the latest handlePress, used by the global
  // trigger registry so the backdrop can forward taps to another trigger.
  const triggerId = React.useRef<symbol>(Symbol()).current;
  const handlePressRef = React.useRef(handlePress);
  React.useEffect(() => {
    handlePressRef.current = handlePress;
  }, [handlePress]);

  const updateTriggerRegistration = React.useCallback(() => {
    if (Platform.OS === 'web') return;
    childrenWrapperRef.current?.measureInWindow?.((x, y, width, height) => {
      registerRichTrigger(triggerId, {
        pageX: x,
        pageY: y,
        width,
        height,
        onPress: () => handlePressRef.current(),
      });
    });
  }, [childrenWrapperRef, triggerId]);

  React.useEffect(() => {
    return () => {
      unregisterRichTrigger(triggerId);
    };
  }, [triggerId]);

  // Re-measure this trigger whenever any tooltip opens so scroll-invalidated
  // coordinates are refreshed before the backdrop needs to hit-test against them.
  React.useEffect(() => {
    return subscribeToTriggerRefresh(updateTriggerRegistration);
  }, [updateTriggerRegistration]);

  const handleBackdropPress = React.useCallback(
    (e: { nativeEvent: { pageX?: number; pageY?: number } }) => {
      const pageX = e?.nativeEvent?.pageX ?? -1;
      const pageY = e?.nativeEvent?.pageY ?? -1;
      if (!forwardPressToTriggerAt(pageX, pageY)) {
        hide();
      }
    },
    [hide]
  );

  return (
    <>
      {rendered && (
        <Portal>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            accessibilityHint="Dismisses the tooltip"
            onPress={handleBackdropPress}
            pointerEvents={visible && Platform.OS !== 'web' ? 'auto' : 'none'}
            style={StyleSheet.absoluteFill}
            testID="tooltip-rich-backdrop"
          />
          <Animated.View
            onLayout={onLayout}
            pointerEvents="box-none"
            style={[
              styles.container,
              getTooltipPosition(measurement),
              fadeStyle,
            ]}
            testID="tooltip-rich-container"
          >
            <Pressable {...tooltipHoverProps} testID="tooltip-rich-surface">
              <Surface
                elevation={elevationReady ? Tokens.rich.elevation : 0}
                testID="tooltip-rich-surface-container"
                style={[
                  styles.surface,
                  {
                    backgroundColor: theme.colors[Tokens.rich.container],
                    borderRadius: theme.shapes.corner[Tokens.rich.shape],
                  },
                ]}
              >
                {title ? (
                  <Text
                    accessibilityLiveRegion="polite"
                    selectable={false}
                    variant={Tokens.rich.titleTypescale}
                    style={{ color: theme.colors[Tokens.rich.title] }}
                    maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
                  >
                    {title}
                  </Text>
                ) : null}
                {typeof content === 'string' ? (
                  <Text
                    accessibilityLiveRegion="polite"
                    selectable={false}
                    variant={Tokens.rich.contentTypescale}
                    style={{ color: theme.colors[Tokens.rich.content] }}
                    maxFontSizeMultiplier={contentMaxFontSizeMultiplier}
                  >
                    {content}
                  </Text>
                ) : (
                  content
                )}
                {actions ? (
                  <View style={styles.actions} testID="tooltip-rich-actions">
                    {actions({ dismiss: hide })}
                  </View>
                ) : null}
              </Surface>
            </Pressable>
          </Animated.View>
        </Portal>
      )}
      <View
        ref={childrenWrapperRef}
        collapsable={false}
        onLayout={updateTriggerRegistration}
        style={styles.pressContainer}
        testID="tooltip-rich-trigger"
        {...wrapperPointerProps}
      >
        {children(triggerProps)}
      </View>
    </>
  );
};

RichTooltip.displayName = 'Tooltip.Rich';

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    maxWidth: Tokens.rich.maxWidth,
  },
  surface: {
    paddingHorizontal: Tokens.rich.paddingHorizontal,
    paddingVertical: Tokens.rich.paddingVertical,
    rowGap: Tokens.rich.gap,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pressContainer: {
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default RichTooltip;
