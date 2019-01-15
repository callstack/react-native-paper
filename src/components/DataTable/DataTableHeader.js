/* @flow */

import * as React from 'react';
import color from 'color';
import { StyleSheet, View } from 'react-native';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof View> & {|
  /**
   * Content of the `DataTableHeader`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

class DataTableHeader extends React.Component<Props> {
  static displayName = 'DataTable.Header';

  render() {
    const { children, style, theme, ...rest } = this.props;
    const borderBottomColor = color(theme.dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();

    return (
      <View {...rest} style={[styles.header, { borderBottomColor }, style]}>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
  },
});

export default withTheme(DataTableHeader);
