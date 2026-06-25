import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import type { LayoutChangeEvent, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';

import { useTooltipFade } from './hooks';
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
      showTimer.current = setTimeout(() => setVisible(true), enterTouchDelay);
    } else {
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

  const triggerProps: TooltipTriggerProps =
    Platform.OS === 'web'
      ? { onHoverIn: handleTouchStart, onHoverOut: handleTouchEnd }
      : {
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
      <Pressable
        ref={childrenWrapperRef}
        style={styles.pressContainer}
        {...(Platform.OS === 'web' ? triggerProps : null)}
      >
        {children(triggerProps)}
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
