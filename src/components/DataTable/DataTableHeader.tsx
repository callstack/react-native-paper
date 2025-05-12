import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';

export type Props = React.ComponentPropsWithRef<typeof View> & {
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
 *       <DataTable>
 *         <DataTable.Header>
 *           <DataTable.Title
 *             sortDirection='descending'
 *           >
 *             Dessert
 *           </DataTable.Title>
 *           <DataTable.Title numeric>Calories</DataTable.Title>
 *           <DataTable.Title numeric>Fat (g)</DataTable.Title>
 *         </DataTable.Header>
 *       </DataTable>
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
  const { colors } = useInternalTheme(themeOverrides);

  return (
    <View
      {...rest}
      style={[
        styles.header,
        { borderBottomColor: colors.surfaceVariant },
        style,
      ]}
    >
      {children}
    </View>
  );
};

DataTableHeader.displayName = 'DataTable.Header';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
});

export default DataTableHeader;

// @component-docs ignore-next-line
export { DataTableHeader };
