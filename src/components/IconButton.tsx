import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  GestureResponderEvent,
  TouchableWithoutFeedback,
} from 'react-native';
import color from 'color';

import TouchableRipple from './TouchableRipple/TouchableRipple';
import Icon, { IconSource } from './Icon';
import CrossFadeIcon from './CrossFadeIcon';
import { withTheme } from '../core/theming';

import type { $RemoveChildren } from '../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * Color of the icon.
   */
  color?: string;
  /**
   * Size of the icon.
   */
  size?: number;
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
  accessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  ref?: React.RefObject<TouchableWithoutFeedback>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

/**
 * An icon button is a button which displays only an icon without a label.
 * By default button has 150% size of the icon.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/icon-button-1.png" />
 *     <figcaption>Icon button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/icon-button-2.png" />
 *     <figcaption>Pressed icon button</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { IconButton, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <IconButton
 *     icon="camera"
 *     color={Colors.red500}
 *     size={20}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/touchable-ripple.html
 */
const IconButton = ({
  icon,
  color: customColor,
  size = 24,
  accessibilityLabel,
  disabled,
  onPress,
  animated = false,
  theme,
  style,
  ...rest
}: Props) => {
  const iconColor =
    typeof customColor !== 'undefined' ? customColor : theme.colors.text;
  const rippleColor = color(iconColor).alpha(0.32).rgb().string();
  const IconComponent = animated ? CrossFadeIcon : Icon;
  const buttonSize = size * 1.5;
  return (
    <TouchableRipple
      borderless
      centered
      onPress={onPress}
      rippleColor={rippleColor}
      style={[
        styles.container,
        { width: buttonSize, height: buttonSize, borderRadius: buttonSize / 2 },
        disabled && styles.disabled,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={
        // @ts-ignore - this should be fixed in react-theme-providersince withTheme() is not forwarding static property types
        TouchableRipple.supported
          ? { top: 10, left: 10, bottom: 10, right: 10 }
          : { top: 6, left: 6, bottom: 6, right: 6 }
      }
      {...rest}
    >
      <View>
        <IconComponent color={iconColor} source={icon} size={size} />
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  // @ts-ignore - this should be fixed in react-theme-providersince withTheme() is not forwarding static property types
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 6,
  },
  disabled: {
    opacity: 0.32,
  },
});

export default withTheme(IconButton);
