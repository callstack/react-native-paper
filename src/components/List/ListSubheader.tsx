import * as React from 'react';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = React.ComponentProps<typeof Text> & {
  /**
   * @optional
   */
  theme: Theme;
  /**
   * Style that is passed to Text element.
   */
  style?: StyleProp<TextStyle>;
};

/**
 * A component used to display a header in lists.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => <List.Subheader>My List Title</List.Subheader>;
 *
 * export default MyComponent;
 * ```
 */
class ListSubheader extends React.Component<Props> {
  static displayName = 'List.Subheader';

  render() {
    const { style, theme, ...rest } = this.props;
    const { colors, fonts } = theme;
    const font = fonts.medium;
    const textColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <Text
        numberOfLines={1}
        {...rest}
        style={[styles.container, { color: textColor, ...font }, style]}
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
