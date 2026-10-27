import * as React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import type { PointerEvent, ViewStyle } from 'react-native';

import Reanimated from 'react-native-reanimated';

import {
  takeSingletonSlot,
  useTooltipFade,
  registerRichTrigger,
  unregisterRichTrigger,
  forwardPressToTriggerAt,
  subscribeToTriggerRefresh,
} from './hooks';
import type { TooltipHostElement } from './hooks';
import { Tokens } from './tokens';
import { getTooltipPosition } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import { addEventListener } from '../../utils/addEventListener';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import Text from '../Typography/Text';

const AnimatedSurface = Reanimated.createAnimatedComponent(Surface);

// Tooltip renders in a portal at the end of document, so keyboard
// users reach its actions by moving focus into 1st focusable element
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Props passed to the `children` render function. Spread them onto the trigger
 * element (and merge with your own handlers when you have them).
 */
export type TooltipRichTriggerProps = {
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: { key?: string }) => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
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
  const { direction } = useLocale();
  // `visible` is the show/hide intent; the fade hook keeps the tooltip mounted
  // through the exit animation and owns the measurement + opacity.
  const [visible, setVisible] = React.useState(false);
  const { rendered, measurement, fadeStyle, onLayout, childrenWrapperRef } =
    useTooltipFade(theme, visible);
  const tooltipId = React.useId();
  // Web only: a non-touch pointer sits on the trigger
  const hoveringRef = React.useRef(false);
  const tooltipRef = React.useRef<TooltipHostElement>(null);
  // Web only: set while dismiss is returning focus to the trigger
  const refocusAfterDismissRef = React.useRef(false);

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

  // Web only: tooltip opens on trigger focus, so it has to ignore the focus
  // that Escape itself causes; later focus (or any blur) re-arms it
  const handleFocus = React.useCallback(() => {
    if (refocusAfterDismissRef.current) {
      refocusAfterDismissRef.current = false;
      return;
    }
    show();
  }, [show]);

  const handleBlur = React.useCallback(() => {
    refocusAfterDismissRef.current = false;
    scheduleHide();
  }, [scheduleHide]);

  // Mobile: a tap toggles the tooltip.
  // takeSingletonSlot must be called outside the setVisible updater — calling
  // setVisible inside an updater queues it for a later render, so the dismiss
  // of the stale slot would undo the show on the same cycle.
  const handlePress = React.useCallback(() => {
    if (Platform.OS === 'web' && visible && hoveringRef.current) {
      clearShowTimer();
      clearHideTimer();
      return;
    }

    if (!visible) {
      takeSingletonSlot(() => setVisible(false));
      setVisible(true);
    } else {
      setVisible(false);
    }
    clearShowTimer();
    clearHideTimer();
  }, [visible, clearShowTimer, clearHideTimer]);

  // Web: open on hover (with a short enter delay) and on keyboard focus. Touch
  // pointer is skipped - tap both enters & presses and only the press half
  // should act so taps keep toggling the tooltip
  const handlePointerEnter = React.useCallback(
    (e?: PointerEvent) => {
      if (e?.nativeEvent?.pointerType === 'touch') {
        return;
      }

      hoveringRef.current = true;
      clearHideTimer();
      showTimer.current = setTimeout(() => {
        takeSingletonSlot(() => setVisible(false));
        setVisible(true);
      }, enterTouchDelay);
    },
    [clearHideTimer, enterTouchDelay]
  );

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

      hoveringRef.current = false;
      scheduleHide();
    },
    [scheduleHide, childrenWrapperRef]
  );

  const wrapperPointerProps =
    Platform.OS === 'web'
      ? {
          onPointerEnter: handlePointerEnter,
          onPointerLeave: handlePointerLeave,
        }
      : {};

  // Web only: `Tab` walks the document, and the tooltip renders in a portal at
  // its end, so the trigger needs a key that moves focus into the actions.
  const focusTooltipContent = React.useCallback(() => {
    // The tooltip mounts through the portal on the render that opens it, so
    // wait for that commit: from this one the node isn't reachable yet and
    // focus requested while it's missing is simply lost
    setTimeout(() => {
      tooltipRef.current?.querySelector?.(FOCUSABLE_SELECTOR)?.focus?.();
    }, 0);
  }, []);

  const focusTrigger = React.useCallback(() => {
    const wrapper = childrenWrapperRef.current;
    (wrapper?.querySelector?.(FOCUSABLE_SELECTOR) ?? wrapper)?.focus?.();
  }, [childrenWrapperRef]);

  const handleKeyDown = React.useCallback(
    (event: { key?: string }) => {
      if (event.key === 'ArrowDown') {
        show();
        focusTooltipContent();
      }
    },
    [show, focusTooltipContent]
  );

  // Web: Escape dismisses the tooltip the way the backdrop does on touch and
  // puts focus back on the trigger so it's not lost
  const handleKeypress = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        refocusAfterDismissRef.current = true;
        hide();
        focusTrigger();
      }
    },
    [hide, focusTrigger]
  );

  React.useEffect(() => {
    if (Platform.OS !== 'web' || !visible || !('document' in global)) {
      return;
    }

    document.addEventListener('keyup', handleKeypress);

    return () => document.removeEventListener('keyup', handleKeypress);
  }, [visible, handleKeypress]);

  // accessible name for trigger without its own label
  const description =
    typeof content === 'string'
      ? [title, content].filter(Boolean).join('. ')
      : title;

  const triggerProps: TooltipRichTriggerProps =
    Platform.OS === 'web'
      ? {
          onPress: handlePress,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onKeyDown: handleKeyDown,
          'aria-describedby': tooltipId,
        }
      : { onPress: handlePress, 'aria-label': description };

  // Web only: keep the tooltip open while the pointer or the focus travels from
  // the trigger into the tooltip, and re-schedule the hide once it leaves. A
  // plain `View` carries these — a `Pressable` would be focusable and merge its
  // children into one accessibility element on iOS, so the title, the content
  // and the actions would stop being reachable on their own.
  const tooltipInteractionProps =
    Platform.OS === 'web'
      ? {
          onHoverIn: clearHideTimer,
          onHoverOut: scheduleHide,
          onFocus: clearHideTimer,
          onBlur: scheduleHide,
        }
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
    childrenWrapperRef.current?.measure(
      (_x, _y, width, height, pageX, pageY) => {
        registerRichTrigger(triggerId, {
          pageX,
          pageY,
          width,
          height,
          onPress: () => handlePressRef.current(),
        });
      }
    );
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
            role="button"
            aria-label="Close"
            onPress={handleBackdropPress}
            pointerEvents={visible && Platform.OS !== 'web' ? 'auto' : 'none'}
            style={StyleSheet.absoluteFill}
          />
          <Reanimated.View
            ref={tooltipRef}
            id={tooltipId}
            nativeID={tooltipId}
            role="tooltip"
            onLayout={onLayout}
            pointerEvents="box-none"
            style={[
              styles.container,
              getTooltipPosition(measurement, direction),
            ]}
          >
            <View {...tooltipInteractionProps}>
              <AnimatedSurface
                elevation={Tokens.rich.elevation}
                backgroundColor={theme.colors[Tokens.rich.container]}
                borderRadius={theme.shapes.corner[Tokens.rich.shape]}
                style={[styles.surface, fadeStyle]}
              >
                {title ? (
                  <Text
                    aria-live="polite"
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
                    aria-live="polite"
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
                  <View style={styles.actions}>
                    {actions({ dismiss: hide })}
                  </View>
                ) : null}
              </AnimatedSurface>
            </View>
          </Reanimated.View>
        </Portal>
      )}
      <View
        ref={childrenWrapperRef}
        collapsable={false}
        onLayout={updateTriggerRegistration}
        style={styles.pressContainer}
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
    paddingTop: Tokens.rich.paddingTop,
    paddingBottom: Tokens.rich.paddingBottom,
    rowGap: Tokens.rich.gap,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  pressContainer: {
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default RichTooltip;
