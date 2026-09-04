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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { FOCUS_RING_INSET, FOCUS_RING_THICKNESS, webNoOutline } from './tokens';
import type { Mode, Shape, Size, Width } from './tokens';
import { getDimensions, getHitSlop, getIconButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { $RemoveChildren, ThemeProp } from '../../types';
import ActivityIndicator from '../ActivityIndicator';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = Omit<
  $RemoveChildren<typeof TouchableRipple>,
  'style' | 'onPress'
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

const useFocusRing = () => {
  const focusedSV = useSharedValue(false);

  const onFocus = React.useCallback(() => {
    if (
      Platform.OS === 'web' &&
      !document.activeElement?.matches(':focus-visible')
    ) {
      return;
    }
    focusedSV.value = true;
  }, [focusedSV]);

  const onBlur = React.useCallback(() => {
    focusedSV.value = false;
  }, [focusedSV]);

  return { focusedSV, onFocus, onBlur };
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
  testID = 'icon-button',
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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const flattenedStyle = StyleSheet.flatten(style as StyleProp<ViewStyle>);
  const customRadius = flattenedStyle?.borderRadius;
  const hasCustomRadius = typeof customRadius === 'number';
  const restingRadius = hasCustomRadius
    ? customRadius
    : dimensions.restingRadius;
  const pressedRadius = hasCustomRadius
    ? customRadius
    : dimensions.pressedRadius;

  const radius = useSharedValue(restingRadius);
  const isFirstRadiusSync = React.useRef(true);

  const springTo = React.useCallback(
    (target: number) => {
      if (reduceMotion) {
        radius.value = target;
        return;
      }
      radius.value = withSpring(
        target,
        toRawSpring(theme.motion.spring.fast.spatial)
      );
    },
    [radius, reduceMotion, theme]
  );

  React.useEffect(() => {
    if (isFirstRadiusSync.current) {
      isFirstRadiusSync.current = false;
      radius.value = restingRadius;
      return;
    }
    springTo(restingRadius);
  }, [radius, restingRadius, springTo]);

  const handlePressIn = (e: GestureResponderEvent) => {
    springTo(pressedRadius);
    onPressInProp?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    springTo(restingRadius);
    onPressOutProp?.(e);
  };

  const { focusedSV, onFocus, onBlur } = useFocusRing();

  const handleFocus = (e: Parameters<NonNullable<typeof onFocusProp>>[0]) => {
    onFocus();
    onFocusProp?.(e);
  };

  const handleBlur = (e: Parameters<NonNullable<typeof onBlurProp>>[0]) => {
    onBlur();
    onBlurProp?.(e);
  };

  const outerStyle = useAnimatedStyle(
    () => ({
      borderRadius: radius.value,
    }),
    [radius]
  );

  const clipStyle = useAnimatedStyle(
    () => ({
      borderRadius: radius.value,
    }),
    [radius]
  );

  const focusRingStyle = useAnimatedStyle(
    () => ({
      opacity: focusedSV.value ? 1 : 0,
      borderRadius: radius.value + FOCUS_RING_INSET,
    }),
    [radius]
  );

  const hitSlop = getHitSlop(dimensions.width, dimensions.height);

  return (
    <Animated.View
      ref={ref}
      testID={`${testID}-container`}
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
        },
        style,
        outerStyle,
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
          clipStyle,
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
          onPressIn={onPress ? handlePressIn : onPressInProp}
          onPressOut={onPress ? handlePressOut : onPressOutProp}
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
              />
            )}
          </View>
        </TouchableRipple>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.focusRing,
          { borderColor: theme.colors.secondary },
          focusRingStyle,
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default IconButton;
