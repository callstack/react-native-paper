import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';

import type { $RemoveChildren } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Content of the `DataTableCell`.
   */
  children: React.ReactNode;
  /**
   * Align the text to the right. Generally monetary or number fields are aligned to right.
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
 *      <DataTable.Row>
 *        <DataTable.Cell numeric>1</DataTable.Cell>
 *        <DataTable.Cell numeric>2</DataTable.Cell>
 *        <DataTable.Cell numeric>3</DataTable.Cell>
 *        <DataTable.Cell numeric>4</DataTable.Cell>
 *      </DataTable.Row>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * If you want to support multiline text, please use View instead, as multiline text doesn't comply with
 * MD Guidelines (https://github.com/callstack/react-native-paper/issues/2381).
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */
const DataTableCell = ({
  children,
  textStyle,
  style,
  numeric,
  maxFontSizeMultiplier,
  testID,
  ...rest
}: Props) => {
  return (
    <TouchableRipple
      {...rest}
      testID={testID}
      style={[styles.container, numeric && styles.right, style]}
    >
      <CellContent
        textStyle={textStyle}
        testID={testID}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {children}
      </CellContent>
    </TouchableRipple>
  );
};

const CellContent = ({
  children,
  textStyle,
  maxFontSizeMultiplier,
  testID,
}: Pick<
  Props,
  'children' | 'textStyle' | 'testID' | 'maxFontSizeMultiplier'
>) => {
  if (React.isValidElement(children)) {
    return children;
  }

  return (
    <Text
      style={textStyle}
      numberOfLines={1}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      testID={`${testID}-text-container`}
    >
      {children}
    </Text>
  );
};

DataTableCell.displayName = 'DataTable.Cell';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  right: {
    justifyContent: 'flex-end',
  },
});

export default DataTableCell;
