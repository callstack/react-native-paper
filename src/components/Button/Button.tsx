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

import ActivityIndicator from '../ActivityIndicator';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import { buttonMode, getButtonColors } from './helpers';

type Props = React.ComponentProps<typeof Surface> & {
  /**
   * @supported Modes 'elevated' and 'contained-tonal' available in v3.x with theme version 3.
   *
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline, used for the lowest priority actions, especially when presenting multiple options.
   * - `outlined` - button with an outline without background, typically used for important, but not primary action – represents medium emphasis.
   * - `contained` - button with a background color, used for important action, have the most visual impact and high emphasis.
   * - `elevated` - button with a background color and elevation, used when absolutely necessary e.g. button requires visual separation from a patterned background.
   * - `container-tonal` - button with a secondary background color, an alternative middle ground between contained and outlined buttons.
   */
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
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
   * Accessibility hint for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityHint?: string;
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
  theme: Theme;
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
  accessibilityLabel,
  accessibilityHint,
  onPress,
  onLongPress,
  style,
  theme,
  uppercase = !theme.isV3,
  contentStyle,
  labelStyle,
  testID,
  accessible,
  ...rest
}: Props) => {
  const isMode = React.useCallback(
    (modeToCompare: buttonMode) => {
      return mode === modeToCompare;
    },
    [mode]
  );
  const { roundness, isV3 } = theme;

  const isElevationEntitled = isV3 ? isMode('elevated') : isMode('contained');
  const initialElevation = theme.isV3 ? 1 : 2;
  const activeElevation = theme.isV3 ? 2 : 8;

  const { current: elevation } = React.useRef<Animated.Value>(
    new Animated.Value(isElevationEntitled ? initialElevation : 0)
  );

  React.useEffect(() => {
    elevation.setValue(isElevationEntitled ? initialElevation : 0);
  }, [isElevationEntitled, elevation, initialElevation]);

  const handlePressIn = () => {
    if (isMode('contained')) {
      const { scale } = theme.animation;
      Animated.timing(elevation, {
        toValue: activeElevation,
        duration: 200 * scale,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (isMode('contained')) {
      const { scale } = theme.animation;
      Animated.timing(elevation, {
        toValue: initialElevation,
        duration: 150 * scale,
        useNativeDriver: false,
      }).start();
    }
  };

  const font = theme.fonts.medium;

  const borderRadius = (isV3 ? 5 : 1) * roundness;
  const iconSize = isV3 ? 18 : 16;

  const { backgroundColor, borderColor, textColor, borderWidth } =
    getButtonColors({
      buttonColor,
      theme,
      mode,
      disabled,
      dark,
    });

  const rippleColor = color(textColor).alpha(0.12).rgb().string();

  const buttonStyle = {
    backgroundColor,
    borderColor,
    borderWidth,
    borderRadius,
  };
  const touchableStyle = {
    borderRadius: style
      ? ((StyleSheet.flatten(style) || {}) as ViewStyle).borderRadius ||
        borderRadius
      : borderRadius,
  };

  const { color: customLabelColor, fontSize: customLabelSize } =
    StyleSheet.flatten(labelStyle) || {};

  const textStyle = { color: textColor, ...font };
  const elevationRes = disabled || !isElevationEntitled ? 0 : elevation;
  const iconStyle =
    StyleSheet.flatten(contentStyle)?.flexDirection === 'row-reverse'
      ? [
          styles.iconReverse,
          isV3 && styles.md3IconReverse,
          isV3 && isMode('text') && styles.md3IconReverseTextMode,
        ]
      : [
          styles.icon,
          isV3 && styles.md3Icon,
          isV3 && isMode('text') && styles.md3IconTextMode,
        ];

  return (
    <Surface
      {...rest}
      style={[
        styles.button,
        compact && styles.compact,
        buttonStyle,
        style,
        !theme.isV3 && ({ elevation: elevationRes } as ViewStyle),
      ]}
      {...(theme.isV3 && { elevation: elevationRes })}
    >
      <TouchableRipple
        borderless
        delayPressIn={0}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
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
            numberOfLines={1}
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
              !isV3 && font,
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
  md3Icon: {
    marginLeft: 16,
    marginRight: -16,
  },
  md3IconReverse: {
    marginLeft: -16,
    marginRight: 16,
  },
  md3IconTextMode: {
    marginLeft: 12,
    marginRight: -8,
  },
  md3IconReverseTextMode: {
    marginLeft: -8,
    marginRight: 12,
  },
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

export default withTheme(Button);
