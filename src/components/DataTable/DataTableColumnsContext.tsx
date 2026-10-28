import * as React from 'react';
import { Platform } from 'react-native';
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
  indexByKey: ReadonlyMap<string, number>;
  layout: DataTableLayout;
};

export const ColumnsContext = React.createContext<ColumnsContextValue | null>(
  null
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
 *
 * The column comes from the `column` prop alone, never from the element's
 * place among its siblings, so a title or cell inside a wrapper component or a
 * fragment resolves just like an inline one.
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

  if (process.env.NODE_ENV !== 'production' && context) {
    if (column == null) {
      console.warn(
        'DataTable.Title and DataTable.Cell need `column` when the DataTable has `columns`, otherwise they get no column definition'
      );
    } else if (typeof column === 'string' && !context.indexByKey.has(column)) {
      console.warn(`DataTable has no column with the key "${column}"`);
    }
  }

  const index =
    typeof column === 'number'
      ? column
      : column == null
        ? undefined
        : context?.indexByKey.get(column);

  const descriptor = index == null ? undefined : context?.columns[index];

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
 * direction; `textAlign` has to be a physical value because React Native has
 * no `textAlign: 'start' | 'end'`. iOS and Android mirror `left` and `right`
 * in RTL layouts on their own, so only the web needs the mapping.
 */
export const useAlignStyles = (
  align: DataTableColumnAlign,
  numeric: boolean
): AlignStyles => {
  const { direction } = useLocale();

  return React.useMemo(() => {
    const isEnd = align === 'end';
    // iOS and Android mirror left and right in RTL layouts. The web does not.
    const mirror = Platform.OS === 'web' && direction === 'rtl';

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
          align === 'center' ? 'center' : isEnd !== mirror ? 'right' : 'left',
        ...(numeric ? { fontVariant: ['tabular-nums' as const] } : null),
      },
    };
  }, [align, numeric, direction]);
};
