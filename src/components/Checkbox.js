/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import CheckboxAndroid from './CheckboxAndroid';
import CheckboxIOS from './CheckboxIOS';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {|
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate',
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: string,
  /**
   * Custom color for checkbox.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
|};

/**
 * Checkboxes allow the selection of multiple options from a set.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Checkbox } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     checked: false,
 *   };
 *
 *   render() {
 *     const { checked } = this.state;
 *     return (
 *       <Checkbox
 *         status={checked ? 'checked' : 'unchecked'}
 *         onPress={() => { this.setState({ checked: !checked }); }}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class Checkbox extends React.Component<Props> {
  // @component ./CheckboxAndroid.js
  static Android = CheckboxAndroid;

  // @component ./CheckboxIOS.js
  static IOS = CheckboxIOS;

  render() {
    return Platform.OS === 'ios' ? (
      <CheckboxIOS {...this.props} />
    ) : (
      <CheckboxAndroid {...this.props} />
    );
  }
}

export default withTheme(Checkbox);
