import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import type { DataTableColumn, DataTableLayout } from './columns';
import DataTableCell from './DataTableCell';
import { ColumnsContext } from './DataTableColumnsContext';
import { DataTableContext, RowIndexContext } from './DataTableContext';
import type { NativeFocusMode } from './DataTableContext';
import DataTableHeader, {
  DataTableHeader as _DataTableHeader,
} from './DataTableHeader';
import type { Props as DataTableHeaderProps } from './DataTableHeader';
import DataTablePagination, {
  DataTablePagination as _DataTablePagination,
} from './DataTablePagination';
import DataTableRow, { DataTableRow as _DataTableRow } from './DataTableRow';
import DataTableTitle, {
  DataTableTitle as _DataTableTitle,
} from './DataTableTitle';
import {
  defaultFormatRowPosition,
  isDataTableElement,
  readColumnLabels,
} from './utils';
import type { FormatRowPosition } from './utils';
import webAriaProps from '../../utils/webAriaProps';

export type Props = ViewProps & {
  /**
   * Content of the `DataTable`.
   */
  children: React.ReactNode;
  /**
   * Shared column definitions. The header and every row read width and
   * alignment from here.
   */
  columns?: readonly DataTableColumn[];
  /**
   * How columns are distributed.
   * - `fluid` (default) shares the table's width through flex;
   * - `fixed` keeps declared widths and lets the row overflow, for use inside
   * a horizontal `ScrollView`.
   */
  layout?: DataTableLayout;
  /**
   * Total number of rows in the data set, which can be larger than the number
   * rendered when the table is paginated or virtualized. Announced to screen
   * readers as the row count.
   */
  rowCount?: number;
  /**
   * Index of the first *rendered* row within the data set. Set this alongside
   * `rowCount` when showing a page of a larger set, so row positions are
   * announced against the whole set rather than the page.
   */
  firstRowIndex?: number;
  /**
   * Where a screen reader stops when moving through the table on iOS and
   * Android, respectively. Defaults to `row`, which announces a whole row at
   * once.
   */
  nativeFocusMode?: NativeFocusMode;
  /**
   * Wording of a row's position within the table, used when a row is announced
   * as a whole. Pass `null` to leave the position out.
   */
  formatRowPosition?: FormatRowPosition | null;
  style?: StyleProp<ViewStyle>;
};

