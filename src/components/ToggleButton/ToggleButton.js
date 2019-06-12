/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../../core/theming';
import color from 'color';
import IconButton from '../IconButton';
import ToggleButtonGroup, {
  ToggleButtonGroupContext,
} from './ToggleButtonGroup';
import { black, white } from '../../styles/colors';
import type { IconSource } from '../Icon';
import type { Theme } from '../../types';

type Props = {
  /**
   * Icon to display for the `ToggleButton`.
   */
  icon: IconSource,
  /**
   * Size of the icon.
   */
  size?: number,
  /**
   * Custom text color for button.
   */
  color?: string,
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean,
  /**
   * Accessibility label for the `ToggleButton`. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string,
  /**
   * Function to execute on press.
   */
  onPress?: (value: ?string) => mixed,
  /**
   * Value of button.
   */
  value?: string,
  /**
   * Status of button.
   */
  status?: 'checked' | 'unchecked',
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
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
 * class ToggleButtonExample extends React.Component {
 *   state = {
 *     status: 'checked',
 *   };
 *
 *   render() {
 *     return (
 *       <ToggleButton
 *         icon="bluetooth"
 *         value="bluetooth"
 *         status={this.state.status}
 *         onPress={value =>
 *           this.setState({
 *             status: value === 'checked' ? 'unchecked' : 'checked',
 *           })
 *         }
 *       />
 *     );
 *   }
 * }
 * ```
 */
class ToggleButton extends React.Component<Props> {
  // @component ./ToggleButtonGroup.js
  static Group = ToggleButtonGroup;

  render() {
    const {
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
    } = this.props;
    const borderRadius = theme.roundness;

    return (
      <ToggleButtonGroupContext.Consumer>
        {(context: ?{ value: string, onValueChange: Function }) => {
          let backgroundColor;

          const checked: ?boolean =
            (context && context.value === value) || status === 'checked';

          if (checked) {
            backgroundColor = theme.dark
              ? 'rgba(255, 255, 255, .12)'
              : 'rgba(0, 0, 0, .08)';
          } else {
            backgroundColor = 'transparent';
          }

          return (
            <IconButton
              borderless={false}
              icon={icon}
              onPress={e => {
                if (onPress) {
                  onPress(e);
                }

                if (context) {
                  context.onValueChange(!checked ? value : null);
                }
              }}
              size={size}
              accessibilityLabel={accessibilityLabel}
              disabled={disabled}
              style={[
                styles.content,
                {
                  backgroundColor,
                  borderRadius,
                  borderColor: color(theme.dark ? white : black)
                    .alpha(0.29)
                    .rgb()
                    .string(),
                },
                style,
              ]}
              {...rest}
            />
          );
        }}
      </ToggleButtonGroupContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: 42,
    height: 42,
    margin: 0,
  },
});

export default withTheme(ToggleButton);
