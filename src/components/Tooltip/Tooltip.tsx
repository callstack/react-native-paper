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
import { getTooltipPosition, Measurement, TooltipChildProps } from './utils';
import { useInternalTheme } from '../../core/theming';
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
  // `visible` is the show/hide intent; the fade hook keeps the tooltip mounted
  // through the exit animation and owns the measurement + opacity.
  const [visible, setVisible] = React.useState(false);
  const { rendered, measurement, animatedStyle, onLayout, childrenWrapperRef } =
    useTooltipFade(theme, visible);

  const showTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);
  const hideTooltipTimer = React.useRef<NodeJS.Timeout[]>([]);

  const touched = React.useRef(false);

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
            onLayout={onLayout}
            style={[
              styles.tooltip,
              {
                backgroundColor: theme.colors[Tokens.plain.container],
                ...getTooltipPosition(
                  measurement as Measurement,
                  (children as React.ReactElement<TooltipChildProps>).props
                    .style
                ),
                borderRadius: theme.shapes.corner[Tokens.plain.shape],
              },
              animatedStyle,
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
