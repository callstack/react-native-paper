import * as React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Content of the `DataTableRow`.
   */
  children: React.ReactNode;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * `pointerEvents` passed to the `View` container, which is wrapping children within `TouchableRipple`.
   */
  pointerEvents?: ViewProps['pointerEvents'];
};

/**
 * A component to show a single row inside of a table.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *      <DataTable.Row>
 *        <DataTable.Cell numeric>1</DataTable.Cell>
 *        <DataTable.Cell numeric>2</DataTable.Cell>
 *        <DataTable.Cell numeric>3</DataTable.Cell>
 *        <DataTable.Cell numeric>4</DataTable.Cell>
 *      </DataTable.Row>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const DataTableRow = ({
  onPress,
  style,
  children,
  pointerEvents,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const { colors } = useInternalTheme(themeOverrides);
  const borderBottomColor = colors.surfaceVariant;

  return (
    <TouchableRipple
      {...rest}
      onPress={onPress}
      style={[styles.container, { borderBottomColor }, style]}
    >
      <View style={styles.content} pointerEvents={pointerEvents}>
        {children}
      </View>
    </TouchableRipple>
  );
};

DataTableRow.displayName = 'DataTable.Row';

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default DataTableRow;

// @component-docs ignore-next-line
export { DataTableRow };
