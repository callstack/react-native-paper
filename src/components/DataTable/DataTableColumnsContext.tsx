import * as React from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

import type {
  ColumnLayoutProps,
  DataTableColumn,
  DataTableColumnAlign,
  DataTableLayout,
} from './columns';
import { useLocale } from '../../core/locale';

export type ColumnsContextValue = {
  columns: readonly DataTableColumn[];
  byKey: ReadonlyMap<string, DataTableColumn>;
  layout: DataTableLayout;
};

export const ColumnsContext = React.createContext<ColumnsContextValue | null>(
  null
);

/**
 * The position of an element within its `DataTable.Header` or `DataTable.Row`.
 *
 * Published by the row rather than read from the child list, so it survives
 * consumer wrapper components - a `<NameCell />` that renders a
 * `DataTable.Cell` resolves its column just like an inline one.
 */
export const ColumnIndexContext = React.createContext<number | null>(null);

/**
 * Wraps each child in its positional index. Providers render no host node, so
 * this leaves layout and the rendered tree untouched.
 */
export const withColumnIndices = (children: React.ReactNode) =>
  React.Children.map(children, (child, index) =>
    child == null ? (
      child
    ) : (
      <ColumnIndexContext.Provider value={index}>
        {child}
      </ColumnIndexContext.Provider>
    )
  );

export type ResolvedColumn = {
  style: ViewStyle;
  align: DataTableColumnAlign;
  numeric: boolean;
  index?: number;
  descriptor?: DataTableColumn;
};

/**
 * Resolves one cell's column: its shared definition and its layout style.
 */
export const useColumn = ({
  column,
  flex,
  width,
  minWidth,
  maxWidth,
  align,
  numeric,
}: ColumnLayoutProps): ResolvedColumn => {
  const context = React.useContext(ColumnsContext);
  const positional = React.useContext(ColumnIndexContext);

  const index = typeof column === 'number' ? column : (positional ?? undefined);

  const descriptor = React.useMemo(() => {
    if (!context) {
      return undefined;
    }

    if (typeof column === 'string') {
      return context.byKey.get(column);
    }

    return index == null ? undefined : context.columns[index];
  }, [context, column, index]);

  const resolvedNumeric = numeric ?? descriptor?.numeric ?? false;
  const resolvedAlign =
    align ?? descriptor?.align ?? (resolvedNumeric ? 'end' : 'start');

  const resolvedWidth = width ?? descriptor?.width;
  const resolvedFlex = flex ?? descriptor?.flex;
  const resolvedMinWidth = minWidth ?? descriptor?.minWidth;
  const resolvedMaxWidth = maxWidth ?? descriptor?.maxWidth;
  const isFixed = context?.layout === 'fixed';

  const style = React.useMemo<ViewStyle>(() => {
    // A declared width has to hold even when the row overflows its parent,
    // which flexBasis alone does not guarantee.
    if (resolvedWidth != null) {
      return {
        width: resolvedWidth,
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: resolvedWidth,
      };
    }

    if (isFixed) {
      return {
        flexGrow: resolvedFlex ?? 0,
        flexShrink: 0,
        flexBasis: resolvedMinWidth ?? 0,
        minWidth: resolvedMinWidth,
        maxWidth: resolvedMaxWidth,
      };
    }

    return {
      flex: resolvedFlex ?? 1,
      minWidth: resolvedMinWidth,
      maxWidth: resolvedMaxWidth,
    };
  }, [
    resolvedWidth,
    resolvedFlex,
    resolvedMinWidth,
    resolvedMaxWidth,
    isFixed,
  ]);

  return {
    style,
    align: resolvedAlign,
    numeric: resolvedNumeric,
    index,
    descriptor,
  };
};

export type AlignStyles = {
  container: ViewStyle;
  text: TextStyle;
};

/**
 * Container and text alignment for a column.
 *
 * `justifyContent` is logical and flips with the container's writing
 * direction; `textAlign` has to be mapped to a physical value because React
 * Native has no `textAlign: 'start' | 'end'`.
 */
export const useAlignStyles = (
  align: DataTableColumnAlign,
  numeric: boolean
): AlignStyles => {
  const { direction } = useLocale();

  return React.useMemo(() => {
    const isEnd = align === 'end';
    const isRTL = direction === 'rtl';

    return {
      container: {
        justifyContent: isEnd
          ? 'flex-end'
          : align === 'center'
            ? 'center'
            : 'flex-start',
      },
      text: {
        textAlign:
          align === 'center' ? 'center' : isEnd === isRTL ? 'left' : 'right',
        ...(numeric ? { fontVariant: ['tabular-nums' as const] } : null),
      },
    };
  }, [align, numeric, direction]);
};
