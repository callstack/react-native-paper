import * as React from 'react';

/** Whether a child is a particular `DataTable` sub-component. */
export const isDataTableElement = <P>(
  child: React.ReactNode,
  displayName: string
): child is React.ReactElement<P> =>
  React.isValidElement(child) &&
  typeof child.type !== 'string' &&
  'displayName' in child.type &&
  child.type.displayName === displayName;

/** The text of a node, when it has one. */
export const getNodeText = (node: React.ReactNode): string | undefined => {
  if (typeof node === 'string') {
    return node;
  }

  if (typeof node === 'number') {
    return String(node);
  }

  return undefined;
};

type LabelledProps = {
  'aria-label'?: string;
  accessibilityLabel?: string;
  children?: React.ReactNode;
};

/**
 * The accessible name of a title or cell: an explicit label if given, and
 * otherwise its text content.
 */
export const getElementLabel = (props: LabelledProps): string | undefined =>
  props['aria-label'] ??
  props.accessibilityLabel ??
  getNodeText(props.children);

/**
 * Names a cell by the column it belongs to.
 */
export const composeCellLabel = ({
  columnLabel,
  value,
}: {
  columnLabel?: string;
  value?: string;
}): string | undefined => {
  if (value == null) {
    return columnLabel;
  }

  return columnLabel ? `${columnLabel}, ${value}` : value;
};

export type RowPositionInfo = { position: number; rowCount?: number };
export type FormatRowPosition = (info: RowPositionInfo) => string;

/** Default wording for a row's position within the table. */
export const defaultFormatRowPosition: FormatRowPosition = ({
  position,
  rowCount,
}) => (rowCount != null ? `row ${position} of ${rowCount}` : `row ${position}`);

/** Flattens a row into a single announcement. */
export const composeRowLabel = ({
  cellLabels,
  rowIndex,
  rowCount,
  formatRowPosition,
}: {
  cellLabels: ReadonlyArray<string | undefined>;
  rowIndex?: number;
  rowCount?: number;
  formatRowPosition?: FormatRowPosition | null;
}): string | undefined => {
  const parts = cellLabels.filter((label): label is string => label != null);

  const position =
    formatRowPosition && rowIndex != null
      ? formatRowPosition({ position: rowIndex + 1, rowCount })
      : undefined;

  if (position) {
    parts.push(position);
  }

  return parts.length > 0 ? parts.join(', ') : undefined;
};

export type SortAccessibilityLabels = {
  ascending: string;
  descending: string;
};

export const defaultSortAccessibilityLabels: SortAccessibilityLabels = {
  ascending: 'sorted ascending',
  descending: 'sorted descending',
};
