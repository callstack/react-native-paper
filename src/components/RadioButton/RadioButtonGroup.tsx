import * as React from 'react';
import { View } from 'react-native';

import useLatestCallback from 'use-latest-callback';

export type Props = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => void;
  /**
   * Value of the currently selected radio button.
   */
  value: string;
  /**
   * React elements containing radio buttons.
   */
  children: React.ReactNode;
};

export type RadioButtonContextType = {
  value: string;
  onValueChange: (item: string) => void;
};

export const RadioButtonContext = React.createContext<RadioButtonContextType>(
  null as any
);

/**
 * Radio button group allows to control a group of radio buttons.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { RadioButton, Text } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [value, setValue] = React.useState('first');
 *
 *   return (
 *     <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
 *       <View>
 *         <Text>First</Text>
 *         <RadioButton value="first" />
 *       </View>
 *       <View>
 *         <Text>Second</Text>
 *         <RadioButton value="second" />
 *       </View>
 *     </RadioButton.Group>
 *   );
 * };
 *
 * export default MyComponent;
 *```
 */
const RadioButtonGroup = ({ value, onValueChange, children }: Props) => {
  // Stabilize the callback so the memoized context value only changes when
  // `value` changes — not on every parent render.
  const stableOnValueChange = useLatestCallback(onValueChange);
  const context = React.useMemo(
    () => ({ value, onValueChange: stableOnValueChange }),
    [value, stableOnValueChange]
  );

  return (
    <RadioButtonContext.Provider value={context}>
      <View accessibilityRole="radiogroup">{children}</View>
    </RadioButtonContext.Provider>
  );
};

RadioButtonGroup.displayName = 'RadioButton.Group';
export default RadioButtonGroup;

// @component-docs ignore-next-line
export { RadioButtonGroup };
