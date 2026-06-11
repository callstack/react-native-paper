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
import { getTooltipPosition, Measurement, TooltipChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { addEventListener } from '../../utils/addEventListener';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Tooltip reference element. Needs to be able to hold a ref.
   */
  children: React.ReactElement;
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
   * Action buttons (and/or links) rendered in a row below the content.
   * Pressing one dismisses the tooltip.
   */
  actions?: React.ReactNode;
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
 * dismiss it.
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
 *     actions={<Button compact>Learn more</Button>}
 *   >
 *     <IconButton icon="plus" onPress={() => {}} />
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
  ...rest
}: Props) => {
  const isWeb = Platform.OS === 'web';

  const theme = useInternalTheme(themeOverrides);
  // `visible` is the show/hide intent; the fade hook keeps the tooltip mounted
  // through the exit animation and owns the measurement + opacity.
  const [visible, setVisible] = React.useState(false);
  const { rendered, measurement, animatedStyle, onLayout, childrenWrapperRef } =
    useTooltipFade(theme, visible);

  const showTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);
  const hideTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);

  const isValidChild = React.useMemo(
    () => React.isValidElement<TooltipChildProps>(children),
    [children]
  );

  const clearShowTimers = React.useCallback(() => {
    showTooltipTimer.current.forEach((t) => clearTimeout(t));
    showTooltipTimer.current = [];
  }, []);

  const clearHideTimers = React.useCallback(() => {
    hideTooltipTimer.current.forEach((t) => clearTimeout(t));
    hideTooltipTimer.current = [];
  }, []);

  React.useEffect(() => {
    return () => {
      clearShowTimers();
      clearHideTimers();
    };
  }, [clearShowTimers, clearHideTimers]);

  React.useEffect(() => {
    const subscription = addEventListener(Dimensions, 'change', () =>
      setVisible(false)
    );

    return () => subscription.remove();
  }, []);

  const show = React.useCallback(() => {
    clearHideTimers();
    setVisible(true);
  }, [clearHideTimers]);

  const hide = React.useCallback(() => {
    clearShowTimers();
    setVisible(false);
  }, [clearShowTimers]);

  const scheduleHide = React.useCallback(() => {
    clearShowTimers();
    const id = setTimeout(
      () => setVisible(false),
      leaveTouchDelay
    ) as unknown as NodeJS.Timeout;
    hideTooltipTimer.current.push(id);
  }, [clearShowTimers, leaveTouchDelay]);

  // Mobile: a tap toggles the tooltip and still forwards the child's onPress.
  const handlePress = React.useCallback(() => {
    if (visible) {
      hide();
    } else {
      show();
    }
    if (isValidChild) {
      (children.props as TooltipChildProps).onPress?.();
    }
  }, [visible, hide, show, isValidChild, children.props]);

  // Web: open on hover, with a short enter delay.
  const handleHoverIn = React.useCallback(() => {
    clearHideTimers();
    const id = setTimeout(
      () => setVisible(true),
      enterTouchDelay
    ) as unknown as NodeJS.Timeout;
    showTooltipTimer.current.push(id);
    if (isValidChild) {
      (children.props as TooltipChildProps).onHoverIn?.();
    }
  }, [clearHideTimers, enterTouchDelay, isValidChild, children.props]);

  const handleHoverOut = React.useCallback(() => {
    scheduleHide();
    if (isValidChild) {
      (children.props as TooltipChildProps).onHoverOut?.();
    }
  }, [scheduleHide, isValidChild, children.props]);

  const mobilePressProps = {
    onPress: handlePress,
  };

  const webPressProps = {
    onHoverIn: handleHoverIn,
    onHoverOut: handleHoverOut,
  };

  // Web only: keep the tooltip open while the pointer travels from the trigger
  // into the tooltip (and re-schedule the hide once it leaves the tooltip).
  const tooltipHoverProps = isWeb
    ? { onHoverIn: clearHideTimers, onHoverOut: scheduleHide }
    : {};

  return (
    <>
      {rendered && (
        <Portal>
          <Pressable
            accessibilityRole="button"
            onPress={hide}
            pointerEvents={visible ? 'auto' : 'none'}
            style={StyleSheet.absoluteFill}
            testID="tooltip-rich-backdrop"
          />
          <Animated.View
            onLayout={onLayout}
            style={[
              styles.container,
              getTooltipPosition(
                measurement as Measurement,
                children as React.ReactElement<TooltipChildProps>
              ),
              animatedStyle,
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
                  // `onTouchEnd` bubbles from the pressed action up to this
                  // wrapper, so selecting any action dismisses the tooltip.
                  <View
                    style={styles.actions}
                    onTouchEnd={hide}
                    testID="tooltip-rich-actions"
                  >
                    {actions}
                  </View>
                ) : null}
              </Surface>
            </Pressable>
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
    ...(Platform.OS === 'web' && { cursor: 'default' }),
  } as ViewStyle,
});

export default RichTooltip;
