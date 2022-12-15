import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import CrossFadeIcon from '../CrossFadeIcon';
import Icon, { IconSource } from '../Icon';
import Surface from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { getIconButtonColor } from './utils';

const PADDING = 8;

type IconButtonMode = 'outlined' | 'contained' | 'contained-tonal';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Icon to display.
   */
  icon: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Mode of the icon button. By default there is no specified mode - only pressable icon will be rendered.
   */
  mode?: IconButtonMode;
  /**
   * @renamed Renamed from 'color' to 'iconColor' in v5.x
   * Color of the icon.
   */
  iconColor?: string;
  /**
   * Background color of the icon container.
   */
  containerColor?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Whether icon button is selected. A selected button receives alternative combination of icon and container colors.
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
  ref?: React.RefObject<View>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * An icon button is a button which displays only an icon without a label.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/icon-button-1.png" />
 *     <figcaption>Default icon button</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/icon-button-2.png" />
 *     <figcaption>Contained icon button</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/icon-button-3.png" />
 *     <figcaption>Contained-tonal icon button</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/icon-button-4.png" />
 *     <figcaption>Outlined icon button</figcaption>
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
 *     iconColor={MD3Colors.error50}
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
const IconButton = React.forwardRef<View, Props>(
  (
    {
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
      style,
      ...rest
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme();
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
      <Surface
        ref={ref}
        style={
          [
            {
              backgroundColor,
              width: buttonSize,
              height: buttonSize,
            },
            styles.container,
            borderStyles,
            !isV3 && disabled && styles.disabled,
            style,
          ] as StyleProp<ViewStyle>
        }
        {...(isV3 && { elevation: 0 })}
      >
        <TouchableRipple
          borderless
          centered
          onPress={onPress}
          rippleColor={rippleColor}
          accessibilityLabel={accessibilityLabel}
          style={[
            styles.touchable,
            { borderRadius: borderStyles.borderRadius },
          ]}
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
          <IconComponent color={iconColor} source={icon} size={size} />
        </TouchableRipple>
      </Surface>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    margin: 6,
    elevation: 0,
  },
  touchable: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.32,
  },
});

export default IconButton;
