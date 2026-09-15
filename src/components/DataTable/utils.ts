import * as React from 'react';
import { ScrollView, Text as NativeText, View } from 'react-native';

import Text from '../Typography/Text';

/** Whether a child is a particular `DataTable` sub-component. */
export const isDataTableElement = <P>(
  child: React.ReactNode,
  displayName: string
): child is React.ReactElement<P> => {
  if (!React.isValidElement(child)) {
    return false;
  }

  const { type } = child;

  return (
    (typeof type === 'function' ||
      (typeof type === 'object' && type !== null)) &&
    'displayName' in type &&
    type.displayName === displayName
  );
};

/**
 * Whether the table can see through an element to the children it was given:
 * the primitives it is built from render what they are handed, so a row inside
 * one keeps its own place in the table.
 */
export const isTransparentContainer = (child: React.ReactElement): boolean =>
  child.type === React.Fragment ||
  child.type === View ||
  child.type === ScrollView ||
  child.type === NativeText ||
  child.type === Text;

const structuralParts = [
  'DataTable.Header',
  'DataTable.Row',
  'DataTable.Pagination',
];

/**
 * Whether a subtree holds a part of the table's structure - a header, a row or
 * the pagination - at any depth.
 */
export const containsTableStructure = (node: React.ReactNode): boolean =>
  React.Children.toArray(node).some(
    (child) =>
      structuralParts.some((part) => isDataTableElement(child, part)) ||
      (React.isValidElement<{ children?: React.ReactNode }>(child) &&
        containsTableStructure(child.props.children))
  );

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
 * A label the consumer set, which is the element's complete accessible name -
 * never a value for a column name to be prefixed onto.
 */
export const getExplicitLabel = (props: LabelledProps): string | undefined =>
  props['aria-label'] ?? props.accessibilityLabel;

/**
 * The accessible name of a title or cell: an explicit label if given, and
 * otherwise its text content.
 */
export const getElementLabel = (props: LabelledProps): string | undefined =>
  getExplicitLabel(props) ?? getNodeText(props.children);

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

/**
 * The column names of a header row, indexed by column position.
 */
export const readColumnLabels = (
  children: React.ReactNode
): Array<string | undefined> => {
  const labels: Array<string | undefined> = [];

  React.Children.forEach(children, (child, position) => {
    labels[position] = isDataTableElement<LabelledProps>(
      child,
      'DataTable.Title'
    )
      ? getElementLabel(child.props)
      : undefined;
  });

  return labels;
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
