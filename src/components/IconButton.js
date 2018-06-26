/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import TouchableRipple from './TouchableRipple';
import Icon from './Icon';
import type { IconSource } from './Icon';

type Props = {
  /**
   * Source of the icon to show.
   */
  source: IconSource,
  /**
   * Color of the icon.
   */
  color: string,
  /**
   * Size of the icon.
   */
  size?: number,
  /**
   * Function to execute on press.
   */
  onPress: ?Function,
  style?: any,
};

/**
 * An icon button is a component that the user can press to trigger an action.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/icon-button-1.png" />
 *     <figcaption>Icon button</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/icon-button-2.png" />
 *     <figcaption>Focused icon button</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { IconButton } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <IconButton source="add-a-photo" color="#FF0000" size={20} onPress={() => console.log('Pressed')} />
 * );
 * ```
 */
const IconButton = ({
  source,
  color: iconColor,
  size = 24,
  onPress,
  style,
  ...rest
}: Props) => {
  const rippleColor = color(iconColor)
    .alpha(0.32)
    .rgb()
    .string();

  return (
    <TouchableRipple
      borderless
      onPress={onPress}
      rippleColor={rippleColor}
      hitSlop={
        TouchableRipple.supported
          ? { top: 10, left: 10, bottom: 10, right: 10 }
          : { top: 6, left: 6, bottom: 6, right: 6 }
      }
      style={[styles.container, style]}
      {...rest}
    >
      <View>
        <Icon color={iconColor} source={source} size={size} />
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
});

export default IconButton;
