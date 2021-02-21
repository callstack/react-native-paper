import * as React from 'react';
import {
  Animated,
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import color from 'color';

import ActivityIndicator from './ActivityIndicator';
import Icon, { IconSource } from './Icon';
import Surface from './Surface';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple/TouchableRipple';
import { black, white } from '../styles/colors';
import { withTheme } from '../core/theming';

type Props = React.ComponentProps<typeof Surface> & {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   */
  mode?: 'text' | 'outlined' | 'contained';
  /**
   * Whether the color is a dark color. A dark button will render light text and vice-versa. Only applicable for `contained` mode.
   */
  dark?: boolean;
  /**
   * Use a compact look, useful for `text` buttons in a row.
   */
  compact?: boolean;
  /**
   * Custom text color for flat button, or background color for contained button.
   */
  color?: string;
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
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: () => void;
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
  theme: ReactNativePaper.Theme;
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
  color: buttonColor,
  children,
  uppercase = true,
  accessibilityLabel,
  onPress,
  onLongPress,
  style,
  theme,
  contentStyle,
  labelStyle,
  testID,
  accessible,
  ...rest
}: Props) => {
  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(mode === 'contained' ? 2 : 0)
  );

  const handlePressIn = () => {
    if (mode === 'contained') {
      const { scale } = theme.animation;
      Animated.timing(elevation, {
        toValue: 8,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (mode === 'contained') {
      const { scale } = theme.animation;
      Animated.timing(elevation, {
        toValue: 2,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  };

  const { colors, roundness } = theme;
  const font = theme.fonts.medium;

  let backgroundColor: string,
    borderColor: string,
    textColor: string,
    borderWidth: number;

  if (mode === 'contained') {
    if (disabled) {
      backgroundColor = color(theme.dark ? white : black)
        .alpha(0.12)
        .rgb()
        .string();
    } else if (buttonColor) {
      backgroundColor = buttonColor;
    } else {
      backgroundColor = colors.primary;
    }
  } else {
    backgroundColor = 'transparent';
  }

  if (mode === 'outlined') {
    borderColor = color(theme.dark ? white : black)
      .alpha(0.29)
      .rgb()
      .string();
    borderWidth = StyleSheet.hairlineWidth;
  } else {
    borderColor = 'transparent';
    borderWidth = 0;
  }

  if (disabled) {
    textColor = color(theme.dark ? white : black)
      .alpha(0.32)
      .rgb()
      .string();
  } else if (mode === 'contained') {
    let isDark;

    if (typeof dark === 'boolean') {
      isDark = dark;
    } else {
      isDark =
        backgroundColor === 'transparent'
          ? false
          : !color(backgroundColor).isLight();
    }

    textColor = isDark ? white : black;
  } else if (buttonColor) {
    textColor = buttonColor;
  } else {
    textColor = colors.primary;
  }

  const rippleColor = color(textColor).alpha(0.32).rgb().string();
  const buttonStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius: roundness,
  };
  const touchableStyle = {
    borderRadius: style
      ? ((StyleSheet.flatten(style) || {}) as ViewStyle).borderRadius ||
        roundness
      : roundness,
  };

  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};

  const textStyle = { color: textColor, ...font };
  const elevationRes = disabled || mode !== 'contained' ? 0 : elevation;
  const iconStyle =
    StyleSheet.flatten(contentStyle)?.flexDirection === 'row-reverse'
      ? styles.iconReverse
      : styles.icon;

  return (
    <Surface
      {...rest}
      style={[
        styles.button,
        compact && styles.compact,
        { elevation: elevationRes } as ViewStyle,
        buttonStyle,
        style,
      ]}
    >
      <TouchableRipple
        borderless
        delayPressIn={0}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
        accessibilityComponentType="button"
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
            <View style={iconStyle}>
              <Icon
                source={icon}
                size={customLabelSize ?? 16}
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
              size={customLabelSize ?? 16}
              color={
                typeof customLabelColor === 'string'
                  ? customLabelColor
                  : textColor
              }
              style={iconStyle}
            />
          ) : null}
          <Text
            selectable={false}
            numberOfLines={1}
            style={[
              styles.label,
              compact && styles.compactLabel,
              uppercase && styles.uppercaseLabel,
              textStyle,
              font,
              labelStyle,
            ]}
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
  label: {
    textAlign: 'center',
    letterSpacing: 1,
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

export default withTheme(Button);
