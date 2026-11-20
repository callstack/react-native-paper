import * as React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { PointerEvent, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import {
  useHideOnDimensionsChange,
  useTimeout,
  useTooltipFade,
  useTouchFocusGuard,
} from './hooks';
import { releaseSingletonSlot, takeSingletonSlot } from './registry';
import { Tokens } from './tokens';
import { getTooltipPosition, isPointerInside } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import { useOverlayDismiss } from '../../utils/useOverlayDismiss';
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
  onFocus?: () => void;
  onBlur?: () => void;
  'aria-label'?: string;
  'aria-describedby'?: string;
  accessibilityHint?: string;
};

export type Props = {
  /**
   * Render function returning the trigger element. The provided props wire the
   * tooltip's show/hide behavior and must be spread onto the returned element:
   *
   * ```js
   * <Tooltip title="Selected Camera" titleAsAriaLabel>
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
   * Uses the title as the trigger's accessible name instead of its description.
   * Set it for a trigger without a visible label, such as an icon button. Leave
   * it off when the trigger has its own name, or the title replaces it.
   */
  titleAsAriaLabel?: boolean;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * TestID used for testing purposes. Applied to the tooltip.
   */
  testID?: string;
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
 *   <Tooltip title="Selected Camera" titleAsAriaLabel>
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
  titleAsAriaLabel = false,
  theme: themeOverrides,
  titleMaxFontSizeMultiplier,
  testID,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const [visible, setVisible] = React.useState(false);
  const { rendered, measurement, fadeStyle, onLayout, childrenWrapperRef } =
    useTooltipFade(theme, visible);
  const tooltipId = React.useId();
  const showTimer = useTimeout();
  const hideTimer = useTimeout();
  // Web only: a non-touch pointer sits on the trigger
  const hoveringRef = React.useRef(false);
  const touchFocusGuard = useTouchFocusGuard();

  const hide = React.useCallback(() => setVisible(false), []);

  useHideOnDimensionsChange(hide);

  React.useEffect(() => {
    if (!visible) {
      return undefined;
    }
    return () => releaseSingletonSlot(hide);
  }, [visible, hide]);

  // Web: Escape closes it, as focus alone keeps it open
  useOverlayDismiss({
    enabled: visible && Platform.OS === 'web',
    dismissable: true,
    onDismiss: hide,
  });

  const show = React.useCallback(() => {
    showTimer.clear();
    hideTimer.clear();
    takeSingletonSlot(hide);
    setVisible(true);
  }, [showTimer, hideTimer, hide]);

  const handleTouchStart = React.useCallback(() => {
    if (Platform.OS === 'web') {
      hideTimer.clear();
      showTimer.schedule(show, enterTouchDelay);
    } else {
      show();
    }
  }, [show, showTimer, hideTimer, enterTouchDelay]);

  const handleTouchEnd = React.useCallback(() => {
    showTimer.clear();
    hideTimer.schedule(hide, leaveTouchDelay);
  }, [showTimer, hideTimer, hide, leaveTouchDelay]);

  // Web: releasing a click on the hovered trigger mustn't hide the tooltip
  // the hover opened; the pointer leaving does
  const handlePressOut = React.useCallback(() => {
    if (Platform.OS === 'web' && hoveringRef.current) {
      return;
    }
    handleTouchEnd();
  }, [handleTouchEnd]);

  // On web, pointer events on the wrapper View handle hover without going
  // through RNW's Pressable lock/unlock mechanism that caused flicker.
  // Long-press in triggerProps lets touchscreen-web users still trigger it.
  const handlePointerEnter = React.useCallback(
    (e: PointerEvent) => {
      hoveringRef.current = e.nativeEvent.pointerType !== 'touch';
      handleTouchStart();
    },
    [handleTouchStart]
  );

  const handlePointerLeave = React.useCallback(
    (e: PointerEvent) => {
      if (isPointerInside(childrenWrapperRef.current, e.nativeEvent)) {
        return;
      }
      hoveringRef.current = false;
      handleTouchEnd();
    },
    [handleTouchEnd, childrenWrapperRef]
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

  const triggerProps: TooltipTriggerProps = {
    onLongPress: handleTouchStart,
    onPressOut: handlePressOut,
    delayLongPress: enterTouchDelay,
    ...(Platform.OS === 'web'
      ? {
          // keyboard focus shows it without the hover delay; a tap's focus
          // doesn't, as a long-press shows it on touch
          onFocus: () => {
            if (!touchFocusGuard.consumeTouchFocus()) show();
          },
          onBlur: handleTouchEnd,
        }
      : {}),
    ...(titleAsAriaLabel
      ? { 'aria-label': title }
      : Platform.OS === 'web'
        ? { 'aria-describedby': tooltipId }
        : { accessibilityHint: title }),
  };

  return (
    <>
      {rendered && (
        <Portal>
          <Animated.View
            nativeID={tooltipId}
            role="tooltip"
            testID={testID}
            onLayout={onLayout}
            pointerEvents="none"
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors[Tokens.plain.container],
                ...getTooltipPosition(measurement, direction),
                borderRadius: theme.shapes.corner[Tokens.plain.shape],
              },
              fadeStyle,
            ]}
          >
            <Text
              // web announces it through the trigger's `aria-describedby` or `aria-label`
              aria-live={Platform.OS === 'web' ? undefined : 'polite'}
              numberOfLines={Tokens.plain.maxLines}
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
      {Platform.OS === 'web' ? (
        <View
          ref={childrenWrapperRef}
          collapsable={false}
          style={styles.pressContainer}
          {...wrapperPointerProps}
        >
          {children(triggerProps)}
        </View>
      ) : (
        <Pressable
          ref={childrenWrapperRef}
          collapsable={false}
          accessible={false}
          style={styles.pressContainer}
          onLongPress={handleTouchStart}
          onPressOut={handleTouchEnd}
          delayLongPress={enterTouchDelay}
        >
          {children(triggerProps)}
        </Pressable>
      )}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

const styles = StyleSheet.create({
  tooltip: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: Tokens.plain.paddingHorizontal,
    paddingVertical: Tokens.plain.paddingVertical,
    minHeight: Tokens.plain.minHeight,
    minWidth: Tokens.plain.minWidth,
    maxWidth: Tokens.plain.maxWidth,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  pressContainer: {
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default Tooltip;
