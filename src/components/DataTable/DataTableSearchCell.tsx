import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
  View,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

import type { $RemoveChildren } from '../../types';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';
import Searchbar from '../Searchbar';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import { log } from 'console';
import Popover, { usePopover } from '../ModalPopover';

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

  /**
   * Data that is displayed in the pop up to filter on search.
   */
  searchFilterData?:any;

  /**
   * On clicking of a value in the popover, it is stored in the the below use state
   */
  setFilteredOption?: any;
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
  placeholder = 'Search',
  value,
  onChangeText,
  searchFilterData,
  setFilteredOption,
  ...rest
}: Props) => {
  const {
    openPopover,
    closePopover,
    popoverVisible,
    touchableRef,
    popoverAnchorRect,
  } = usePopover();

  const iconFilter = (
    <TouchableOpacity onPress={openPopover} ref={touchableRef}>
      <View style={[styles.icon, { alignSelf: 'flex-end' }]}>
        <MaterialCommunityIcon
          name="filter"
          size={20}
          color={'black'}
          direction={'ltr'}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      {...rest}
      testID={testID}
      style={[styles.container, numeric && styles.right, style]}
    >
      {/* <CellContent
        textStyle={textStyle}
        testID={testID}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      > */}
      {/* <View
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          padding: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      > */}
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={{ height: '70%', alignSelf: 'center', width: '85%' }}
        inputStyle={{ alignSelf: 'center' }}
      />

      {iconFilter}
      {/* </View> */}
      <Popover
        popoverStyle={{
          top: origin.y,
          left: origin.x,
          width: 200
        }}
        arrowSize={{width: 0, height: 0}}
        contentStyle={{
          padding: 16,
          //  backgroundColor: 'pink',
          borderRadius: 8,
        }}
        arrowStyle={{
          borderTopColor: 'pink',
        }}
        backgroundStyle={
          {
            // backgroundColor: 'rgba(0, 0, 255, 0.5)',
          }
        }
        visible={popoverVisible}
        onClose={closePopover}
        fromRect={popoverAnchorRect}
        supportedOrientations={['portrait', 'landscape']}
        titleHeader={true}
      >
        <View>
        <FlatList
          data={searchFilterData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setFilteredOption(item.name);
                  closePopover();
                }}
              >
                <Text style={{padding: 5}}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        </View>
      </Popover>
      {/* </CellContent> */}
    </View>
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
      style={[textStyle, { padding: 10 }]}
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
    justifyContent: 'space-between'
    //  borderRightWidth : 0.5
  },
  right: {
    justifyContent: 'flex-end',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  icon: {
    height: 24,
    justifyContent: 'center',
  },
});

export default DataTableSearchCell;
