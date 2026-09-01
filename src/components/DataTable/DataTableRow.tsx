import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import type { Props as DataTableCellProps } from './DataTableCell';
import { withColumnIndices } from './DataTableColumnsContext';
import {
  DataTableContext,
  DataTableRowContext,
  RowIndexContext,
} from './DataTableContext';
import {
  HORIZONTAL_PADDING,
  ROW_MIN_HEIGHT,
  ROW_VERTICAL_PADDING,
} from './tokens';
import {
  composeCellLabel,
  composeRowLabel,
  getExplicitLabel,
  getNodeText,
  isDataTableElement,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { $RemoveChildren, ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import webAriaProps from '../../utils/webAriaProps';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Content of the `DataTableRow`.
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

  const interactive = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const columnLabels = table?.columnLabels;

  // Collapsing a row is only safe when every cell is plain text and none is
  // separately interactive, or its content would be out of reach.
  const { cellLabels, describable } = React.useMemo(() => {
    const cellLabels: Array<string | undefined> = [];
    let describable = true;

    React.Children.forEach(children, (child, position) => {
      if (child == null || typeof child === 'boolean') {
        return;
      }

      if (!isDataTableElement<DataTableCellProps>(child, 'DataTable.Cell')) {
        describable = false;
        return;
      }

      const { column } = child.props;
      const columnIndex = typeof column === 'number' ? column : position;

      if (
        hasTouchHandler({
          onPress: child.props.onPress,
          onLongPress: child.props.onLongPress,
          onPressIn: child.props.onPressIn,
          onPressOut: child.props.onPressOut,
        })
      ) {
        describable = false;
      }

      // An element renders verbatim and carries its own semantics, which may
      // include being interactive. A label on the cell says nothing about that,
      // so it cannot make the content safe to hide.
      if (React.isValidElement(child.props.children)) {
        describable = false;
      }

      const explicit = getExplicitLabel(child.props);
      const text = getNodeText(child.props.children);

      if (explicit == null && text == null) {
        describable = false;
      }

      cellLabels[columnIndex] =
        explicit ??
        composeCellLabel({
          columnLabel: columnLabels?.[columnIndex],
          value: text,
        });
    });

    return { cellLabels, describable };
  }, [children, columnLabels]);

  const rowIsFocusUnit =
    // Table roles convey nothing on iOS or Android, so the label has to.
    Platform.OS !== 'web' &&
    table?.nativeFocusMode !== 'cell' &&
    accessible !== false &&
    describable;

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
    () => ({ header: false, rowIsFocusUnit }),
    [rowIsFocusUnit]
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
      {withColumnIndices(children)}
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
