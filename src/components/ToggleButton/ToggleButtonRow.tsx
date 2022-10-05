import * as React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

import ToggleButton from './ToggleButton';
import ToggleButtonGroup from './ToggleButtonGroup';

export type Props = {
  /**
   * Function to execute on selection change.
   */
  onValueChange: (value: string) => void;
  /**
   * Value of the currently selected toggle button.
   */
  value: string;
  /**
   * React elements containing toggle buttons.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Toggle button row renders a group of toggle buttons in a row.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/toggle-button-row.gif" />
 *   </figure>
 * </div>
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
 *     <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
 *       <ToggleButton icon="format-align-left" value="left" />
 *       <ToggleButton icon="format-align-right" value="right" />
 *     </ToggleButton.Row>
 *   );
 * };
 *
 * export default MyComponent;
 *
 *```
 */
const ToggleButtonRow = ({ value, onValueChange, children, style }: Props) => {
  const count = React.Children.count(children);

  return (
    <ToggleButtonGroup value={value} onValueChange={onValueChange}>
      <View style={[styles.row, style]}>
        {React.Children.map(children, (child, i) => {
          // @ts-expect-error: TypeScript complains about child.type but it doesn't matter
          if (child && child.type === ToggleButton) {
            // @ts-expect-error: We're sure that child is a React Element
            return React.cloneElement(child, {
              style: [
                styles.button,
                i === 0
                  ? styles.first
                  : i === count - 1
                  ? styles.last
                  : styles.middle,
                // @ts-expect-error: We're sure that child is a React Element
                child.props.style,
              ],
            });
          }

          return child;
        })}
      </View>
    </ToggleButtonGroup>
  );
};

ToggleButtonRow.displayName = 'ToggleButton.Row';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  button: {
    borderWidth: StyleSheet.hairlineWidth,
  },

  first: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },

  middle: {
    borderRadius: 0,
    borderLeftWidth: 0,
  },

  last: {
    borderLeftWidth: 0,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
});

export default ToggleButtonRow;

// @component-docs ignore-next-line
export { ToggleButtonRow };
