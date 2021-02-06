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
   * Custom component to display inside the dropdown instead of the label
   */
  render?: (props: {
    onPress: () => void;
    disabled: boolean;
  }) => React.ReactNode;
  /**
   * Label that will show if the current option is selected.
   */
  label?: string;
  /**
   * Render custom label that will appear on the Dropdown when this option is selected.
   * This will override the label property.
   */
  renderLabel?: () => React.ReactNode;
  /**
   * Whether the option is disabled or not
   */
  disabled?: boolean;
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
 *          key={1}
 *          label="Option 1"
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
  const { render, label, style, disabled = false } = props;
  const context = React.useContext(DropdownContext);

  if (!context) {
    throw new Error('Dropdown.Option is used outside a Dropdown.');
  }

  const selectOption = () => context.selectOption(props);

  if (!render) {
    return (
      <List.Item
        titleStyle={{
          color: props.disabled
            ? props.theme.colors.disabled
            : props.theme.colors.text,
        }}
        disabled={disabled}
        style={style}
        title={label}
        onPress={selectOption}
      />
    );
  }

  return (
    <TouchableRipple onPress={selectOption}>
      {render({ onPress: selectOption, disabled })}
    </TouchableRipple>
  );
}

DropdownOption.displayName = 'Dropdown.Option';

export default withTheme(DropdownOption);
