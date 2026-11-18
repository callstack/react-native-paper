import * as React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  PointerEvent,
  ViewStyle,
} from 'react-native';

import Reanimated from 'react-native-reanimated';
import useLatestCallback from 'use-latest-callback';

import {
  useHideOnDimensionsChange,
  useTimeout,
  useTooltipFade,
  useTouchFocusGuard,
} from './hooks';
import type { TooltipHostElement } from './hooks';
import {
  forwardPressToTriggerAt,
  refreshRichTriggers,
  registerRichTrigger,
  subscribeToTriggerRefresh,
  takeSingletonSlot,
  unregisterRichTrigger,
} from './registry';
import { Tokens } from './tokens';
import { getTooltipPosition, isPointerInside } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import { useOverlayDismiss } from '../../utils/useOverlayDismiss';
import { focusIntoContainer } from '../../utils/useOverlayFocus';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import Text from '../Typography/Text';

const AnimatedSurface = Reanimated.createAnimatedComponent(Surface);

/**
 * Props passed to the `children` render function. Spread them onto the trigger
 * element (and merge with your own handlers when you have them).
 */
export type TooltipRichTriggerProps = {
  onPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (event: NativeSyntheticEvent<{ key: string }>) => void;
  accessibilityHint?: string;
  'aria-describedby'?: string;
  'aria-haspopup'?: 'dialog';
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
};

