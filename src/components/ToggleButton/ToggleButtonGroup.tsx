import * as React from 'react';

export type Props<Value = string> = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: Value) => void;
  /**
   * Value of the currently selected toggle button.
   */
  value: Value | null;
  /**
   * React elements containing toggle buttons.
   */
  children: React.ReactNode;
};

type ToggleButtonContextType<Value> = {
  value: Value | null;
  onValueChange: (item: Value) => void;
};

export const ToggleButtonGroupContext =
  //@ts-expect-error: TS can't ensure the type from Group to children
  React.createContext<ToggleButtonContextType>(null as any);

/**
 * Toggle group allows to control a group of toggle buttons.</br>
 * It doesn't change the appearance of the toggle buttons. If you want to group them in a row, check out [ToggleButton.Row](ToggleButtonRow).
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ToggleButton } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('left');
 *
 *   return (
 *     <ToggleButton.Group
 *       onValueChange={value => setValue(value)}
 *       value={value}>
 *       <ToggleButton icon="format-align-left" value="left" />
 *       <ToggleButton icon="format-align-right" value="right" />
 *     </ToggleButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const ToggleButtonGroup = <Value = string,>({
  value,
  onValueChange,
  children,
}: Props<Value>) => (
  <ToggleButtonGroupContext.Provider
    value={{
      value,
      onValueChange,
    }}
  >
    {children}
  </ToggleButtonGroupContext.Provider>
);

ToggleButtonGroup.displayName = 'ToggleButton.Group';

export default ToggleButtonGroup;

// @component-docs ignore-next-line
export { ToggleButtonGroup };
