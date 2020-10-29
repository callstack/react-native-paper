import * as React from 'react';
import { StyleSheet, StyleProp, TextStyle } from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';

type Props = React.ComponentProps<typeof Text> & {
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
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
const ListSubheader = ({ style, theme, ...rest }: Props) => {
  const { colors, fonts } = theme;
  const font = fonts.medium;
  const textColor = color(colors.text).alpha(0.54).rgb().string();

  return (
    <Text
      numberOfLines={1}
      {...rest}
      style={[styles.container, { color: textColor, ...font }, style]}
    />
  );
};

ListSubheader.displayName = 'List.Subheader';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
});

export default withTheme(ListSubheader);
