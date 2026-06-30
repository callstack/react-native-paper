import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import ToggleButtonGroup from './ToggleButtonGroup';
import { ToggleButtonRowContext } from './ToggleButtonRowContext';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

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
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const SEGMENTED_ROW_CONTEXT = { segmented: true };

/**
 * Toggle button row renders a group of toggle buttons in a row.
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
const ToggleButtonRow = ({
  value,
  onValueChange,
  children,
  style,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const borderRadius = theme.shapes.corner.largeIncreased;
  const outlineColor = theme.colors.outline;

  return (
    <ToggleButtonGroup value={value} onValueChange={onValueChange}>
      <ToggleButtonRowContext.Provider value={SEGMENTED_ROW_CONTEXT}>
        <View style={style}>
          <View
            style={[
              styles.row,
              {
                backgroundColor: outlineColor,
                borderRadius,
              },
            ]}
          >
            {children}
          </View>
        </View>
      </ToggleButtonRowContext.Provider>
    </ToggleButtonGroup>
  );
};

ToggleButtonRow.displayName = 'ToggleButton.Row';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    padding: StyleSheet.hairlineWidth,
  },
});

export default ToggleButtonRow;

// @component-docs ignore-next-line
export { ToggleButtonRow };
