import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
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
};

class DataTableCell extends React.Component<Props> {
  static displayName = 'DataTable.Cell';

  render() {
    const { children, style, numeric, ...rest } = this.props;

    return (
      <TouchableRipple
        {...rest}
        style={[styles.container, numeric && styles.right, style]}
      >
        <Text numberOfLines={1}>{children}</Text>
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

  right: {
    justifyContent: 'flex-end',
  },
});

export default DataTableCell;
