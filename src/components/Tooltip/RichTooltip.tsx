import * as React from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';

import Reanimated from 'react-native-reanimated';
import useLatestCallback from 'use-latest-callback';

import {
  useHideOnDimensionsChange,
  useTimeout,
  useTooltipFade,
  useTriggerHover,
} from './hooks';
import type { TooltipHostElement } from './hooks';
import {
  forwardPressToTriggerAt,
  refreshRichTriggers,
  registerRichTrigger,
  releaseSingletonSlot,
  subscribeToTriggerRefresh,
  takeSingletonSlot,
  unregisterRichTrigger,
} from './registry';
import { Tokens } from './tokens';
import { useRichTooltipFocus } from './useRichTooltipFocus';
import { getActiveElement, getTooltipPosition } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import { Tokens as ButtonTokens } from '../Button/tokens';
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
   * the content. Use `extra-small` text buttons, so their labels line up with
   * the content. Call `dismiss` from an action to hide the tooltip:
   *
   * ```js
   * actions={({ dismiss }) => (
   *   <Button
   *     mode="text"
   *     size="extra-small"
   *     onPress={() => { doThing(); dismiss(); }}
   *   >
   *     Learn more
   *   </Button>
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
 *       <Button mode="text" size="extra-small" onPress={dismiss}>
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
  const tooltipRef = React.useRef<TooltipHostElement>(null);
  const wasVisibleRef = React.useRef(visible);
  const showTimer = useTimeout();
  const hideTimer = useTimeout();
  const hasActions = actions != null;

  const dismissFromSlot = React.useCallback(() => setVisible(false), []);

  const show = React.useCallback(() => {
    showTimer.clear();
    hideTimer.clear();
    takeSingletonSlot(dismissFromSlot);
    refreshRichTriggers();
    setVisible(true);
  }, [showTimer, hideTimer, dismissFromSlot]);

  React.useEffect(() => {
    if (!visible) {
      return undefined;
    }
    return () => releaseSingletonSlot(dismissFromSlot);
  }, [visible, dismissFromSlot]);

  const hide = React.useCallback(() => {
    showTimer.clear();
    hideTimer.clear();
    setVisible(false);
  }, [showTimer, hideTimer]);

  const scheduleHide = React.useCallback(() => {
    showTimer.clear();
    hideTimer.schedule(() => {
      // Web: hiding would drop focus that is inside the tooltip, so it stays
      // open until that focus leaves or Escape closes it
      const focused = getActiveElement();
      if (focused != null && tooltipRef.current?.contains?.(focused)) {
        return;
      }
      setVisible(false);
    }, leaveTouchDelay);
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

  const { hoveringRef, consumeTouchFocus, wrapperProps } = useTriggerHover({
    wrapperRef: childrenWrapperRef,
    onEnter: (isTouch) => {
      // a tap also fires a press, which toggles the tooltip
      if (isTouch) {
        return;
      }
      hideTimer.clear();
      showTimer.schedule(show, enterTouchDelay);
    },
    onLeave: scheduleHide,
  });

  const {
    triggerProps: focusTriggerProps,
    onTooltipKeyDown,
    hideAndRestoreFocus,
    isOpenedByFocus,
  } = useRichTooltipFocus({
    visible,
    hasActions,
    tooltipRef,
    triggerRef: childrenWrapperRef,
    show,
    hide,
    scheduleHide,
    consumeTouchFocus,
  });

  // On web a press on the hovered or keyboard-focused trigger keeps the
  // tooltip open, as the hover or the focus already opened it.
  const handlePress = useLatestCallback(() => {
    if (
      Platform.OS === 'web' &&
      visible &&
      (hoveringRef.current || isOpenedByFocus())
    ) {
      showTimer.clear();
      hideTimer.clear();
    } else if (visible) {
      hide();
    } else {
      show();
    }
  });

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
          ...focusTriggerProps,
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
          onKeyDown: onTooltipKeyDown,
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

  const handleBackdropPress = ({
    nativeEvent: { pageX, pageY },
  }: GestureResponderEvent) => {
    if (!forwardPressToTriggerAt(pageX, pageY)) {
      hide();
    }
  };

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
        {...wrapperProps}
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
    marginTop: Tokens.rich.actionsTopSpace - Tokens.rich.gap,
    // Aligns the labels of `extra-small` text buttons with the content
    marginStart: -ButtonTokens.sizes['extra-small'].leadingSpace,
  },
  // RN types `cursor` as 'auto' | 'pointer', but RN Web accepts any CSS cursor
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  pressContainer: {
    alignSelf: 'flex-start',
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default RichTooltip;
