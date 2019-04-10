/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import RadioButtonGroup, { RadioButtonContext } from './RadioButtonGroup';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonIOS from './RadioButtonIOS';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {|
  /**
   * Value of the radio button
   */
  value: string,
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked',
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Custom color for unchecked radio.
   */
  uncheckedColor?: string,
  /**
   * Custom color for radio.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * Radio buttons allow the selection a single option from a set.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/radio-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/radio-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     checked: 'first',
 *   };
 *
 *   render() {
 *     const { checked } = this.state;
 *
 *     return (
 *       <View>
 *         <RadioButton
 *           value="first"
 *           status={checked === 'first' ? 'checked' : 'unchecked'}
 *           onPress={() => { this.setState({ checked: 'first' }); }}
 *         />
 *         <RadioButton
 *           value="second"
 *           status={checked === 'second' ? 'checked' : 'unchecked'}
 *           onPress={() => { this.setState({ checked: 'second' }); }}
 *         />
 *       </View>
 *     );
 *   }
 * }
 * ```
 */
class RadioButton extends React.Component<Props> {
  // @component ./RadioButtonGroup.js
  static Group = RadioButtonGroup;

  // @component ./RadioButtonAndroid.js
  static Android = RadioButtonAndroid;

  // @component ./RadioButtonIOS.js
  static IOS = RadioButtonIOS;

  handlePress = context => {
    const { onPress } = this.props;
    const { onValueChange } = context;

    onPress || onValueChange(this.props.value);
  };

  isChecked = context =>
    context.value === this.props.value ? 'checked' : 'unchecked';

  render() {
    const Button = Platform.select({
      default: RadioButtonAndroid,
      ios: RadioButtonIOS,
    });

    return (
      <RadioButtonContext.Consumer>
        {context => (
          <Button
            {...this.props}
            status={this.props.status || (context && this.isChecked(context))}
            onPress={() => context && this.handlePress(context)}
          />
        )}
      </RadioButtonContext.Consumer>
    );
  }
}

export default withTheme(RadioButton);
