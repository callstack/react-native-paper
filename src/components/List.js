/* @flow */

import color from 'color';
import * as React from 'react';
import { View, Text } from 'react-native';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Title to show as the header for the list.
   */
  title?: string,
  /**
   * Content of the `List`.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A List groups Tiles (`ListItem`) inside the container.
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
 * import { List, ListItem } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <List title="Some title">
 *         <ListItem
 *           text="First Item"
 *           icon="folder"
 *        />
 *         <ListItem
 *           text="Second Item"
 *           icon="folder"
 *        />
 *      </DrawerSection>
 *     );
 *   }
 * }
 * ```
 */
const List = ({ children, title, theme, ...props }: Props) => {
  const { colors, fonts } = theme;
  const titleColor = color(colors.text)
    .alpha(0.54)
    .rgb()
    .string();
  const fontFamily = fonts.medium;

  return (
    <View
      {...props}
      style={{ marginVertical: 8, justifyContent: 'flex-start' }}
    >
      {title && (
        <View
          style={{ height: 40, flexDirection: 'row', alignItems: 'center' }}
        >
          <Text
            numberOfLines={1}
            style={{ color: titleColor, fontFamily, marginLeft: 16 }}
          >
            {title}
          </Text>
        </View>
      )}
      {children}
    </View>
  );
};

export default withTheme(List);
