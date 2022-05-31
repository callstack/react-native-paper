import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  GestureResponderEvent,
  TouchableWithoutFeedback,
} from 'react-native';

import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Icon, { IconSource } from '../Icon';
import CrossFadeIcon from '../CrossFadeIcon';
import { withTheme } from '../../core/theming';
import type { $RemoveChildren, Theme } from '../../types';
import { getIconButtonColor } from './utils';

const PADDING = 8;

type IconButtonMode = 'outlined' | 'contained' | 'contained-tonal';

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * @supported Available in v3.x
   * Mode of the icon button. By default there is no specified mode - only pressable icon will be rendered.
   */
  mode?: IconButtonMode;
  /**
   * @renamed Renamed from 'color' to 'iconColor' in v3.x
   * Color of the icon.
   */
  iconColor?: string;
  /**
   * @supported Available in v3.x
   * Background color of the icon container.
   */
  containerColor?: string;
  /**
   * @supported Available in v3.x
   * Whether icon button is selected.
   */
  selected?: boolean;
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
  theme: Theme;
};

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
 * import { IconButton, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <IconButton
 *     icon="camera"
 *     color={MD3Colors.error50}
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
  iconColor: customIconColor,
  containerColor: customContainerColor,
  size = 24,
  accessibilityLabel,
  disabled,
  onPress,
  selected = false,
  animated = false,
  mode,
  theme,
  style,
  ...rest
}: Props) => {
  const { isV3 } = theme;
  const IconComponent = animated ? CrossFadeIcon : Icon;

  const { iconColor, rippleColor, backgroundColor, borderColor } =
    getIconButtonColor({
      theme,
      disabled,
      selected,
      mode,
      customIconColor,
      customContainerColor,
    });

  const buttonSize = isV3 ? size + 2 * PADDING : size * 1.5;

  const borderStyles = {
    borderWidth: isV3 && mode === 'outlined' && !selected ? 1 : 0,
    borderRadius: buttonSize / 2,
    borderColor,
  };

  return (
    <TouchableRipple
      borderless
      centered
      onPress={onPress}
      rippleColor={rippleColor}
      style={[
        styles.container,
        {
          width: buttonSize,
          height: buttonSize,
          backgroundColor,
        },
        borderStyles,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
      accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
      accessibilityComponentType="button"
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={
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
