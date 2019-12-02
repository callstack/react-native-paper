import * as React from 'react';
import { Platform } from 'react-native';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButtonAndroid from './RadioButtonAndroid';
import RadioButtonIOS from './RadioButtonIOS';
import RadioButtonItem from './RadioButtonItem';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

export type Props = {
  /**
   * Value of the radio button
   */
  value: string;
  /**
   * Status of radio button.
   */
  status?: 'checked' | 'unchecked';
  /**
   * Whether radio is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Custom color for unchecked radio.
   */
  uncheckedColor?: string;
  /**
   * Custom color for radio.
   */
  color?: string;
  /**
   * @optional
   */
  theme: Theme;
};

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
  // @component ./RadioButtonGroup.tsx
  static Group = RadioButtonGroup;

  // @component ./RadioButtonAndroid.tsx
  static Android = RadioButtonAndroid;

  // @component ./RadioButtonIOS.tsx
  static IOS = RadioButtonIOS;

  // @component = ./RadioButtonItem.tsx
  static Item = RadioButtonItem;

  render() {
    const Button = Platform.select({
      default: RadioButtonAndroid,
      ios: RadioButtonIOS,
    });

    return <Button {...this.props} />;
  }
}

export default withTheme(RadioButton);
