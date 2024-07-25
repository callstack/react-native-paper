import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  I18nManager,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
  Modal,
  View,
} from 'react-native';

import color from 'color';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Text from '../Typography/Text';
import Menu from '../Menu/Menu';

export type Props = React.ComponentPropsWithRef<typeof Pressable> & {
  /**
   * Text content of the `DataTableTitle`.
   */
  children: React.ReactNode;
  /**
   * Align the text to the right. Generally monetary or number fields are aligned to right.
   */
  numeric?: boolean;
  /**
   * Direction of sorting. An arrow indicating the direction is displayed when this is given.
   */
  sortDirection?: 'ascending' | 'descending';
  /**
   * The number of lines to show.
   */

  filterOption?: boolean;
  numberOfLines?: number;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  onLeftIconPress?: (e: GestureResponderEvent) => void;
  onPressAsc?:() => void,
  onPressDes?:() => void,
  style?: StyleProp<ViewStyle>;
  /**
   * Text content style of the `DataTableTitle`.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to display title in table header.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *       <DataTable>
 *         <DataTable.Header>
 *           <DataTable.Title
 *             sortDirection='descending'
 *           >
 *             Dessert
 *           </DataTable.Title>
 *           <DataTable.Title numeric>Calories</DataTable.Title>
 *           <DataTable.Title numeric>Fat (g)</DataTable.Title>
 *         </DataTable.Header>
 *       </DataTable>
 * );
 *
 * export default MyComponent;
 * ```
 */

const DataTableTitle = ({
  numeric,
  children,
  onPress,
  onLeftIconPress,
  onPressAsc,
  onPressDes,
  sortDirection,
  filterOption = true,
  textStyle,
  style,
  theme: themeOverrides,
  numberOfLines = 1,
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: spinAnim } = React.useRef<Animated.Value>(
    new Animated.Value(sortDirection === 'ascending' ? 0 : 1)
  );
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    Animated.timing(spinAnim, {
      toValue: sortDirection === 'ascending' ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [sortDirection, spinAnim]);

  const textColor = theme.isV3 ? theme.colors.onSurface : theme?.colors?.text;

  const alphaTextColor = color(textColor).alpha(0.6).rgb().string();

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // const icon = sortDirection ? (
  //   <Animated.View style={[styles.icon, { transform: [{ rotate: spin }] }]}>
  //     <MaterialCommunityIcon
  //       name="arrow-up"
  //       size={16}
  //       color={textColor}
  //       direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
  //     />
  //   </Animated.View>
  // ) : null;

  const iconFilter = filterOption ? (
    <TouchableOpacity
      onPress={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <Animated.View style={[styles.icon, { alignSelf: 'flex-end' }]}>
        <MaterialCommunityIcon
          name="dots-vertical"
          size={16}
          color={textColor}
          direction={'ltr'}
        />
      </Animated.View>
    </TouchableOpacity>
  ) : null;
  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      {...rest}
      style={[
        styles.container,
        numeric && styles.right,
        style,
       
      ]}
    >
      {/* {icon} */}
      <Text
        style={[
          styles.cell,
          // height must scale with numberOfLines
          { maxHeight: 24 * numberOfLines },
          // if numberOfLines causes wrap, center is lost. Align directly, sensitive to numeric and RTL
          numberOfLines > 1
            ? numeric
              ? I18nManager.getConstants().isRTL
                ? styles.leftText
                : styles.rightText
              : styles.centerText
            : {},
          sortDirection ? styles.sorted : { color: alphaTextColor },
          textStyle,
          { alignSelf: 'center' },
        ]}
        numberOfLines={numberOfLines}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {children}
      </Text>
      {iconFilter}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={modalStyle.centeredView}>
          <View style={modalStyle.modalView}>
          <Pressable onPress={() =>{ setModalVisible(!modalVisible);} } style={{alignContent : 'flex-end'}}>   <MaterialCommunityIcon
          name="close"
          size={16}
          color={textColor}
          direction={'ltr'}
        /></Pressable>
            <Menu.Item leadingIcon="arrow-up" titleStyle={{fontSize : 14}} onPress={onPressAsc} title="Sort Ascending" />
            <Menu.Item leadingIcon="arrow-down" titleStyle={{fontSize : 14}} onPress={onPressDes} title="Sort Descending" />
            <Menu.Item leadingIcon="pin" titleStyle={{fontSize : 14}} onPress={() => {}} title="Pin Column" />
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

DataTableTitle.displayName = 'DataTable.Title';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  rightText: {
    textAlign: 'right',
  },

  leftText: {
    textAlign: 'left',
  },

  centerText: {
    textAlign: 'center',
  },

  right: {
    justifyContent: 'flex-end',
  },

  cell: {
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '500',
    alignItems: 'center',
  },

  sorted: {
    marginLeft: 8,
  },

  icon: {
    height: 24,
    justifyContent: 'center',
  },
});
const modalStyle = StyleSheet.create({
  content: {
    padding: 8,
  },
  first: {
    flex: 2,
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    
    padding: 2,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    top: 55,
    right: 0,
  },
  centeredView: {
    flex: 1,
    marginTop: 30,
    alignSelf: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});

export default DataTableTitle;

// @component-docs ignore-next-line
export { DataTableTitle };
