/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import ListItem from './ListItem';
import ListAccordion from './ListAccordion';
import Text from '../Typography/Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
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
 * import { ListSection, ListItem } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <ListSection title="Some title">
 *         <ListItem
 *           title="First Item"
 *           icon="folder"
 *        />
 *         <ListItem
 *           title="Second Item"
 *           icon="folder"
 *        />
 *      </ListSection>
 *     );
 *   }
 * }
 * ```
 */
class ListSection extends React.Component<Props> {
  // @component ./ListItem.js
  static Item = ListItem;
  // @component ./ListAccordion.js
  static Accordion = ListAccordion;

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
