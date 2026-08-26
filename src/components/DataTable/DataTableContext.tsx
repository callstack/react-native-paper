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
  /** Called by `DataTable.Header` to publish the column names it derived. */
  setHeaderLabels: (labels: ReadonlyArray<string | undefined> | null) => void;
};

export const DataTableContext =
  React.createContext<DataTableContextValue | null>(null);

export type DataTableRowContextValue = {
  /** This is the header row, so its cells are column headers. */
  header: boolean;
  rowIsFocusUnit: boolean;
};

export const DataTableRowContext =
  React.createContext<DataTableRowContextValue | null>(null);
