/* @flow */

import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof Text> & {
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

/**
 * A component used to display a header in lists.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * class MyComponent extends React.Component {
 *  render () {
 *    return <List.Subheader>My List Title</List.Subheader>;
 *  }
 * }
 *
 * export default MyComponent;
 * ```
 */
class ListSubheader extends React.Component<Props> {
  static displayName = 'List.Subheader';

  render() {
    const { style, theme, ...rest } = this.props;
    const { colors, fonts } = theme;

    const computedStyle = StyleSheet.flatten([
      styles.container,
      {
        color: colors.text,
        fontFamily: fonts.regular,
      },
      style,
    ]);

    return <Text numberOfLines={1} {...rest} style={computedStyle} />;
  }
}

const styles = StyleSheet.create({
  container: {
    fontSize: 14,
    lineHeight: 14,
    paddingVertical: 17, // (48-14)/2
    paddingHorizontal: 16,
  },
});

export default withTheme(ListSubheader);
