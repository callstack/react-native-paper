import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  BlurEvent,
  ColorValue,
  FocusEvent,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';

import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import type { Mode, Shape, Size, Width } from './tokens';
import { getDimensions, getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../theme/types';
import getMinInteractiveSizeHitSlop from '../../utils/getMinInteractiveSizeHitSlop';
import hasTouchHandler, {
  carriesToggleState,
} from '../../utils/hasTouchHandler';
import { useFocusRing } from '../../utils/useFocusRing';
import ActivityIndicator from '../ActivityIndicator';
import { useShapeMorph } from '../Button/useShapeMorph';
import { getButtonRippleColor } from '../Button/utils';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

const AnimatedTouchableRipple =
  Animated.createAnimatedComponent(TouchableRipple);

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
   * - `standard`: no container fill (default)
   * - `filled`: primary container
   * - `tonal`: secondary-container fill
   * - `outlined`: outline, no fill (selected uses inverse surface)
   */
  mode?: Mode;
  /**
   * @renamed Renamed from 'color' to 'iconColor' in v5.x
   * Color of the icon.
   */
  iconColor?: ColorValue;
  /**
   * Background color of the icon container. A disabled `filled` or `tonal`
   * button, or a disabled selected `outlined` one, takes the disabled
   * container color instead.
   */
  containerColor?: ColorValue;
  /**
   * Toggle state. Omit for the default (non-toggle) color set;
   * `true` / `false` use the toggle-ON / toggle-OFF color sets and invert
   * the resting shape. Screen readers announce the toggle state: `aria-pressed`
   * on web, `aria-checked` on native.
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
  /**
   * Style of the button container, for positioning and size. The corner comes
   * from `shape`, so a `borderRadius` here is ignored.
   */
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Whether to show a loading indicator in place of the icon. The button is
   * marked busy for assistive technology, but it is not disabled: pass
   * `disabled` too if presses should be ignored while it loads.
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
  'aria-busy': ariaBusy,
  contentStyle,
  hitSlop,
  role = 'button',
  focusRing: focusRingPlacement = 'outward',
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

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress: rest.onLongPress,
    onPressIn: onPressInProp,
    onPressOut: onPressOutProp,
  });

  const canBePressed = hasPassedTouchHandler && !disabled;

  // The handlers that reset `pressed` are only attached while the button can be
  // pressed, so a stale `pressed` must not outlive that.
  const isPressed = pressed && canBePressed;
  React.useEffect(() => {
    // Clears it too, so the shape doesn't snap back to pressed if the handler
    // returns.
    if (!canBePressed) {
      setPressed(false);
    }
  }, [canBePressed]);
  const borderRadius = isPressed
    ? dimensions.pressedRadius
    : dimensions.restingRadius;
  const { outerStyle: radiusStyle, innerStyle: innerRadiusStyle } =
    useShapeMorph({
      theme,
      radius: borderRadius,
      largestRadius: Math.max(
        dimensions.height / 2,
        dimensions.restingRadius,
        dimensions.pressedRadius
      ),
      borderWidth,
      animate: !reduceMotion,
    });

  // The state layer takes the icon color, as Button's takes its label color.
  const rippleColor = getButtonRippleColor({ labelColor: iconColor });

  const handlePressIn = (e: GestureResponderEvent) => {
    setPressed(true);
    onPressInProp?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    setPressed(false);
    onPressOutProp?.(e);
  };

  // The ring goes on the clip view, around the outline, rather than on the
  // touchable inside it. Off whenever the button can't be pressed, as on
  // TouchableRipple.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    !canBePressed,
    theme.colors.secondary,
    focusRingPlacement,
    'within'
  );

  const handleFocus = (e: FocusEvent) => {
    onFocusProp?.(e);
    focusTarget.onFocus?.(e);
  };

  const handleBlur = (e: BlurEvent) => {
    onBlurProp?.(e);
    focusTarget.onBlur?.();
  };

  // The button is busy while it loads, so the indicator inside it is no
  // progress element of its own. Always a boolean: on Android `undefined`
  // leaves TalkBack saying "busy" after loading ends. As on React Native, an
  // `aria-busy` prop wins over `accessibilityState.busy`.
  const busy = loading || (ariaBusy ?? rest.accessibilityState?.busy) === true;

  // Announced like Button: `aria-pressed` on web, `aria-checked` on native.
  // `aria-selected` isn't valid on `role="button"`, so it would go unannounced.
  // React Native's types have no `aria-pressed`.
  const toggleStateProps =
    selected === undefined
      ? {}
      : Platform.OS === 'web'
        ? { 'aria-pressed': selected }
        : { 'aria-checked': selected };

  // The touchable sits inside the outline, so it is smaller than the container.
  const touchableWidth = dimensions.width - 2 * borderWidth;
  const touchableHeight = dimensions.height - 2 * borderWidth;

  // Disabled and handler-less buttons get no extra target.
  const defaultHitSlop = canBePressed
    ? getMinInteractiveSizeHitSlop({
        width: touchableWidth,
        height: touchableHeight,
      })
    : undefined;

  // Without a handler the touchable drops the button role, and on web that
  // renders role="presentation", which can't carry a name. A labelled icon
  // that does nothing is an image there, named by its label. An explicit
  // role="button", as Searchbar passes, counts as the default.
  const isWebImage =
    Platform.OS === 'web' &&
    role === 'button' &&
    !disabled &&
    ariaLabel !== undefined &&
    !hasPassedTouchHandler &&
    !carriesToggleState({ ...rest, ...toggleStateProps });

  return (
    <Animated.View
      ref={ref}
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
          ...focusRing.style,
        ]}
        {...focusRing.dataSetProps}
      >
        {backgroundOpacity < 1 && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.overlay,
              innerRadiusStyle,
              { backgroundColor, opacity: backgroundOpacity },
            ]}
          />
        )}
        <AnimatedTouchableRipple
          borderless
          centered
          onPress={onPress}
          onPressIn={hasPassedTouchHandler ? handlePressIn : undefined}
          onPressOut={hasPassedTouchHandler ? handlePressOut : undefined}
          focusRing="none"
          rippleColor={rippleColor}
          theme={theme}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-label={ariaLabel}
          style={[
            styles.touchable,
            innerRadiusStyle,
            // Not on web, where `overflow: 'hidden'` would also clip the hit
            // slop target; there the ripple container follows the corner.
            Platform.OS !== 'web' && styles.clipToShape,
            contentStyle,
          ]}
          role={isWebImage ? 'img' : role}
          aria-disabled={disabled}
          aria-busy={busy}
          {...toggleStateProps}
          disabled={disabled}
          hitSlop={hitSlop !== undefined ? hitSlop : defaultHitSlop}
          testID={testID}
          {...rest}
        >
          <View style={{ opacity: iconOpacity }}>
            {loading ? (
              <ActivityIndicator
                size={dimensions.iconSize}
                color={iconColor}
                aria-hidden
              />
            ) : (
              <IconComponent
                color={iconColor}
                source={icon}
                size={dimensions.iconSize}
              />
            )}
          </View>
        </AnimatedTouchableRipple>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 6,
    overflow: 'visible',
  },
  // No `overflow: 'hidden'`: it would clip the touchable's hit slop. The
  // background and outline follow the radius on their own.
  clip: {
    width: '100%',
    height: '100%',
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    pointerEvents: 'none',
  },
  clipToShape: {
    overflow: 'hidden',
  },
});

export default IconButton;
