import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { withTheme } from '../../core/theming';

export interface Props<T> {
  /**
   * @optional
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ReactNativePaper.Theme;
  /**
   * Value represented by the dropdown option
   */
  value: T | null;
  /**
   * Required unique key
   */
  optionKey: React.Key;
  /**
   * Title that will be shown in the dropdown menu when opened
   */
  title?: React.ReactNode;
  /**
   * Description will appear below the title when the menu is open
   */
  description?: React.ReactNode;
  /**
   * Label that will show if the current option is selected.
   * If undefined the title prop will be used instead
   */
  label?: string;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: {
    color: string;
    style?: {
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: {
    color: string;
    style: {
      marginLeft: number;
      marginRight: number;
      marginVertical?: number;
    };
  }) => React.ReactNode;
}

/**
 * A dropdown option can only be rendered within a Dropdown component
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import {
 *   Dropdown,
 *   IconButton,
 *   Provider,
 *   Text,
 *   Title,
 * } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   return (
 *     <Provider>
 *       <Dropdown>
 *         <Dropdown.Option
 *          value={1}
 *          optionKey={1}
 *          title="Option 1"
 *          left={() => <IconButton icon="emoticon"/>}
 *          label="Option 1 is selected!"
 *         />
 *       </Dropdown>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
class DropdownOption<T> extends React.Component<
  Props<T> & { theme: ReactNativePaper.Theme }
> {
  static displayName = 'Dropdown.Option';

  // eslint-disable-next-line react/require-render-return
  render(): React.ReactNode {
    throw new Error('<DropdownOption/> must be a direct child to <Dropdown/>');
  }
}

export default withTheme(DropdownOption);

// @component-docs ignore-next-line
export { DropdownOption };
