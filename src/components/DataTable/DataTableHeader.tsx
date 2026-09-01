import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { withColumnIndices } from './DataTableColumnsContext';
import { DataTableRowContext } from './DataTableContext';
import { HORIZONTAL_PADDING } from './tokens';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import webAriaProps from '../../utils/webAriaProps';

export type Props = ViewProps & {
  /**
   * Content of the `DataTableHeader`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to display title in table header.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <DataTable>
 *     <DataTable.Header>
 *       <DataTable.Title
 *         sortDirection='descending'
 *       >
 *         Dessert
 *       </DataTable.Title>
 *       <DataTable.Title numeric>Calories</DataTable.Title>
 *       <DataTable.Title numeric>Fat (g)</DataTable.Title>
 *     </DataTable.Header>
 *   </DataTable>
 * );
 *
 * export default MyComponent;
 * ```
 */

const DataTableHeader = ({
  children,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const borderBottomColor = theme.colors.outlineVariant;

  const rowContext = React.useMemo(
    () => ({ header: true, rowIsFocusUnit: false }),
    []
  );

  return (
    <DataTableRowContext.Provider value={rowContext}>
      <View
        role="row"
        {...webAriaProps({ 'aria-rowindex': 1 })}
        {...rest}
        style={[styles.header, { borderBottomColor }, style]}
      >
        {withColumnIndices(children)}
      </View>
    </DataTableRowContext.Provider>
  );
};

DataTableHeader.displayName = 'DataTable.Header';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_PADDING,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
});

export default DataTableHeader;

// @component-docs ignore-next-line
export { DataTableHeader };
