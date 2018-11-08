/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';
import { withTheme } from '../core/theming';
import type { IconSource } from './Icon';
import type { Theme, $RemoveChildren } from '../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {|
  /**
   * Icon to display.
   */
  icon: IconSource,
  /**
   * Color of the icon.
   */
  color?: string,
  /**
   * Size of the icon.
   */
  size?: number,
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * An icon button is a button which displays only an icon without a label.
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
 *     icon="add-a-photo"
 *     color={Colors.red500}
 *     size={20}
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
const IconButton = ({
  icon,
  color: customColor,
  size = 24,
  accessibilityLabel,
  disabled,
  onPress,
  theme,
  style,
  ...rest
}: Props) => {
  const iconColor =
    typeof customColor !== 'undefined' ? customColor : theme.colors.text;
  const rippleColor = color(iconColor)
    .alpha(0.32)
    .rgb()
    .string();

  return (
    <TouchableRipple
      borderless
      onPress={onPress}
      rippleColor={rippleColor}
      style={[styles.container, disabled && styles.disabled, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityStates={disabled ? ['disabled'] : undefined}
      disabled={disabled}
      hitSlop={
        TouchableRipple.supported
          ? { top: 10, left: 10, bottom: 10, right: 10 }
          : { top: 6, left: 6, bottom: 6, right: 6 }
      }
      {...rest}
    >
      <View>
        <Icon color={iconColor} source={icon} size={size} />
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  container: TouchableRipple.supported
    ? {
        height: 28,
        width: 28,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }
    : {
        borderRadius: 36 / 2,
        height: 36,
        width: 36,
        margin: 6,
        alignItems: 'center',
        justifyContent: 'center',
      },
  disabled: {
    opacity: 0.32,
  },
});

export default withTheme(IconButton);
