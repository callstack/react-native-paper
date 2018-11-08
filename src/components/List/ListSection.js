/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof View> & {
  /**
   * Title text for the section.
   */
  title?: string,
  /**
   * Content of the section.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

/**
 * A component used to group list items.
 *
 * <div class="screenshots">
 *   <img src="screenshots/list-section.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <List.Section title="Some title">
 *         <List.Item
 *           title="First Item"
 *           left={() => <List.Icon icon="folder" />}
 *        />
 *         <List.Item
 *           title="Second Item"
 *           left={() => <List.Icon icon="folder" />}
 *        />
 *      </List.Section>
 *     );
 *   }
 * }
 *
 * export default MyComponent;
 * ```
 */
class ListSection extends React.Component<Props> {
  static displayName = 'List.Section';

  render() {
    const { children, title, theme, style, ...rest } = this.props;
    const { colors, fonts } = theme;

    const titleColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    const fontFamily = fonts.medium;

    return (
      <View {...rest} style={[styles.container, style]}>
        {title && (
          <Text
            numberOfLines={1}
            style={[styles.title, { color: titleColor, fontFamily }]}
          >
            {title}
          </Text>
        )}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    marginVertical: 13,
    marginHorizontal: 16,
  },
});

export default withTheme(ListSection);