/**
 * Data tables allow displaying sets of data.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const columns = [
 *   { key: 'name', flex: 2 },
 *   { key: 'calories', numeric: true },
 *   { key: 'fat', numeric: true },
 * ];
 *
 * const MyComponent = () => {
 *   const [page, setPage] = React.useState<number>(0);
 *   const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
 *   const [itemsPerPage, onItemsPerPageChange] = React.useState(
 *     numberOfItemsPerPageList[0]
 *   );
 *
 *   const [items] = React.useState([
 *    {
 *      key: 1,
 *      name: 'Cupcake',
 *      calories: 356,
 *      fat: 16,
 *    },
 *    {
 *      key: 2,
 *      name: 'Eclair',
 *      calories: 262,
 *      fat: 16,
 *    },
 *    {
 *      key: 3,
 *      name: 'Frozen yogurt',
 *      calories: 159,
 *      fat: 6,
 *    },
 *    {
 *      key: 4,
 *      name: 'Gingerbread',
 *      calories: 305,
 *      fat: 3.7,
 *    },
 *   ]);
 *
 *   const from = page * itemsPerPage;
 *   const to = Math.min((page + 1) * itemsPerPage, items.length);
 *
 *   React.useEffect(() => {
 *     setPage(0);
 *   }, [itemsPerPage]);
 *
 *   return (
 *     <DataTable
 *       aria-label="Nutrition"
 *       columns={columns}
 *       rowCount={items.length}
 *       firstRowIndex={from}
 *     >
 *       <DataTable.Header>
 *         <DataTable.Title>Dessert</DataTable.Title>
 *         <DataTable.Title>Calories</DataTable.Title>
 *         <DataTable.Title>Fat</DataTable.Title>
 *       </DataTable.Header>
 *
 *       {items.slice(from, to).map((item) => (
 *         <DataTable.Row key={item.key}>
 *           <DataTable.Cell>{item.name}</DataTable.Cell>
 *           <DataTable.Cell>{item.calories}</DataTable.Cell>
 *           <DataTable.Cell>{item.fat}</DataTable.Cell>
 *         </DataTable.Row>
 *       ))}
 *
 *       <DataTable.Pagination
 *         page={page}
 *         numberOfPages={Math.ceil(items.length / itemsPerPage)}
 *         onPageChange={(page) => setPage(page)}
 *         label={`${from + 1}-${to} of ${items.length}`}
 *         numberOfItemsPerPageList={numberOfItemsPerPageList}
 *         numberOfItemsPerPage={itemsPerPage}
 *         onItemsPerPageChange={onItemsPerPageChange}
 *         showFastPaginationControls
 *         selectPageDropdownLabel={'Rows per page'}
 *       />
 *     </DataTable>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DataTable = ({
  children,
  columns,
  layout = 'fluid',
  rowCount,
  firstRowIndex = 0,
  nativeFocusMode = 'row',
  formatRowPosition = defaultFormatRowPosition,
  style,
  ...rest
}: Props) => {
  if (
    __DEV__ &&
    layout === 'fixed' &&
    columns?.some((column) => column.width == null && column.minWidth == null)
  ) {
    console.warn(
      'DataTable with layout="fixed" needs a `width` or `minWidth` on every column, otherwise columns collapse to their content'
    );
  }

  // Everything the rows need to know about the table has to be resolved while
  // rendering: an effect would leave the first render - the only one a server
  // renders - with the wrong row indices and no column names.
  const { rows, columnLabels, hasHeader, renderedRowCount } =
    React.useMemo(() => {
      let columnLabels: Array<string | undefined> = [];
      let hasHeader = false;
      let rendered = 0;

      const rows = React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        if (
          isDataTableElement<DataTableHeaderProps>(child, 'DataTable.Header')
        ) {
          hasHeader = true;
          columnLabels = readColumnLabels(child.props.children);
          return child;
        }

        if (isDataTableElement(child, 'DataTable.Pagination')) {
          return child;
        }

        // Anything else is taken for a row. Virtualized rows have no children
        // here to number, so those pass `index` themselves.
        return (
          <RowIndexContext.Provider value={firstRowIndex + rendered++}>
            {child}
          </RowIndexContext.Provider>
        );
      });

      return { rows, columnLabels, hasHeader, renderedRowCount: rendered };
    }, [children, firstRowIndex]);

  const resolvedRowCount =
    rowCount ??
    (renderedRowCount > 0 ? firstRowIndex + renderedRowCount : undefined);

  const columnCount =
    columns?.length ?? (hasHeader ? columnLabels.length : undefined);

  const tableContext = React.useMemo(
    () => ({
      rowCount: resolvedRowCount,
      columnLabels,
      hasHeader,
      nativeFocusMode,
      formatRowPosition,
    }),
    [
      resolvedRowCount,
      columnLabels,
      hasHeader,
      nativeFocusMode,
      formatRowPosition,
    ]
  );

  const columnsContext = React.useMemo(
    () =>
      columns
        ? {
            columns,
            byKey: new Map(columns.map((column) => [column.key, column])),
            layout,
          }
        : null,
    [columns, layout]
  );

  const { 'aria-label': ariaLabel, accessibilityLabel, ...viewProps } = rest;

  const nameProps =
    Platform.OS === 'web'
      ? { 'aria-label': ariaLabel, accessibilityLabel }
      : null;

  const content = (
    <View
      role="table"
      {...nameProps}
      {...webAriaProps({
        'aria-rowcount':
          resolvedRowCount == null
            ? undefined
            : resolvedRowCount + (hasHeader ? 1 : 0),
        'aria-colcount': columnCount,
      })}
      {...viewProps}
      style={[layout === 'fluid' && styles.fluid, style]}
    >
      {rows}
    </View>
  );

  return (
    <DataTableContext.Provider value={tableContext}>
      {columnsContext ? (
        <ColumnsContext.Provider value={columnsContext}>
          {content}
        </ColumnsContext.Provider>
      ) : (
        content
      )}
    </DataTableContext.Provider>
  );
};

// @component ./DataTableHeader.tsx
DataTable.Header = DataTableHeader;

// @component ./DataTableTitle.tsx
DataTable.Title = DataTableTitle;

// @component ./DataTableRow.tsx
DataTable.Row = DataTableRow;

// @component ./DataTableCell.tsx
DataTable.Cell = DataTableCell;

// @component ./DataTablePagination.tsx
DataTable.Pagination = DataTablePagination;

const styles = StyleSheet.create({
  fluid: {
    width: '100%',
  },
});

export default DataTable;
