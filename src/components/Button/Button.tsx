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

import color from 'color';

import {
  ButtonMode,
  getButtonColors,
  getButtonTouchableRippleStyle,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $Omit, ThemeProp } from '../../types';
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

export type Props = $Omit<React.ComponentProps<typeof Surface>, 'mode'> & {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
   * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
   * - `contained` - button with a background color, used for important action, have the most visual impact and high emphasis.
   * - `elevated` - button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background. @supported Available in v5.x with theme version 3
   * - `contained-tonal` - button with a secondary background color, an alternative middle ground between contained and outlined buttons. @supported Available in v5.x with theme version 3
   */
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  /**
   * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for:
   *  * `contained` mode for theme version 2
   *  * `contained`, `contained-tonal` and `elevated` modes for theme version 3.
   */
  dark?: boolean;
  /**
   * Use a compact look, useful for `text` buttons in a row.
   */
  compact?: boolean;
  /**
   * @deprecated Deprecated in v5.x - use `buttonColor` or `textColor` instead.
   * Custom text color for flat button, or background color for contained button.
   */
  color?: string;
  /**
   * Custom button's background color.
   */
  buttonColor?: string;
  /**
   * Custom button's text color.
   */
  textColor?: string;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Icon to display for the `Button`.
   */
  icon?: IconSource;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Label text of the button.
   */
  children: React.ReactNode;
  /**
   * Make the label text uppercased. Note that this won't work if you pass React elements as children.
   */
  uppercase?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
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
   * Use this prop to apply custom height and width, to set a custom padding or to set the icon on the right with `flexDirection: 'row-reverse'`.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * Label text number Of Lines of the button.
   */
  numberOfLines?: number;
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
 *   <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Button = (
  {
    disabled,
    compact,
    mode = 'text',
    dark,
    loading,
    icon,
    buttonColor: customButtonColor,
    textColor: customTextColor,
    rippleColor: customRippleColor,
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
    numberOfLines,
    style,
    theme: themeOverrides,
    uppercase: uppercaseProp,
    contentStyle,
    labelStyle,
    testID = 'button',
    accessible,
    background,
    maxFontSizeMultiplier,
    touchableRef,
    ...rest
  }: Props,
  ref: React.ForwardedRef<View>
) => {
  const theme = useInternalTheme(themeOverrides);
  const isMode = React.useCallback(
    (modeToCompare: ButtonMode) => {
      return mode === modeToCompare;
    },
    [mode]
  );
  const { roundness, isV3, animation } = theme;
  const uppercase = uppercaseProp ?? !theme.isV3;
  const isWeb = Platform.OS === 'web';

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onPressIn,
    onPressOut,
    onLongPress,
  });

  const isElevationEntitled =
    !disabled && (isV3 ? isMode('elevated') : isMode('contained'));
  const initialElevation = isV3 ? 1 : 2;
  const activeElevation = isV3 ? 2 : 8;

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
  }, [isElevationEntitled, elevation, initialElevation]);

  const handlePressIn = (e: GestureResponderEvent) => {
    onPressIn?.(e);
    if (isV3 ? isMode('elevated') : isMode('contained')) {
      const { scale } = animation;
      Animated.timing(elevation, {
        toValue: activeElevation,
        duration: 200 * scale,
        useNativeDriver:
          isWeb || Platform.constants.reactNativeVersion.minor <= 72,
      }).start();
    }
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    onPressOut?.(e);
    if (isV3 ? isMode('elevated') : isMode('contained')) {
      const { scale } = animation;
      Animated.timing(elevation, {
        toValue: initialElevation,
        duration: 150 * scale,
        useNativeDriver:
          isWeb || Platform.constants.reactNativeVersion.minor <= 72,
      }).start();
    }
  };

  const flattenedStyles = (StyleSheet.flatten(style) || {}) as ViewStyle;
  const [, borderRadiusStyles] = splitStyles(
    flattenedStyles,
    (style) => style.startsWith('border') && style.endsWith('Radius')
  );

  const borderRadius = (isV3 ? 5 : 1) * roundness;
  const iconSize = isV3 ? 18 : 16;
  const NumberOfLines = numberOfLines ? numberOfLines : 1;

  const { backgroundColor, borderColor, textColor, borderWidth } =
    getButtonColors({
      customButtonColor,
      customTextColor,
      theme,
      mode,
      disabled,
      dark,
    });

  const rippleColor =
    customRippleColor || color(textColor).alpha(0.12).rgb().string();

  const touchableStyle = {
    ...borderRadiusStyles,
    borderRadius: borderRadiusStyles.borderRadius ?? borderRadius,
  };

  const buttonStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    ...touchableStyle,
  };

  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};

  const font = isV3 ? theme.fonts.labelLarge : theme.fonts.medium;

  const textStyle = {
    color: textColor,
    ...font,
  };

  const iconStyle =
    StyleSheet.flatten(contentStyle)?.flexDirection === 'row-reverse'
      ? [
          styles.iconReverse,
          isV3 && styles[`md3IconReverse${compact ? 'Compact' : ''}`],
          isV3 &&
            isMode('text') &&
            styles[`md3IconReverseTextMode${compact ? 'Compact' : ''}`],
        ]
      : [
          styles.icon,
          isV3 && styles[`md3Icon${compact ? 'Compact' : ''}`],
          isV3 &&
            isMode('text') &&
            styles[`md3IconTextMode${compact ? 'Compact' : ''}`],
        ];

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
          !isV3 && !disabled && { elevation },
        ] as Animated.WithAnimatedValue<StyleProp<ViewStyle>>
      }
      {...(isV3 && { elevation: elevation })}
      container
    >
      <TouchableRipple
        borderless
        background={background}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={hasPassedTouchHandler ? handlePressIn : undefined}
        onPressOut={hasPassedTouchHandler ? handlePressOut : undefined}
        delayLongPress={delayLongPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={accessibilityRole}
        accessibilityState={{ disabled }}
        accessible={accessible}
        hitSlop={hitSlop}
        disabled={disabled}
        rippleColor={rippleColor}
        style={getButtonTouchableRippleStyle(touchableStyle, borderWidth)}
        testID={testID}
        theme={theme}
        ref={touchableRef}
      >
        <View style={[styles.content, contentStyle]}>
          {icon && loading !== true ? (
            <View style={iconStyle} testID={`${testID}-icon-container`}>
              <Icon
                source={icon}
                size={customLabelSize ?? iconSize}
                color={
                  typeof customLabelColor === 'string'
                    ? customLabelColor
                    : textColor
                }
              />
            </View>
          ) : null}
          {loading ? (
            <ActivityIndicator
              size={customLabelSize ?? iconSize}
              color={
                typeof customLabelColor === 'string'
                  ? customLabelColor
                  : textColor
              }
              style={iconStyle}
            />
          ) : null}
          <Text
            variant="labelLarge"
            selectable={false}
            numberOfLines={NumberOfLines}
            testID={`${testID}-text`}
            style={[
              styles.label,
              !isV3 && styles.md2Label,
              isV3 &&
                (isMode('text')
                  ? icon || loading
                    ? styles.md3LabelTextAddons
                    : styles.md3LabelText
                  : styles.md3Label),
              compact && styles.compactLabel,
              uppercase && styles.uppercaseLabel,
              textStyle,
              labelStyle,
            ]}
            maxFontSizeMultiplier={maxFontSizeMultiplier}
          >
            {children}
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
  icon: {
    marginLeft: 12,
    marginRight: -4,
  },
  iconReverse: {
    marginRight: 12,
    marginLeft: -4,
  },
  /* eslint-disable react-native/no-unused-styles */
  md3Icon: {
    marginLeft: 16,
    marginRight: -16,
  },
  md3IconCompact: {
    marginLeft: 8,
    marginRight: 0,
  },
  md3IconReverse: {
    marginLeft: -16,
    marginRight: 16,
  },
  md3IconReverseCompact: {
    marginLeft: 0,
    marginRight: 8,
  },
  md3IconTextMode: {
    marginLeft: 12,
    marginRight: -8,
  },
  md3IconTextModeCompact: {
    marginLeft: 6,
    marginRight: 0,
  },
  md3IconReverseTextMode: {
    marginLeft: -8,
    marginRight: 12,
  },
  md3IconReverseTextModeCompact: {
    marginLeft: 0,
    marginRight: 6,
  },
  /* eslint-enable react-native/no-unused-styles */
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
  md2Label: {
    letterSpacing: 1,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
  md3Label: {
    marginVertical: 10,
    marginHorizontal: 24,
  },
  md3LabelText: {
    marginHorizontal: 12,
  },
  md3LabelTextAddons: {
    marginHorizontal: 16,
  },
});

export default forwardRef(Button);
