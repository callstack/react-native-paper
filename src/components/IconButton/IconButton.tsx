import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Animated, {
  type AnimatedStyle,
  cubicBezier,
  type CSSStyle,
} from 'react-native-reanimated';

import type { Mode, Shape, Size, Width } from './tokens';
import { getDimensions, getHitSlop, getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../theme/types';
import {
  FOCUS_RING_INSET,
  FOCUS_RING_THICKNESS,
  webNoOutline,
} from '../../utils/focusRing';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import ActivityIndicator from '../ActivityIndicator';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

export type Props = Omit<
  React.PropsWithoutRef<TouchableRippleProps>,
  'children' | 'style' | 'onPress'
> & {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * Color style of the icon button.
   *
   * - `standard` — no container fill (default)
   * - `filled` — primary container
   * - `tonal` — secondary-container fill
   * - `outlined` — outline, no fill (selected uses inverse surface)
   */
  mode?: Mode;
  /**
   * @renamed Renamed from 'color' to 'iconColor' in v5.x
   * Color of the icon.
   */
  iconColor?: ColorValue;
  /**
   * Background color of the icon container.
   */
  containerColor?: ColorValue;
  /**
   * Toggle state. Omit for the default (non-toggle) color set;
   * `true` / `false` use the toggle-ON / toggle-OFF color sets and invert
   * the resting shape.
   */
  selected?: boolean;
  /**
   * Named size on the MD3 Expressive scale. Defaults to `small`.
   */
  size?: Size;
  /**
   * Horizontal padding around the icon: `narrow`, `default`, or `wide`.
   * Uniform (`default`) sizes are square.
   */
  width?: Width;
  /**
   * Resting container shape. Toggle-ON inverts round ↔ square. Pressed
   * uses a shared corner for both shapes.
   */
  shape?: Shape;
  /**
   * Icon size override in dp. Defaults to the size token.
   */
  iconSize?: number;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Whether an icon change is animated.
   */
  animated?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
  /**
   * Style of button's inner content.
   * Use this prop to apply custom height and width or to set a custom padding.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  ref?: React.Ref<View>;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
};

/**
 * An icon button is a button which displays only an icon without a label.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { IconButton, Palette } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <IconButton
 *     icon="camera"
 *     iconColor={Palette.error50}
 *     size="small"
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const IconButton = ({
  icon,
  iconColor: customIconColor,
  containerColor: customContainerColor,
  size = 'small',
  width = 'default',
  shape = 'round',
  iconSize,
  'aria-label': ariaLabel,
  disabled,
  onPress,
  selected,
  animated = false,
  mode = 'standard',
  style,
  theme: themeOverrides,
  testID,
  loading = false,
  contentStyle,
  ref,
  onPressIn: onPressInProp,
  onPressOut: onPressOutProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const [pressed, setPressed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const IconComponent = animated ? CrossFadeIcon : Icon;

  const dimensions = getDimensions({
    theme,
    size,
    width,
    shape,
    selected,
    iconSize,
  });

  const {
    iconColor,
    iconOpacity,
    backgroundColor,
    borderColor,
    backgroundOpacity,
    borderWidth,
  } = getIconButtonColor({
    theme,
    disabled,
    selected,
    mode,
    customIconColor,
    customContainerColor,
    outlineWidth: dimensions.outlineWidth,
  });

  const borderRadius = pressed
    ? dimensions.pressedRadius
    : dimensions.restingRadius;
  const radiusStyle: CSSStyle<ViewStyle> = {
    borderRadius,
    transitionProperty: ['borderRadius'],
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.short4,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };
  const focusRingRadiusStyle: CSSStyle<ViewStyle> = {
    ...radiusStyle,
    borderRadius: borderRadius + FOCUS_RING_INSET,
  };

  const handlePressIn = (e: GestureResponderEvent) => {
    setPressed(true);
    onPressInProp?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    setPressed(false);
    onPressOutProp?.(e);
  };

  const handleFocus = (e: Parameters<NonNullable<typeof onFocusProp>>[0]) => {
    if (isKeyboardFocusEvent(e)) {
      setFocused(true);
    }
    onFocusProp?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<typeof onBlurProp>>[0]) => {
    setFocused(false);
    onBlurProp?.(e);
  };

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress: rest.onLongPress,
    onPressIn: onPressInProp,
    onPressOut: onPressOutProp,
  });

  const hitSlop = getHitSlop(dimensions.width, dimensions.height);

  return (
    <Animated.View
      ref={ref}
      testID={testID ? `${testID}-container` : undefined}
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
        },
        style,
        radiusStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.clip,
          {
            backgroundColor:
              backgroundOpacity < 1 ? undefined : backgroundColor,
            borderWidth,
            borderColor,
          },
          radiusStyle,
        ]}
      >
        {backgroundOpacity < 1 && (
          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor, opacity: backgroundOpacity },
            ]}
          />
        )}
        <TouchableRipple
          borderless
          centered
          onPress={onPress}
          onPressIn={hasPassedTouchHandler ? handlePressIn : undefined}
          onPressOut={hasPassedTouchHandler ? handlePressOut : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={ariaLabel}
          style={[
            styles.touchable,
            Platform.OS === 'web' ? webNoOutline : null,
            contentStyle,
          ]}
          role="button"
          aria-disabled={disabled}
          aria-selected={selected}
          disabled={disabled}
          hitSlop={hitSlop}
          testID={testID}
          {...rest}
        >
          <View style={{ opacity: iconOpacity }}>
            {loading ? (
              <ActivityIndicator size={dimensions.iconSize} color={iconColor} />
            ) : (
              <IconComponent
                color={iconColor}
                source={icon}
                size={dimensions.iconSize}
                testID={testID ? `${testID}-icon` : undefined}
              />
            )}
          </View>
        </TouchableRipple>
      </Animated.View>
      <Animated.View
        style={[
          styles.focusRing,
          focused ? styles.focusRingVisible : styles.focusRingHidden,
          { borderColor: theme.colors.secondary },
          focusRingRadiusStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 6,
    overflow: 'visible',
  },
  clip: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  touchable: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusRing: {
    position: 'absolute',
    top: -FOCUS_RING_INSET,
    left: -FOCUS_RING_INSET,
    right: -FOCUS_RING_INSET,
    bottom: -FOCUS_RING_INSET,
    borderWidth: FOCUS_RING_THICKNESS,
    pointerEvents: 'none',
  },
  focusRingVisible: {
    opacity: 1,
  },
  focusRingHidden: {
    opacity: 0,
  },
});

export default IconButton;
