export type DataTableColumnAlign = 'start' | 'center' | 'end';

/**
 * A shared definition of one table column.
 *
 * Passing these to `DataTable` makes the header and every row agree on width
 * and alignment from a single place.
 */
export type DataTableColumn = {
  /**
   * Stable identifier. Pass the same value as `column` on the matching
   * `DataTable.Title` and `DataTable.Cell`.
   */
  key: string;
  /**
   * Flex grow factor. Defaults to 1 when neither `flex` nor `width` is set.
   */
  flex?: number;
  /**
   * Fixed width in dp. Takes precedence over `flex`.
   */
  width?: number;
  /**
   * Minimum width of the column. Only reachable when the table is
   * allowed to overflow, i.e. under `layout="fixed"` inside a horizontal
   * `ScrollView`.
   */
  minWidth?: number;
  maxWidth?: number;
  /**
   * Content alignment within the column. Defaults to `end` for numeric
   * columns and `start` otherwise.
   */
  align?: DataTableColumnAlign;
  /**
   * Whether the column holds numbers. Numeric columns use tabular figures, so
   * digits line up between rows, and align to `end` unless `align` says
   * otherwise.
   */
  numeric?: boolean;
};

/**
 * How a table distributes its columns.
 *
 * - `fluid` (default) - columns share the table's width through flex.
 * - `fixed` - columns keep their declared width and the row may exceed the
 *   viewport. Wrap the table in a horizontal `ScrollView`.
 */
export type DataTableLayout = 'fluid' | 'fixed';

/**
 * Layout props shared by `DataTable.Title` and `DataTable.Cell`. Any of them
 * overrides the matching field of the shared column definition.
 */
export type ColumnLayoutProps = {
  /**
   * Which column this belongs to - a `DataTableColumn` key, or a 0-based index.
   */
  column?: string | number;
  flex?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: DataTableColumnAlign;
  numeric?: boolean;
};
