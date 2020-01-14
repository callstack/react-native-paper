import * as React from 'react';
import { StyleSheet, StyleProp, View, ViewStyle } from 'react-native';
import { $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof View> & {
  /**
   * Content of the `DataTableWrapper`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

class DataTableWrapper extends React.Component<Props> {
  static displayName = 'DataTable.Wrapper';

  render() {
    const { children, style, ...rest } = this.props;

    return (
      <View {...rest} style={[styles.container, style]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default DataTableWrapper;
