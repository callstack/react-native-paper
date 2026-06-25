import * as React from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Platform,
  Pressable,
  ViewStyle,
} from 'react-native';

import Animated from 'react-native-reanimated';

import { useTooltipFade } from './hooks';
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
  const { rendered, measurement, fadeStyle, onLayout, childrenWrapperRef } =
    useTooltipFade(theme, visible);

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
    clearHideTimer();
    setVisible(true);
  }, [clearHideTimer]);

  const hide = React.useCallback(() => {
    clearShowTimer();
    setVisible(false);
  }, [clearShowTimer]);

  const scheduleHide = React.useCallback(() => {
    clearShowTimer();
    hideTimer.current = setTimeout(() => setVisible(false), leaveTouchDelay);
  }, [clearShowTimer, leaveTouchDelay]);

  // Mobile: a tap toggles the tooltip.
  const handlePress = React.useCallback(() => {
    setVisible((v) => !v);
    clearShowTimer();
    clearHideTimer();
  }, [clearShowTimer, clearHideTimer]);

  // Web: open on hover (with a short enter delay) and on keyboard focus.
  const handleHoverIn = React.useCallback(() => {
    clearHideTimer();
    showTimer.current = setTimeout(() => setVisible(true), enterTouchDelay);
  }, [clearHideTimer, enterTouchDelay]);

  // Trigger props handed to the consumer's render function.
  const triggerProps: TooltipRichTriggerProps =
    Platform.OS === 'web'
      ? {
          onHoverIn: handleHoverIn,
          onHoverOut: scheduleHide,
          onFocus: show,
          onBlur: scheduleHide,
        }
      : { onPress: handlePress };

  // Web only: keep the tooltip open while the pointer travels from the trigger
  // into the tooltip (and re-schedule the hide once it leaves the tooltip).
  const tooltipHoverProps =
    Platform.OS === 'web'
      ? { onHoverIn: clearHideTimer, onHoverOut: scheduleHide }
      : {};

  return (
    <>
      {rendered && (
        <Portal>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            accessibilityHint="Dismisses the tooltip"
            onPress={hide}
            pointerEvents={visible ? 'auto' : 'none'}
            style={StyleSheet.absoluteFill}
            testID="tooltip-rich-backdrop"
          />
          <Animated.View
            onLayout={onLayout}
            style={[
              styles.container,
              getTooltipPosition(measurement),
              fadeStyle,
            ]}
            testID="tooltip-rich-container"
          >
            <Pressable {...tooltipHoverProps} testID="tooltip-rich-surface">
              <Surface
                elevation={Tokens.rich.elevation}
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
      <Pressable
        ref={childrenWrapperRef}
        collapsable={false}
        style={styles.pressContainer}
        testID="tooltip-rich-trigger"
        // On web the wrapper carries the hover/focus handlers because the
        // trigger element (e.g. `IconButton`) doesn't reliably forward them.
        // On mobile the press handler stays on the trigger itself (via
        // `triggerProps` below) so the wrapper doesn't double-fire the toggle.
        {...(Platform.OS === 'web' ? triggerProps : null)}
      >
        {children(triggerProps)}
      </Pressable>
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
