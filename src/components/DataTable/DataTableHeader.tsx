import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import color from 'color';

import { withInternalTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import type { InternalTheme } from '../../types';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Content of the `DataTableHeader`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

/**
 * A component to display title in table header.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/data-table-header.png" />
 *   </figure>
 * </div>
 *
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

const DataTableHeader = ({ children, style, theme, ...rest }: Props) => {
  const borderBottomColor = theme.isV3
    ? theme.colors.surfaceVariant
    : color(theme.dark ? white : black)
        .alpha(0.12)
        .rgb()
        .string();

  return (
    <View {...rest} style={[styles.header, { borderBottomColor }, style]}>
      {children}
    </View>
  );
};

DataTableHeader.displayName = 'DataTable.Header';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
});

export default withInternalTheme(DataTableHeader);

// @component-docs ignore-next-line
export { DataTableHeader };
