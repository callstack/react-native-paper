import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

import type { ColumnLayoutProps } from './columns';
import { useAlignStyles, useColumn } from './DataTableColumnsContext';
import { DataTableContext, DataTableRowContext } from './DataTableContext';
import useReflowedNumberOfLines from './useReflowedNumberOfLines';
import { composeCellLabel, getElementLabel } from './utils';
import type { $RemoveChildren } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import webAriaProps from '../../utils/webAriaProps';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = $RemoveChildren<typeof TouchableRipple> &
  ColumnLayoutProps & {
    /**
     * Content of the `DataTableCell`.
     */
    children: React.ReactNode;
    /**
     * Whether the column holds numbers. Numeric content uses tabular figures,
     * so digits line up between rows, and aligns to the end of the column
     * unless `align` says otherwise.
     */
    numeric?: boolean;
    /**
     * Function to execute on press.
     */
    onPress?: (e: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    /**
     * Text content style of the `DataTableCell`.
     */
    textStyle?: StyleProp<TextStyle>;
    /**
     * The number of lines to show, honoured exactly at every font scale.
     * Pass `0` to never clamp.
     *
     * Only the default is scale-aware: with nothing passed, text is clamped to
     * a single line at the default font scale and left unclamped once the user
     * has enlarged text, where truncating would drop content.
     */
    numberOfLines?: number;
    /**
     * Specifies the largest possible scale a text font can reach.
     */
    maxFontSizeMultiplier?: number;
    /**
     * testID to be used on tests.
     */
    testID?: string;
  };

/**
 * A component to show a single cell inside of a table.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <DataTable.Row>
 *     <DataTable.Cell numeric>1</DataTable.Cell>
 *     <DataTable.Cell numeric>2</DataTable.Cell>
 *     <DataTable.Cell numeric>3</DataTable.Cell>
 *     <DataTable.Cell numeric>4</DataTable.Cell>
 *   </DataTable.Row>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * Cell text is clamped to a single line by default, in line with MD guidance
 * (https://github.com/callstack/react-native-paper/issues/2381). Pass
 * `numberOfLines` to allow more..
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const DataTableCell = ({
  children,
  textStyle,
  style,
  numeric,
  column,
  flex,
  width,
  minWidth,
  maxWidth,
  align,
  numberOfLines,
  maxFontSizeMultiplier,
  testID,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  accessible,
  'aria-label': ariaLabel,
  // Must not reach the plain view a static cell renders as.
  rippleColor,
  underlayColor,
  background,
  borderless,
  centered,
  ...rest
}: Props) => {
  const table = React.useContext(DataTableContext);
  const row = React.useContext(DataTableRowContext);

  const resolved = useColumn({
    column,
    flex,
    width,
    minWidth,
    maxWidth,
    align,
    numeric,
  });
  const alignStyles = useAlignStyles(resolved.align, resolved.numeric);
  const lines = useReflowedNumberOfLines(numberOfLines);

  const interactive = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const columnLabel =
    resolved.index == null ? undefined : table?.columnLabels?.[resolved.index];

  const value = getElementLabel({ 'aria-label': ariaLabel, children });

  const isWeb = Platform.OS === 'web';

  const cellIsFocusUnit =
    !isWeb &&
    !row?.rowIsFocusUnit &&
    !row?.header &&
    !interactive &&
    // An element child renders verbatim; naming the cell would hide its own
    // role and state behind this label.
    !React.isValidElement(children) &&
    value != null;

  // The cell speaks for itself only when it is an accessibility element of its
  // own: a focus unit, or a control the user can activate.
  const namesItself = !isWeb && (cellIsFocusUnit || interactive);

  const label =
    ariaLabel ??
    (namesItself ? composeCellLabel({ columnLabel, value }) : undefined);

  const structuralProps = {
    role: row?.header ? ('columnheader' as const) : ('cell' as const),
    ...webAriaProps({
      'aria-colindex': resolved.index == null ? undefined : resolved.index + 1,
    }),
    accessible: accessible ?? (cellIsFocusUnit || undefined),
    'aria-label': label,
  };

  const containerStyle = [
    styles.container,
    resolved.style,
    alignStyles.container,
    style,
  ];

  const content = (
    <CellContent
      textStyle={[alignStyles.text, textStyle]}
      testID={testID}
      numberOfLines={lines}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
    >
      {children}
    </CellContent>
  );

  if (!interactive) {
    return (
      <View
        {...structuralProps}
        {...rest}
        testID={testID}
        style={containerStyle}
      >
        {content}
      </View>
    );
  }

  return (
    <TouchableRipple
      {...structuralProps}
      {...rest}
      testID={testID}
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
      style={containerStyle}
    >
      {content}
    </TouchableRipple>
  );
};

const CellContent = ({
  children,
  textStyle,
  numberOfLines,
  maxFontSizeMultiplier,
  testID,
}: Pick<Props, 'children' | 'testID' | 'maxFontSizeMultiplier'> & {
  textStyle?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) => {
  if (React.isValidElement(children)) {
    return children;
  }

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      testID={testID == null ? undefined : `${testID}-text-container`}
    >
      {children}
    </Text>
  );
};

DataTableCell.displayName = 'DataTable.Cell';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DataTableCell;
