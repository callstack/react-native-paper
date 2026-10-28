import * as React from 'react';

import type { FormatRowPosition } from './utils';

/**
 * Where a screen reader stops when moving through a table on iOS or Android.
 *
 * Neither platform has any notion of table semantics - the ARIA roles map to
 * no accessibility trait at all - so the structure has to be conveyed through
 * composed labels instead.
 *
 * - `row` (default) - one stop per row, naming every column and the row's
 *   position. Falls back to `cell` for rows that hold interactive or non-text
 *   content.
 * - `cell` - one stop per cell, each naming its column.
 */
export type NativeFocusMode = 'row' | 'cell';

export type DataTableContextValue = {
  /** Total rows in the data set, not just the rendered page. */
  rowCount?: number;
  /** Names of the columns, indexed by column position. */
  columnLabels: ReadonlyArray<string | undefined>;
  /** Data rows are offset by one on the web when a header row is present. */
  hasHeader: boolean;
  nativeFocusMode: NativeFocusMode;
  formatRowPosition: FormatRowPosition | null;
};

export const DataTableContext =
  React.createContext<DataTableContextValue | null>(null);

/**
 * What a cell tells its row, so the row can announce every cell at once
 * without reading its own children.
 */
export type RegisteredCell = {
  /** Column position of the cell, when it is known. */
  index?: number;
  /** The cell's name as part of the row, column name included. */
  label?: string;
  /** Plain text and not interactive, so it is safe to hide behind the row. */
  describable: boolean;
};

export type DataTableRowContextValue = {
  /** This is the header row, so its cells are column headers. */
  header: boolean;
  rowIsFocusUnit: boolean;
  /**
   * Set while the row can become one accessibility element. Returns the
   * function that unregisters the cell.
   */
  registerCell?: (id: string, cell: RegisteredCell) => () => void;
};

export const DataTableRowContext =
  React.createContext<DataTableRowContextValue | null>(null);

/**
 * The position of a row within the data set.
 *
 * Published by the table rather than cloned onto the child list, so it
 * survives consumer wrapper components - a `<NameRow />` that renders a
 * `DataTable.Row` is numbered just like an inline one.
 */
export const RowIndexContext = React.createContext<number | null>(null);
