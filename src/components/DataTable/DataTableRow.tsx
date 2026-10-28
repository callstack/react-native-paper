import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  DataTableContext,
  DataTableRowContext,
  RowIndexContext,
} from './DataTableContext';
import type { RegisteredCell } from './DataTableContext';
import {
  HORIZONTAL_PADDING,
  ROW_MIN_HEIGHT,
  ROW_VERTICAL_PADDING,
} from './tokens';
import { composeRowLabel } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import webAriaProps from '../../utils/webAriaProps';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

export type Props = Omit<
  React.PropsWithoutRef<TouchableRippleProps>,
  'children'
> & {
  /**
   * Content of the `DataTableRow`. Put all content in `DataTable.Cell`s: on
   * iOS and Android a row of plain-text cells is announced as one item, and
   * content outside a cell would be hidden with the cells.
   */
  children: React.ReactNode;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Index of this row within the data set, counting from 0. Announced to
   * screen readers as the row's position.
   *
   * Rows rendered among the `DataTable`'s own children are numbered by their
   * position there; pass this for rows rendered outside it, as a virtualized
   * list does.
   */
  index?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * `pointerEvents` passed to the `View` container, which is wrapping children within `TouchableRipple`.
   */
  pointerEvents?: ViewProps['pointerEvents'];
};

/**
 * A component to show a single row inside of a table.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *  <DataTable.Row>
 *    <DataTable.Cell numeric>1</DataTable.Cell>
 *    <DataTable.Cell numeric>2</DataTable.Cell>
 *    <DataTable.Cell numeric>3</DataTable.Cell>
 *    <DataTable.Cell numeric>4</DataTable.Cell>
 *  </DataTable.Row>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const DataTableRow = ({
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  style,
  children,
  pointerEvents,
  index,
  accessible,
  'aria-label': ariaLabel,
  theme: themeOverrides,
  // Must not reach the plain view a static row renders as.
  rippleColor,
  underlayColor,
  background,
  borderless,
  centered,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const table = React.useContext(DataTableContext);
  const position = React.useContext(RowIndexContext);
  const borderBottomColor = theme.colors.outlineVariant;

  // A virtualized list renders rows outside the table's own child list, so
  // those pass their index themselves.
  const rowIndex = index ?? position ?? undefined;

  if (
    process.env.NODE_ENV !== 'production' &&
    table != null &&
    rowIndex == null
  ) {
    console.warn(
      'DataTable.Row has no position: a row inside a wrapper, or in a list, needs `index`'
    );
  }

  const interactive = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  // Table roles convey nothing on iOS or Android, so the label has to.
  const collectsCells =
    Platform.OS !== 'web' &&
    table?.nativeFocusMode !== 'cell' &&
    accessible !== false;

  const [cells, setCells] = React.useState<ReadonlyMap<string, RegisteredCell>>(
    () => new Map()
  );

  const registerCell = React.useCallback((id: string, cell: RegisteredCell) => {
    setCells((previous) => new Map(previous).set(id, cell));

    return () =>
      setCells((previous) => {
        const next = new Map(previous);
        next.delete(id);
        return next;
      });
  }, []);

  // Collapsing a row is only safe when every cell is plain text and none is
  // separately interactive, or its content would be out of reach.
  const { cellLabels, describable } = React.useMemo(() => {
    const indexed: Array<string | undefined> = [];
    const unindexed: Array<string | undefined> = [];
    let describable = cells.size > 0;

    cells.forEach((cell) => {
      if (!cell.describable) {
        describable = false;
      }

      if (cell.index == null) {
        unindexed.push(cell.label);
      } else {
        indexed[cell.index] = cell.label;
      }
    });

    return { cellLabels: [...indexed, ...unindexed], describable };
  }, [cells]);

  const rowIsFocusUnit = collectsCells && describable;

  const label =
    ariaLabel ??
    (rowIsFocusUnit
      ? composeRowLabel({
          cellLabels,
          rowIndex,
          rowCount: table?.rowCount,
          formatRowPosition: table?.formatRowPosition,
        })
      : undefined);

  const rowContext = React.useMemo(
    () => ({
      header: false,
      rowIsFocusUnit,
      registerCell: collectsCells ? registerCell : undefined,
    }),
    [rowIsFocusUnit, collectsCells, registerCell]
  );

  const structuralProps = {
    // Native maps `button` to a real trait; `row` maps to nothing there.
    role:
      Platform.OS === 'web' || !interactive
        ? ('row' as const)
        : ('button' as const),
    ...webAriaProps({
      'aria-rowindex':
        rowIndex == null
          ? undefined
          : rowIndex + 1 + (table?.hasHeader ? 1 : 0),
    }),
    // Left unset, `Pressable` defaults it to `true`, which would swallow
    // whatever an interactive row holds.
    accessible: accessible ?? rowIsFocusUnit,
    'aria-label': label,
  };

  const content = (
    <View
      style={styles.content}
      pointerEvents={pointerEvents}
      // The row already announces every cell.
      {...(rowIsFocusUnit
        ? {
            accessibilityElementsHidden: true,
            importantForAccessibility: 'no-hide-descendants' as const,
          }
        : null)}
    >
      {children}
    </View>
  );

  return (
    <DataTableRowContext.Provider value={rowContext}>
      {interactive ? (
        <TouchableRipple
          {...structuralProps}
          {...rest}
          onPress={onPress}
          onLongPress={onLongPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          disabled={disabled}
          rippleColor={rippleColor}
          underlayColor={underlayColor}
          background={background}
          borderless={borderless}
          centered={centered}
          style={[styles.container, { borderBottomColor }, style]}
        >
          {content}
        </TouchableRipple>
      ) : (
        <View
          {...structuralProps}
          {...rest}
          style={[
            styles.container,
            styles.static,
            { borderBottomColor },
            style,
          ]}
        >
          {content}
        </View>
      )}
    </DataTableRowContext.Provider>
  );
};

DataTableRow.displayName = 'DataTable.Row';

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: ROW_MIN_HEIGHT,
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: ROW_VERTICAL_PADDING,
  },
  static: {
    position: 'relative',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
});

export default DataTableRow;

// @component-docs ignore-next-line
export { DataTableRow };
