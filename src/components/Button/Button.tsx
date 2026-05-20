import * as React from 'react';
import {
  AccessibilityRole,
  Animated,
  ColorValue,
  GestureResponderEvent,
  Platform,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import {
  ButtonMode,
  ButtonShape,
  ButtonSize,
  getButtonColors,
  getButtonIconStyle,
  getButtonRippleColor,
  getButtonShapeRadius,
  getButtonSizeStyle,
  getButtonTouchableRippleStyle,
} from './utils';
import { getDefaultDirection, useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, Theme, ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { splitStyles } from '../../utils/splitStyles';
import ActivityIndicator from '../ActivityIndicator';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = $Omit<
  React.ComponentProps<typeof Surface>,
  'mode' | 'children'
> & {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis. Defaults to `filled`.
   * - `filled` - button with a background color, used for the most important action, has the most visual impact and high emphasis. (default)
   * - `tonal` - button with a secondary background color, an alternative middle ground between filled and outlined buttons.
   * - `elevated` - button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background.
   * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
   * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
   */
  mode?: 'text' | 'outlined' | 'filled' | 'elevated' | 'tonal';
  /**
   * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for the `filled`, `tonal` and `elevated` modes.
   */
  dark?: boolean;
  /**
   * Use a compact look, useful for `text` buttons in a row.
   */
  compact?: boolean;
  /**
   * Size of the button (Material Design 3 expressive). One of
   * `'extra-small' | 'small' | 'medium' | 'large' | 'extra-large'`.
   *
   * When omitted, the button uses its legacy visuals. When set, the size
   * controls the minimum height, horizontal padding, icon size, the gap
   * between icon and label, and the label typescale.
   */
  size?: ButtonSize;
  /**
   * Shape variant of the button (Material Design 3 expressive). `'round'`
   * uses the full-pill corner radius; `'square'` uses a smaller per-size
   * corner radius. When omitted, the button keeps its legacy corner radius
   * (`theme.shapes.corner.largeIncreased`). Overridden by an explicit
   * `borderRadius` in `style`.
   */
  shape?: ButtonShape;
  /**
   * Whether this button is in the selected state (Material Design 3
   * expressive toggle). When `true`:
   *
   * - The `shape` is flipped: `'round'` becomes `'square'` and vice versa.
   * - For `outlined` and `text` modes, the button adopts a filled
   *   `secondaryContainer` appearance (matches `tonal`).
   * - `accessibilityState.selected` is set so screen readers announce the
   *   toggle state.
   *
   * Other modes only flip the shape.
   */
  selected?: boolean;
  /**
   * Custom button's background color.
   */
  buttonColor?: ColorValue;
  /**
   * Custom button's text color.
   */
  textColor?: ColorValue;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Icon to display for the `Button`.
   */
  icon?: IconSource;
  /**
   * Position of the `icon` relative to the label. Defaults to `'leading'`.
   */
  iconPosition?: 'leading' | 'trailing';
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Label text of the button.
   */
  label?: string;
  /**
   * @deprecated Use `label` instead. When both `label` and `children` are set, `label` is used.
   * Label text of the button.
   */
  children?: React.ReactNode;
  /**
   * Make the label text uppercased.
   */
  uppercase?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Color of the ripple effect / state layer. Defaults to the label color at
   * the pressed-state opacity.
   */
  rippleColor?: ColorValue;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityHint?: string;
  /**
   * Accessibility role for the button. The "button" role is set by default.
   */
  accessibilityRole?: AccessibilityRole;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute as soon as the touch is released even before onPress.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Style of button's inner content.
   * Use this prop to apply custom height and width or to set a custom padding.
   *
   * Note: setting `flexDirection: 'row-reverse'` here to move the icon to the
   * trailing edge is deprecated — use the `iconPosition` prop instead.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Reference for the touchable
   */
  touchableRef?: React.RefObject<View>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * A button is component that the user can press to trigger an action.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Button
 *     icon="camera"
 *     mode="filled"
 *     onPress={() => console.log('Pressed')}
 *     label="Press me"
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */

// Elevation levels (MD3) used by the `elevated` mode: level 1 at rest,
// level 2 while pressed.
const initialElevation = 1;
const activeElevation = 2;
// MD3 leading/trailing icon size for the legacy (no-`size`) button.
const iconSize = 20;
// Minimum accessible touch target (dp). Extra-small/small buttons are shorter
// than this and get expanded via hitSlop.
const MIN_TOUCH_TARGET = 48;

const Button = (
  {
    disabled,
    compact,
    mode = 'filled',
    size,
    shape,
    selected,
    dark,
    loading,
    icon,
    iconPosition,
    buttonColor: customButtonColor,
    textColor: customLabelColor,
    label,
    children,
    accessibilityLabel,
    accessibilityHint,
    accessibilityRole = 'button',
    hitSlop,
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
    delayLongPress,
    style,
    theme: themeOverrides,
    uppercase: uppercaseProp,
    contentStyle,
    labelStyle,
    testID = 'button',
    accessible,
    background,
    rippleColor: customRippleColor,
    maxFontSizeMultiplier,
    touchableRef,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>
) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const isMode = (modeToCompare: ButtonMode) => mode === modeToCompare;
  const { animation } = theme;
  const uppercase = uppercaseProp ?? false;
  const isWeb = Platform.OS === 'web';

  if (process.env.NODE_ENV !== 'production' && children != null) {
    console.warn(
      'Button: the `children` prop is deprecated and will be removed in a future release. Use the `label` prop instead.'
    );
  }

  const labelContent = label != null ? label : children;

  const flattenedContentStyle = React.useMemo(
    () => StyleSheet.flatten(contentStyle) as ViewStyle | undefined,
    [contentStyle]
  );
  const usesReverseContentStyle =
    flattenedContentStyle?.flexDirection === 'row-reverse';

  if (process.env.NODE_ENV !== 'production' && usesReverseContentStyle) {
    console.warn(
      'Button: setting `flexDirection: \'row-reverse\'` in `contentStyle` to move the icon to the trailing edge is deprecated. Use the `iconPosition="trailing"` prop instead.'
    );
  }

  const requestedTrailingIcon =
    iconPosition === 'trailing' || usesReverseContentStyle;
  const shouldFlipForRTL = direction !== getDefaultDirection();
  const isTrailingIcon = shouldFlipForRTL
    ? !requestedTrailingIcon
    : requestedTrailingIcon;

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
  });

  const isElevationEntitled = !disabled && isMode('elevated');

  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(isElevationEntitled ? initialElevation : 0)
  );

  React.useEffect(() => {
    // Workaround not to call setValue on Animated.Value, because it breaks styles.
    // https://github.com/callstack/react-native-paper/issues/4559
    Animated.timing(elevation, {
      toValue: isElevationEntitled ? initialElevation : 0,
      duration: 0,
      useNativeDriver: true,
    });
  }, [isElevationEntitled, elevation]);

  const handlePressIn = React.useCallback(
    (e: GestureResponderEvent) => {
      onPressIn?.(e);
      if (mode === 'elevated') {
        const { scale } = animation;
        Animated.timing(elevation, {
          toValue: activeElevation,
          duration: 200 * scale,
          useNativeDriver:
            isWeb || Platform.constants.reactNativeVersion.minor <= 72,
        }).start();
      }
    },
    [onPressIn, mode, animation, elevation, isWeb]
  );

  const handlePressOut = React.useCallback(
    (e: GestureResponderEvent) => {
      onPressOut?.(e);
      if (mode === 'elevated') {
        const { scale } = animation;
        Animated.timing(elevation, {
          toValue: initialElevation,
          duration: 150 * scale,
          useNativeDriver:
            isWeb || Platform.constants.reactNativeVersion.minor <= 72,
        }).start();
      }
    },
    [onPressOut, mode, animation, elevation, isWeb]
  );

  const borderRadiusStyles = React.useMemo(() => {
    const flattenedStyles = (StyleSheet.flatten(style) || {}) as ViewStyle;
    const [, radiusStyles] = splitStyles(
      flattenedStyles,
      (key) => key.startsWith('border') && key.endsWith('Radius')
    );
    return radiusStyles;
  }, [style]);

  // When the button is `selected`, flip the requested shape so the
  // unselected/selected pair contrasts visually (round ↔ square).
  const effectiveShape: ButtonShape | undefined = shape
    ? selected
      ? shape === 'round'
        ? 'square'
        : 'round'
      : shape
    : undefined;
  const borderRadius = effectiveShape
    ? getButtonShapeRadius({ size, shape: effectiveShape, theme })
    : theme.shapes.corner.largeIncreased;

  const {
    backgroundColor,
    borderColor,
    labelColor,
    labelOpacity,
    borderWidth,
    backgroundOpacity,
  } = React.useMemo(
    () =>
      getButtonColors({
        customButtonColor,
        customLabelColor,
        theme,
        mode,
        disabled,
        dark,
        selected,
      }),
    [customButtonColor, customLabelColor, theme, mode, disabled, dark, selected]
  );

  const rippleColor = React.useMemo(
    () => getButtonRippleColor({ labelColor, customRippleColor }),
    [labelColor, customRippleColor]
  );

  const touchableStyle = React.useMemo(
    () => ({
      ...borderRadiusStyles,
      borderRadius: borderRadiusStyles.borderRadius ?? borderRadius,
    }),
    [borderRadiusStyles, borderRadius]
  );

  const buttonStyle = React.useMemo(
    () => ({
      backgroundColor: backgroundOpacity < 1 ? 'transparent' : backgroundColor,
      borderColor,
      borderWidth,
      ...touchableStyle,
    }),
    [
      backgroundOpacity,
      backgroundColor,
      borderColor,
      borderWidth,
      touchableStyle,
    ]
  );

  const touchableRippleStyle = React.useMemo(
    () => getButtonTouchableRippleStyle(touchableStyle, borderWidth),
    [touchableStyle, borderWidth]
  );

  const { color: labelStyleColor, fontSize: labelStyleSize } = React.useMemo(
    () => StyleSheet.flatten(labelStyle) || {},
    [labelStyle]
  );

  const sizeStyle = React.useMemo(
    () => (size ? getButtonSizeStyle(size) : undefined),
    [size]
  );

  // Extra-small/small buttons are shorter than the 48dp minimum accessible
  // touch target, so expand the press area with hitSlop without changing the
  // visual size. A user-supplied `hitSlop` wins on the axes it sets.
  const hitSlopWithMinTarget = React.useMemo(() => {
    const verticalSlop = sizeStyle
      ? Math.max(0, (MIN_TOUCH_TARGET - sizeStyle.minHeight) / 2)
      : 0;
    if (verticalSlop === 0) {
      return hitSlop;
    }
    if (hitSlop == null) {
      return { top: verticalSlop, bottom: verticalSlop };
    }
    // A numeric hitSlop is an explicit uniform override — respect it as-is.
    if (typeof hitSlop === 'number') {
      return hitSlop;
    }
    return {
      ...hitSlop,
      top: hitSlop.top ?? verticalSlop,
      bottom: hitSlop.bottom ?? verticalSlop,
    };
  }, [hitSlop, sizeStyle]);

  const labelTypeStyle = React.useMemo(
    () => ({
      color: labelColor,
      ...(theme as Theme).fonts[sizeStyle?.labelVariant ?? 'labelLarge'],
    }),
    [labelColor, theme, sizeStyle]
  );

  const iconStyle = React.useMemo(
    () =>
      sizeStyle
        ? null
        : getButtonIconStyle({
            mode,
            compact,
            position: isTrailingIcon ? 'trailing' : 'leading',
          }),
    [mode, compact, isTrailingIcon, sizeStyle]
  );

  return (
    <Surface
      {...rest}
      ref={ref}
      testID={`${testID}-container`}
      style={
        [
          styles.button,
          compact && styles.compact,
          buttonStyle,
          style,
        ] as Animated.WithAnimatedValue<StyleProp<ViewStyle>>
      }
      elevation={elevation}
      container
    >
      {backgroundOpacity < 1 && (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor,
              opacity: backgroundOpacity,
              borderRadius: touchableStyle.borderRadius,
            },
          ]}
        />
      )}
      <TouchableRipple
        borderless
        background={background}
        rippleColor={rippleColor}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={hasPassedTouchHandler ? handlePressIn : undefined}
        onPressOut={hasPassedTouchHandler ? handlePressOut : undefined}
        delayLongPress={delayLongPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled, selected }}
        accessible={accessible}
        hitSlop={hitSlopWithMinTarget}
        disabled={disabled}
        style={touchableRippleStyle}
        testID={testID}
        theme={theme}
        ref={touchableRef}
      >
        <View
          style={[
            styles.content,
            isTrailingIcon && styles.contentReverse,
            ...(sizeStyle
              ? [
                  {
                    minHeight: sizeStyle.minHeight,
                    paddingHorizontal: sizeStyle.paddingHorizontal,
                    gap: sizeStyle.iconGap,
                  },
                ]
              : []),
            { opacity: labelOpacity },
            contentStyle,
          ]}
        >
          {icon && loading !== true ? (
            <View
              style={iconStyle ?? undefined}
              testID={`${testID}-icon-container`}
            >
              <Icon
                source={icon}
                size={sizeStyle?.iconSize ?? labelStyleSize ?? iconSize}
                color={
                  typeof labelStyleColor === 'string'
                    ? labelStyleColor
                    : labelColor
                }
              />
            </View>
          ) : null}
          {loading ? (
            <ActivityIndicator
              size={sizeStyle?.iconSize ?? labelStyleSize ?? iconSize}
              color={
                typeof labelStyleColor === 'string'
                  ? labelStyleColor
                  : labelColor
              }
              style={iconStyle ?? undefined}
            />
          ) : null}
          <Text
            variant={sizeStyle?.labelVariant ?? 'labelLarge'}
            selectable={false}
            numberOfLines={1}
            testID={`${testID}-text`}
            style={[
              styles.label,
              sizeStyle
                ? styles.sizedLabel
                : isMode('text')
                ? icon || loading
                  ? styles.legacyLabelTextAddons
                  : styles.legacyLabelText
                : styles.legacyLabel,
              !sizeStyle && compact && styles.compactLabel,
              uppercase && styles.uppercaseLabel,
              labelTypeStyle,
              labelStyle,
            ]}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
          >
            {labelContent}
          </Text>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 64,
    borderStyle: 'solid',
  },
  compact: {
    minWidth: 'auto',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentReverse: {
    flexDirection: 'row-reverse',
  },
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
  sizedLabel: {
    marginVertical: 0,
    marginHorizontal: 0,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  legacyLabel: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  legacyLabelText: {
    marginHorizontal: 12,
  },
  legacyLabelTextAddons: {
    marginHorizontal: 16,
  },
});

export default forwardRef(Button);
