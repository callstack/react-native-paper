import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import color from 'color';

import { withInternalTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import type { InternalTheme } from '../../types';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';
import { ToggleButtonGroupContext } from './ToggleButtonGroup';
import { getToggleButtonColor } from './utils';

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
  color?: string;
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
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

/**
 * Toggle buttons can be used to group related options. To emphasize groups of related toggle buttons,
 * a group should share a common container.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/toggle-button.png" />
 * </div>
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
const ToggleButton = ({
  icon,
  size,
  theme,
  accessibilityLabel,
  disabled,
  style,
  value,
  status,
  onPress,
  ...rest
}: Props) => {
  const borderRadius = theme.roundness;

  return (
    <ToggleButtonGroupContext.Consumer>
      {(context: { value: string | null; onValueChange: Function } | null) => {
        const checked: boolean | null =
          (context && context.value === value) || status === 'checked';

        const backgroundColor = getToggleButtonColor({ theme, checked });
        const borderColor = theme.isV3
          ? theme.colors.outline
          : color(theme.dark ? white : black)
              .alpha(0.29)
              .rgb()
              .string();

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
            {...rest}
          />
        );
      }}
    </ToggleButtonGroupContext.Consumer>
  );
};

const styles = StyleSheet.create({
  content: {
    width: 42,
    height: 42,
    margin: 0,
  },
});

export default withInternalTheme(ToggleButton);

// @component-docs ignore-next-line
const ToggleButtonWithTheme = withInternalTheme(ToggleButton);
// @component-docs ignore-next-line
export { ToggleButtonWithTheme as ToggleButton };
