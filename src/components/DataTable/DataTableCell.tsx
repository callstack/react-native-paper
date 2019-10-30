import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple';
import { $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {
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
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * Style of the text inside the cell
   */
  textStyle?: StyleProp<TextStyle>;
};

class DataTableCell extends React.Component<Props> {
  static displayName = 'DataTable.Cell';

  render() {
    const { children, style, numeric, textStyle, ...rest } = this.props;

    return (
      <TouchableRipple {...rest} style={[styles.container, style]}>
        <Text
          numberOfLines={1}
          style={[styles.text, textStyle, numeric && styles.numeric]}
        >
          {children}
        </Text>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  numeric: {
    textAlign: 'right',
  },

  text: {
    flex: 1,
  },
});

export default DataTableCell;
