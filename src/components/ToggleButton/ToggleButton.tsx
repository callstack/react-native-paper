import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
  Animated,
  ColorValue,
} from 'react-native';

import { ToggleButtonGroupContext } from './ToggleButtonGroup';
import { getToggleButtonColor } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import { forwardRef } from '../../utils/forwardRef';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';

export type Props = {
  /**
   * Icon to display for the `ToggleButton`.
   */
  icon: IconSource;
  /**
   * Size of the icon.
   */
  size?: number;
  /**
   * Custom text color for button.
   */
  iconColor?: string;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the `ToggleButton`. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: (value?: GestureResponderEvent | string) => void;
  /**
   * Value of button.
   */
  value?: string;
  /**
   * Status of button.
   */
  status?: 'checked' | 'unchecked';
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  ref?: React.RefObject<View>;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

/**
 * Toggle buttons can be used to group related options. To emphasize groups of related toggle buttons,
 * a group should share a common container.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ToggleButton } from 'react-native-paper';
 *
 * const ToggleButtonExample = () => {
 *   const [status, setStatus] = React.useState('checked');
 *
 *   const onButtonToggle = value => {
 *     setStatus(status === 'checked' ? 'unchecked' : 'checked');
 *   };
 *
 *   return (
 *     <ToggleButton
 *       icon="bluetooth"
 *       value="bluetooth"
 *       status={status}
 *       onPress={onButtonToggle}
 *     />
 *   );
 * };
 *
 * export default ToggleButtonExample;
 *
 * ```
 */
const ToggleButton = forwardRef<View, Props>(
  (
    {
      icon,
      size,
      theme: themeOverrides,
      accessibilityLabel,
      disabled,
      style,
      value,
      status,
      onPress,
      rippleColor,
      ...rest
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);
    const borderRadius = theme.roundness;

    return (
      <ToggleButtonGroupContext.Consumer>
        {(
          context: { value: string | null; onValueChange: Function } | null
        ) => {
          const checked: boolean | null =
            (context && context.value === value) || status === 'checked';

          const backgroundColor = getToggleButtonColor({ theme, checked });
          const borderColor = theme.colors.outline;

          return (
            <IconButton
              borderless={false}
              icon={icon}
              onPress={(e?: GestureResponderEvent | string) => {
                if (onPress) {
                  onPress(e);
                }

                if (context) {
                  context.onValueChange(!checked ? value : null);
                }
              }}
              size={size}
              accessibilityLabel={accessibilityLabel}
              accessibilityState={{ disabled, selected: checked }}
              disabled={disabled}
              style={[
                styles.content,
                {
                  backgroundColor,
                  borderRadius,
                  borderColor,
                },
                style,
              ]}
              ref={ref}
              theme={theme}
              rippleColor={rippleColor}
              {...rest}
            />
          );
        }}
      </ToggleButtonGroupContext.Consumer>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    width: 42,
    height: 42,
    margin: 0,
  },
});

export default ToggleButton;

// @component-docs ignore-next-line
export { ToggleButton };
