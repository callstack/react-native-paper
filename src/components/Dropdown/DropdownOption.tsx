import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { withTheme } from '../../core/theming';
import { DropdownContext } from './Dropdown';
import * as List from '../List/List';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export interface Props<T> {
  /**
   * @optional
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  /**
   * Value represented by the dropdown option
   */
  value: T | null;
  /**
   * Custom component to display instead of the label
   */
  children?: React.ReactNode;
  /**
   * Label that will show if the current option is selected.
   * If undefined the title prop will be used instead
   */
  label?: string;
  /**
   * Render custom label that will appear on the Dropdown when this option is selected
   */
  renderLabel?: () => React.ReactNode;
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
function DropdownOption<T = any>(props: Props<T>) {
  const { children, label, style } = props;
  const context = React.useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown.Option is used outside a Dropdown.');
  }

  if (!children) {
    return (
      <List.Item
        style={style}
        title={label}
        onPress={() => context.onSelect(props)}
      />
    );
  }

  return (
    <TouchableRipple onPress={() => context.onSelect(props)}>
      {children}
    </TouchableRipple>
  );
}

export default withTheme(DropdownOption);

// @component-docs ignore-next-line
export { DropdownOption };
