import * as React from 'react';
import { ScrollView, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { withTheme } from '../../core/theming';
import { Theme, $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof ScrollView> & {
  /**
   * Content of the `DataTableColumn`.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme: Theme;
  style?: StyleProp<ViewStyle>;
  /**
   * While the scroll is enabled, column can be scrolled horizontally.
   * By default scroll is disabled.
   */
  scrollable?: boolean;
};

class DataTableColumn extends React.Component<Props> {
  static displayName = 'DataTable.Column';

  render() {
    const { children, scrollable, style } = this.props;

    return (
      <ScrollView
        scrollEnabled={scrollable}
        horizontal={scrollable}
        contentContainerStyle={[styles.container, style]}
      >
        {children}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
});

export default withTheme(DataTableColumn);
// @component-docs ignore-next-line
export { DataTableColumn };
