/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import DataTableCell from './DataTableCell';
import DataTableHeader from './DataTableHeader';
import DataTableTitle from './DataTableTitle';
import DataTablePagination from './DataTablePagination';
import DataTableRow from './DataTableRow';

type Props = React.ElementConfig<typeof View> & {
  /**
   * Content of the `DataTable`.
   */
  children: React.Node,
  style?: any,
};

/**
 * Data tables allow displaying sets of data.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/data-table.png" />
 *     <figcaption>Data table</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <DataTable>
 *         <DataTable.Header>
 *           <DataTable.Title>Dessert</DataTable.Title>
 *           <DataTable.Title numeric>Calories</DataTable.Title>
 *           <DataTable.Title numeric>Fat</DataTable.Title>
 *         </DataTable.Header>
 *
 *         <DataTable.Row>
 *           <DataTable.Cell>Frozen yogurt</DataTable.Cell>
 *           <DataTable.Cell numeric>159</DataTable.Cell>
 *           <DataTable.Cell numeric>6.0</DataTable.Cell>
 *         </DataTable.Row>
 *
 *         <DataTable.Row>
 *           <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
 *           <DataTable.Cell numeric>237</DataTable.Cell>
 *           <DataTable.Cell numeric>8.0</DataTable.Cell>
 *         </DataTable.Row>
 *
 *         <DataTable.Pagination
 *           page={1}
 *           numberOfPages={3}
 *           onPageChange={(page) => { console.log(page); }}
 *           label="1-2 of 6"
 *         />
 *       </DataTable>
 *     );
 *   }
 * }
 * ```
 */
class DataTable extends React.Component<Props> {
  // @component ./DataTableHeader.js
  static Header = DataTableHeader;

  // @component ./DataTableTitle.js
  static Title = DataTableTitle;

  // @component ./DataTableRow.js
  static Row = DataTableRow;

  // @component ./DataTableCell.js
  static Cell = DataTableCell;

  // @component ./DataTablePagination.js
  static Pagination = DataTablePagination;

  render() {
    const { children, style, ...rest } = this.props;

    return (
      <View {...rest} style={[styles.container, style]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default DataTable;
