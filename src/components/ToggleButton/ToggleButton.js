/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme } from '../../core/theming';
import color from 'color';
import IconButton from '../IconButton';
import ToggleGroup, { ToggleGroupContext } from './ToggleGroup';
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
  /**
   * Show a outlined `ToggleButton` (with border color). If outlined prop is not provided,
   * then border color used is the default from theme prop.
   */
  outlined?: boolean,
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
  // @component ./ToggleButton.js
  static Group = ToggleGroup;

  render() {
    const {
      icon,
      size,
      theme,
      accessibilityLabel,
      disabled,
      style,
      color: buttonColor,
      outlined,
      value,
      status,
    } = this.props;
    const { colors } = theme;
    let textColor, backgroundColor;

    return (
      <ToggleGroupContext.Consumer>
        {(context: ?{ value: string, onValueChange: Function }) => {
          const checked: ?boolean =
            (context && context.value === value) || status === 'checked';

          if (checked) {
            backgroundColor = colors.primary;
          } else {
            backgroundColor = colors.background;
          }

          if (buttonColor) {
            textColor = buttonColor;
          } else {
            textColor = color(backgroundColor).dark() ? white : black;
          }

          if (disabled) {
            textColor = color(textColor)
              .alpha(0.32)
              .rgb()
              .string();
          }

          return (
            <IconButton
              icon={icon}
              onPress={() => {
                if (this.props.onPress) {
                  this.props.onPress(status);
                }

                if (context) {
                  context.onValueChange(!checked ? value : null);
                }
              }}
              color={textColor}
              size={size}
              accessibilityLabel={accessibilityLabel}
              disabled={disabled}
              style={[
                styles.content,
                style || {
                  backgroundColor,
                  borderColor: outlined
                    ? color(theme.dark ? white : black)
                        .alpha(0.29)
                        .rgb()
                        .string()
                    : colors.background,
                  borderWidth: StyleSheet.hairlineWidth,
                },
              ]}
            />
          );
        }}
      </ToggleGroupContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    width: 42,
    height: 42,
    borderRadius: 0,
    margin: 0,
  },
});

export default withTheme(ToggleButton);