export type Props = {
  /**
   * Render function returning the trigger element. The provided props wire the
   * tooltip's show/hide behavior and must be spread onto the returned element:
   *
   * ```js
   * <Tooltip.Rich content="...">
   *   {(props) => <IconButton {...props} icon="plus" aria-label="Add" />}
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
   * Called whenever the tooltip closes, whichever way it was dismissed: an
   * outside tap, re-pressing the trigger, an action calling `dismiss`, the
   * pointer or focus leaving (web), Escape (web), the VoiceOver escape gesture
   * (iOS), the screen size changing, or another tooltip, plain or rich, taking
   * its place. It is not called when the component unmounts with the tooltip
   * still open.
   */
  onDismiss?: () => void;
  /**
   * The number of milliseconds a user must hover the element before showing
   * the tooltip (web only).
   */
  enterTouchDelay?: number;
  /**
   * The number of milliseconds after the pointer or the focus leaves both the
   * trigger and the tooltip before hiding it (web only).
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
   * TestID used for testing purposes. Applied to the tooltip.
   */
  testID?: string;
  /**
   * TestID used for testing purposes. Applied to the backdrop that closes the
   * tooltip on a press outside it (iOS and Android).
   */
  overlayTestID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Rich tooltips display informative text along with an optional subhead and
 * action buttons. Unlike plain tooltips they are persistent and interactive:
 * tap the element to toggle the tooltip, then tap outside or an action to
 * dismiss it.
 *
 * On web they open on hover and on keyboard focus, and Escape closes them.
 * The down arrow key on the trigger moves focus into the actions, and focus
 * that was in the tooltip goes back to the trigger when Escape or an action
 * closes it.
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
 *       <Button mode="text" onPress={dismiss}>
 *         Learn more
 *       </Button>
 *     )}
 *   >
 *     {(props) => <IconButton {...props} icon="plus" aria-label="Add" />}
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
  onDismiss,
  enterTouchDelay = 100,
  leaveTouchDelay = 1500,
  titleMaxFontSizeMultiplier,
  contentMaxFontSizeMultiplier,
  testID,
  overlayTestID,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const [visible, setVisible] = React.useState(false);
  const {
    rendered,
    measurement,
    fadeStyle,
    fadeDuration,
    onLayout,
    childrenWrapperRef,
  } = useTooltipFade(theme, visible);
  const tooltipId = React.useId();
  const titleId = React.useId();
  const contentId = React.useId();
  // Web only: a non-touch pointer sits on the trigger
  const hoveringRef = React.useRef(false);
  const tooltipRef = React.useRef<TooltipHostElement>(null);
  // Web only: set while dismiss is returning focus to the trigger
  const refocusAfterDismissRef = React.useRef(false);
  const touchFocusGuard = useTouchFocusGuard();
  const wasVisibleRef = React.useRef(visible);
  const showTimer = useTimeout();
  const hideTimer = useTimeout();
  const focusTimer = useTimeout();

  const show = React.useCallback(() => {
    showTimer.clear();
    hideTimer.clear();
    takeSingletonSlot(() => setVisible(false));
    refreshRichTriggers();
    setVisible(true);
  }, [showTimer, hideTimer]);

  const hide = React.useCallback(() => {
    showTimer.clear();
    hideTimer.clear();
    setVisible(false);
  }, [showTimer, hideTimer]);

  const scheduleHide = React.useCallback(() => {
    showTimer.clear();
    hideTimer.schedule(() => setVisible(false), leaveTouchDelay);
  }, [showTimer, hideTimer, leaveTouchDelay]);

  useHideOnDimensionsChange(hide);

  // Report every dismissal from one place rather than calling the prop from
  // each path that hides the tooltip, so a future close path can't miss it
  React.useEffect(() => {
    if (wasVisibleRef.current && !visible) {
      onDismiss?.();
    }
    wasVisibleRef.current = visible;
  }, [visible, onDismiss]);

  // Web: focus inside the tooltip would be lost when it unmounts, so it goes
  // back to the trigger. Focus elsewhere, e.g. in a text input while the
  // tooltip was opened by hover, stays put.
  const hideAndRestoreFocus = () => {
    const focused =
      Platform.OS === 'web' && 'document' in global
        ? document.activeElement
        : null;
    const hadFocus =
      focused != null &&
      (tooltipRef.current?.contains?.(focused) ||
        childrenWrapperRef.current?.contains?.(focused));

    hide();
    // set before focusing, as the trigger's focus event fires during it and
    // would reopen the tooltip; cleared if the browser refused the focus
    refocusAfterDismissRef.current = Boolean(hadFocus);
    if (hadFocus && !focusIntoContainer(childrenWrapperRef.current)) {
      refocusAfterDismissRef.current = false;
    }
  };

  // Web only: tooltip opens on trigger focus, so it has to ignore the focus
  // that dismissing itself causes, and the focus a tap gives the trigger, as
  // the press that follows toggles it; later focus (or any blur) re-arms it
  const handleFocus = () => {
    const isTouchFocus = touchFocusGuard.consumeTouchFocus();
    if (refocusAfterDismissRef.current || isTouchFocus) {
      refocusAfterDismissRef.current = false;
      return;
    }
    show();
  };

  const handleBlur = () => {
    refocusAfterDismissRef.current = false;
    scheduleHide();
  };

  // On web a press on the hovered trigger keeps the tooltip open, as the hover
  // already opened it.
  const handlePress = useLatestCallback(() => {
    if (Platform.OS === 'web' && visible && hoveringRef.current) {
      showTimer.clear();
      hideTimer.clear();
    } else if (visible) {
      hide();
    } else {
      show();
    }
  });

  // A tap fires both pointer enter and press, and only the press should act so
  // taps keep toggling the tooltip
  const handlePointerEnter = React.useCallback(
    (e: PointerEvent) => {
      if (e.nativeEvent.pointerType === 'touch') {
        return;
      }

      hoveringRef.current = true;
      hideTimer.clear();
      showTimer.schedule(show, enterTouchDelay);
    },
    [showTimer, hideTimer, enterTouchDelay, show]
  );

  const handlePointerLeave = React.useCallback(
    (e: PointerEvent) => {
      if (isPointerInside(childrenWrapperRef.current, e.nativeEvent)) {
        return;
      }

      hoveringRef.current = false;
      scheduleHide();
    },
    [scheduleHide, childrenWrapperRef]
  );

  const wrapperPointerProps =
    Platform.OS === 'web'
      ? {
          onPointerDown: touchFocusGuard.onPointerDown,
          onPointerCancel: touchFocusGuard.onPointerCancel,
          onPointerEnter: handlePointerEnter,
          onPointerLeave: handlePointerLeave,
        }
      : {};

  // Web only: `Tab` walks the document, and the tooltip renders in a portal at
  // its end, so the trigger needs a key that moves focus into the actions.
  // The tooltip mounts through the portal on the render that opens it, so
  // wait for that commit: from this one the node isn't reachable yet and
  // focus requested while it's missing is simply lost
  const handleKeyDown = (event: NativeSyntheticEvent<{ key: string }>) => {
    if (actions != null && event.nativeEvent.key === 'ArrowDown') {
      // focus moves after the tooltip mounts, so the page would scroll first
      event.preventDefault();
      show();
      focusTimer.schedule(() => focusIntoContainer(tooltipRef.current), 0);
    }
  };

  // Web: the backdrop lets pointer events through, so a press outside closes
  // the tooltip here. Relying on blur misses triggers that a tap doesn't focus,
  // such as buttons in Safari.
  React.useEffect(() => {
    if (Platform.OS !== 'web' || !visible || !('document' in global)) {
      return;
    }

    const handlePointerDown = ({ target }: { target: EventTarget | null }) => {
      if (
        tooltipRef.current?.contains?.(target) ||
        childrenWrapperRef.current?.contains?.(target)
      ) {
        return;
      }
      hide();
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [visible, hide, childrenWrapperRef]);

  // Web: Escape dismisses the tooltip the way the backdrop does on touch. The
  // back button is left to the screen, as the tooltip isn't modal.
  useOverlayDismiss({
    enabled: visible && Platform.OS === 'web',
    dismissable: true,
    onDismiss: hideAndRestoreFocus,
  });

  const hasActions = actions != null;

  const description =
    typeof content === 'string'
      ? [title, content].filter(Boolean).join('. ')
      : title;

  // A tooltip can't hold focusable content, so with actions it's a non-modal
  // dialog (WAI-ARIA APG tooltip pattern). Either way the trigger is described
  // by the title and content only, without the action labels.
  const triggerProps: TooltipRichTriggerProps =
    Platform.OS === 'web'
      ? {
          onPress: handlePress,
          onFocus: handleFocus,
          onBlur: handleBlur,
          onKeyDown: handleKeyDown,
          'aria-describedby': [title ? titleId : null, contentId]
            .filter(Boolean)
            .join(' '),
          ...(hasActions && {
            'aria-haspopup': 'dialog',
            'aria-expanded': visible,
            'aria-controls': tooltipId,
          }),
        }
      : { onPress: handlePress, accessibilityHint: description };

  // Web only: keep the tooltip open while the pointer or the focus travels from
  // the trigger into the tooltip, and re-schedule the hide once it leaves. A
  // plain `View` carries these — a `Pressable` would be focusable and merge its
  // children into one accessibility element on iOS, so the title, the content
  // and the actions would stop being reachable on their own. React Native Web's
  // `View` ignores `onHoverIn`/`onHoverOut`, so pointer events are used instead.
  const tooltipInteractionProps =
    Platform.OS === 'web'
      ? {
          onPointerEnter: hideTimer.clear,
          onPointerLeave: scheduleHide,
          onFocus: hideTimer.clear,
          onBlur: scheduleHide,
        }
      : {};

  const [triggerId] = React.useState(() => Symbol());

  const updateTriggerRegistration = React.useCallback(() => {
    if (Platform.OS === 'web') return;
    childrenWrapperRef.current?.measure(
      (_x, _y, width, height, pageX, pageY) => {
        registerRichTrigger(triggerId, {
          rect: { x: pageX, y: pageY, width, height },
          onPress: handlePress,
        });
      }
    );
  }, [childrenWrapperRef, triggerId, handlePress]);

  React.useEffect(() => {
    return () => {
      unregisterRichTrigger(triggerId);
    };
  }, [triggerId]);

  React.useEffect(() => {
    return subscribeToTriggerRefresh(updateTriggerRegistration);
  }, [updateTriggerRegistration]);

  const handleBackdropPress = React.useCallback(
    ({ nativeEvent: { pageX, pageY } }: GestureResponderEvent) => {
      if (!forwardPressToTriggerAt(pageX, pageY)) {
        hide();
      }
    },
    [hide]
  );

  // web announces them through the trigger's `aria-describedby`
  const textAnnouncement = Platform.OS === 'web' ? undefined : 'polite';

  return (
    <>
      {rendered && (
        <Portal>
          <Pressable
            aria-hidden
            tabIndex={-1}
            onPress={handleBackdropPress}
            pointerEvents={visible && Platform.OS !== 'web' ? 'auto' : 'none'}
            style={StyleSheet.absoluteFill}
            testID={overlayTestID}
          />
          <Reanimated.View
            ref={tooltipRef}
            nativeID={tooltipId}
            role={hasActions ? 'dialog' : 'tooltip'}
            aria-labelledby={
              hasActions ? (title ? titleId : contentId) : undefined
            }
            onLayout={onLayout}
            onAccessibilityEscape={hide}
            pointerEvents="box-none"
            testID={testID}
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
                transitionDuration={fadeDuration}
                style={[styles.surface, fadeStyle]}
              >
                {title ? (
                  <Text
                    nativeID={titleId}
                    aria-live={textAnnouncement}
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
                    nativeID={contentId}
                    aria-live={textAnnouncement}
                    selectable={false}
                    variant={Tokens.rich.contentTypescale}
                    style={{ color: theme.colors[Tokens.rich.content] }}
                    maxFontSizeMultiplier={contentMaxFontSizeMultiplier}
                  >
                    {content}
                  </Text>
                ) : (
                  <View nativeID={contentId}>{content}</View>
                )}
                {actions ? (
                  <View style={styles.actions}>
                    {actions({ dismiss: hideAndRestoreFocus })}
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
  // RN types `cursor` as 'auto' | 'pointer', but RN Web accepts any CSS cursor
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  pressContainer: {
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default RichTooltip;
