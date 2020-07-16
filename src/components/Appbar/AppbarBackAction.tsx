import * as React from 'react';
import type { $Omit } from './../../types';
import AppbarAction from './AppbarAction';
import AppbarBackIcon from './AppbarBackIcon';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = $Omit<
  React.ComponentPropsWithoutRef<typeof AppbarAction>,
  'icon'
> & {
  /**
   *  Custom color for back icon.
   */
  color?: string;
  /**
   * Optional icon size.
   */
  size?: number;
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component used to display a back button in the appbar.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-backaction-android.png" />
 *     <figcaption>Android</figcaption>
 *   </figure>
 * </div>
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/appbar-backaction-ios.png" />
 *     <figcaption>iOS</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 *
 * const MyComponent = () => (
 *     <Appbar.Header>
 *       <Appbar.BackAction onPress={() => {}} />
 *     </Appbar.Header>
 * );
 *
 * export default MyComponent;
 * ```
 */
class AppbarBackAction extends React.Component<Props> {
  static displayName = 'Appbar.BackAction';

  static defaultProps = {
    accessibilityLabel: 'Back',
  };

  render() {
    return <AppbarAction {...this.props} icon={AppbarBackIcon} />;
  }
}

export default AppbarBackAction;
