/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Title to show as the header for the list.
   */
  title?: string,
  /**
   * Content of the `ListSection`.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

/**
 * A ListSection groups Tiles (`ListItem`) inside the container.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-1.png" />
 *   <img class="medium" src="screenshots/list-2.png" />
 *   <img class="medium" src="screenshots/list-3.png" />
 *   <img class="medium" src="screenshots/list-4.png" />
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
const ListSection = ({ children, title, theme, ...props }: Props) => {
  const { colors, fonts } = theme;
  const titleColor = color(colors.text)
    .alpha(0.54)
    .rgb()
    .string();
  const fontFamily = fonts.medium;

  return (
    <View {...props} style={[styles.container, props.style]}>
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
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    justifyContent: 'flex-start',
  },
  title: {
    marginVertical: 13,
    marginHorizontal: 16,
  },
});

export default withTheme(ListSection);
