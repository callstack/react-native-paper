import * as React from 'react';
import { Platform } from 'react-native';
import CheckboxIOS from './CheckboxIOS';
import CheckboxAndroid from './CheckboxAndroid';
import { withTheme } from '../../core/theming';

export type Props = {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: string;
  /**
   * Custom color for checkbox.
   */
  color?: string;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

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
 * const MyComponent = () => {
 *   const [checked, setChecked] = React.useState(false);
 *
 *   return (
 *     <Checkbox
 *       status={checked ? 'checked' : 'unchecked'}
 *       onPress={() => {
 *         setChecked(!checked);
 *       }}
 *     />
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Checkbox = (props: Props) =>
  Platform.OS === 'ios' ? (
    <CheckboxIOS {...props} />
  ) : (
    <CheckboxAndroid {...props} />
  );

export default withTheme(Checkbox);

// @component-docs ignore-next-line
const CheckboxWithTheme = withTheme(Checkbox);
// @component-docs ignore-next-line
export { CheckboxWithTheme as Checkbox };
