import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  View,
} from 'react-native';

import type { $RemoveChildren } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';
import Searchbar from '../Searchbar';
import Icon from '../Icon';

export type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Content of the `DataTableSearchCell`.
   */
  children: React.ReactNode;
  /**
   * Align the text to the right. Generally monetary or number fields are aligned to right.
   */
    /**
    * The value of the text input.
    */
    value: string;
  numeric?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  /**
   * Text content style of the `DataTableSearchCell`.
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

   /**
   * Hint text shown when the input is empty.
   */
   placeholder?: string;
 
   /**
    * Callback that is called when the text input's text changes.
    */
   onChangeText?: (query: string) => void;
   
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
const DataTableSearchCell = ({
  children,
  textStyle,
  style,
  numeric,
  maxFontSizeMultiplier,
  testID,
  placeholder = "Search",
  value,
  onChangeText,
  ...rest
}: Props) => {
  return (
    <TouchableRipple
      {...rest}
      testID={testID}
      style={[styles.container, numeric && styles.right, style]}
    >
      {/* <CellContent
        textStyle={textStyle}
        testID={testID}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      > */}
      <View style={{width: '100%', overflow : 'hidden', padding : 5, flexDirection : 'row'}}>
        <Searchbar  
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value} 
        style={{flex : 3}}
      />
     
      </View>
      {/* </CellContent> */}
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
      style={[textStyle, {padding : 10}]}
      numberOfLines={1}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      testID={`${testID}-text-container`}
    >
      {children}
    </Text>
  );
};

DataTableSearchCell.displayName = 'DataTable.Cell';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  //  borderRightWidth : 0.5
  },

  right: {
    justifyContent: 'flex-end',
  },
});

export default DataTableSearchCell;
