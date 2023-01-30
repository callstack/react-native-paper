import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';

import type { Font } from '../../types';
import ActivityIndicator from '../ActivityIndicator';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';
import { useButtonTheme } from './useButtonTheme';
import { useButtonThemeAnim } from './useButtonThemeAnim';
import type { ButtonMode } from './utils';

type DirectionOptions = {
  reverse: {
    compact: Record<string, number>;
    normal: Record<string, number>;
  };
  forward: {
    compact: Record<string, number>;
    normal: Record<string, number>;
  };
};
// move it to the right place
export type ButtonTheme = {
  elevation: {
    initial: number;
    active: number;
    supportedMode: ButtonMode;
  };
  borderRadius: number;
  iconSize: number;
  font: Font;

  iconStyle: {
    icon: DirectionOptions;
    textMode: DirectionOptions;
  };
  textStyle: {
    getTextLabel: (
      isTextMode: boolean,
      hasIconOrLoading: boolean
    ) => Record<string, number>;
  };
  surfaceStyle: {
    getElevationStyle: (elevation: Animated.Value) => Record<string, number>;
    getElevationProp: (elevation: Animated.Value) => Record<string, number>;
  };
  buttonStyle: {
    backgroundColor: {
      enabled: { [key in ButtonMode]?: string };
      disabled: { [key in ButtonMode]?: string };
      default: string;
    };
    borderColor: {
      enabled: {
        [key in ButtonMode]?: string;
      };
      disabled: {
        [key in ButtonMode]?: string;
      };
      default: number;
    };
    borderWidth: {
      [key in ButtonMode]?: number;
    } & { default: number };
    textColor: {
      getTextColor: ({
        backgroundColor,
        isMode,
        disabled,
        dark,
      }: {
        backgroundColor: string;
        dark?: boolean;
        disabled?: boolean;
        isMode: (mode: ButtonMode) => boolean;
      }) => string;
    };
  };
};

export type Props = React.ComponentProps<Exclude<typeof Surface, 'theme'>> & {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
   * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
   * - `contained` - button with a background color, used for important action, have the most visual impact and high emphasis.
   * - `elevated` - button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background. @supported Available in v5.x with theme version 3
   * - `contained-tonal` - button with a secondary background color, an alternative middle ground between contained and outlined buttons. @supported Available in v5.x with theme version 3
   */
  mode?: ButtonMode;
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
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility hint for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityHint?: string;
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
   * Use this prop to apply custom height and width and to set the icon on the right with `flexDirection: 'row-reverse'`.
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ButtonTheme;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * A button is component that the user can press to trigger an action.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/button-1.png" />
 *     <figcaption>Text button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-2.png" />
 *     <figcaption>Outlined button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-3.png" />
 *     <figcaption>Contained button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-4.png" />
 *     <figcaption>Elevated button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/button-5.png" />
 *     <figcaption>Contained-tonal button</figcaption>
 *   </figure>
 * </div>
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
const Button = ({
  disabled,
  compact,
  mode = 'text',
  dark,
  loading,
  icon,
  buttonColor: customButtonColor,
  textColor: customTextColor,
  children,
  accessibilityLabel,
  accessibilityHint,
  onPress,
  onPressIn,
  onPressOut,
  onLongPress,
  delayLongPress,
  style,
  theme: themeOverrides,
  uppercase = false, //!themeOverrides.isV3,
  contentStyle,
  labelStyle,
  testID = 'button',
  accessible,
  ...rest
}: Props) => {
  const buttonTheme = useButtonTheme({
    theme: themeOverrides,
  });

  const isMode = React.useCallback(
    (modeToCompare: ButtonMode) => {
      return mode === modeToCompare;
    },
    [mode]
  );
  const { elevationAnim, animatePressIn, animatePressOut } = useButtonThemeAnim(
    disabled,
    isMode(buttonTheme.elevation.supportedMode),
    buttonTheme.elevation
  );

  const handlePressIn = (e: GestureResponderEvent) => {
    onPressIn?.(e);
    animatePressIn();
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    onPressOut?.(e);
    animatePressOut();
  };

  const borderRadius =
    buttonTheme.borderRadius * (themeOverrides?.roundness ?? 5);
  const iconSize = buttonTheme.iconSize;
  const { backgroundColor, borderColor, borderWidth, textColor } =
    buttonTheme.buttonStyle;

  const disabledLabel = disabled ? 'disabled' : 'enabled';
  const backgroundColorStyle =
    customButtonColor && !disabled
      ? customButtonColor
      : backgroundColor[disabledLabel][mode] ?? backgroundColor.default;

  const borderColorStyle =
    borderColor[disabledLabel][mode] ?? borderColor.default;
  const borderWidthStyle = borderWidth[mode] ?? borderWidth.default;

  const textColorStyle =
    customTextColor && !disabled
      ? customTextColor
      : textColor.getTextColor({
          backgroundColor: backgroundColorStyle,
          isMode,
          disabled,
          dark,
        });

  const rippleColor = color(textColorStyle).alpha(0.12).rgb().string();

  const buttonStyle = {
    backgroundColor: backgroundColorStyle,
    borderColor: borderColorStyle,
    borderWidth: borderWidthStyle,
    borderRadius,
  };
  const touchableStyle = {
    borderRadius: style
      ? ((StyleSheet.flatten(style) || {}) as ViewStyle).borderRadius ??
        borderRadius
      : borderRadius,
  };

  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};

  const textStyle = {
    color: textColorStyle,
    ...buttonTheme.font,
  };

  const iconStyle =
    StyleSheet.flatten(contentStyle)?.flexDirection === 'row-reverse'
      ? [
          styles.iconReverse,
          buttonTheme.iconStyle.icon.reverse[compact ? 'compact' : 'normal'],
          isMode('text') &&
            buttonTheme.iconStyle.textMode.reverse[
              compact ? 'compact' : 'normal'
            ],
        ]
      : [
          styles.icon,
          buttonTheme.iconStyle.icon.forward[compact ? 'compact' : 'normal'],
          isMode('text') &&
            buttonTheme.iconStyle.textMode.forward[
              compact ? 'compact' : 'normal'
            ],
        ];

  return (
    <Surface
      {...rest}
      style={
        [
          styles.button,
          compact && styles.compact,
          buttonStyle,
          style,
          buttonTheme.surfaceStyle.getElevationStyle(elevationAnim),
        ] as ViewStyle
      }
      {...buttonTheme.surfaceStyle.getElevationProp(elevationAnim)}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        delayLongPress={delayLongPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessible={accessible}
        disabled={disabled}
        rippleColor={rippleColor}
        style={touchableStyle}
        testID={testID}
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
                    : textColorStyle
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
                  : textColorStyle
              }
              style={iconStyle}
            />
          ) : null}
          <Text
            variant="labelLarge"
            selectable={false}
            numberOfLines={1}
            style={[
              styles.label,
              buttonTheme.textStyle.getTextLabel(
                isMode('text'),
                Boolean(icon || loading)
              ),

              compact && styles.compactLabel,
              uppercase && styles.uppercaseLabel,
              textStyle,
              labelStyle,
            ]}
          >
            {'new'}
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
  /* eslint-enable react-native/no-unused-styles */
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
  uppercaseLabel: {
    textTransform: 'uppercase',
  },
});

export default Button;
