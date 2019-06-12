/* @flow */

import * as React from 'react';
import { StyleSheet } from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof Text> & {
  /**
   * @optional
   */
  theme: Theme,
  /**
   * Style that is passed to Text element.
   */
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
    const fontFamily = fonts.medium;
    const textColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <Text
        numberOfLines={1}
        {...rest}
        style={[styles.container, { color: textColor, fontFamily }, style]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
});

export default withTheme(ListSubheader);
