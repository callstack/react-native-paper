/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import TouchableRipple from '../TouchableRipple';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme, $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {|
  /**
   * Title text for the list item.
   */
  title: React.Node,
  /**
   * Description text for the list item.
   */
  description?: React.Node,
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { color: string }) => React.Node,
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { color: string }) => React.Node,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
|};

/**
 * A component to show tiles inside a List.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-item-1.png" />
 *   <img class="medium" src="screenshots/list-item-2.png" />
 *   <img class="medium" src="screenshots/list-item-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Item
 *     title="First Item"
 *     description="Item description"
 *     left={props => <List.Icon {...props} icon="folder" />}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
class ListItem extends React.Component<Props> {
  static displayName = 'List.Item';

  render() {
    const {
      left,
      right,
      title,
      description,
      onPress,
      theme,
      style,
      ...rest
    } = this.props;
    const titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <TouchableRipple
        {...rest}
        style={[styles.container, style]}
        onPress={onPress}
      >
        <View style={styles.row}>
          {left ? left({ color: descriptionColor }) : null}
          <View style={[styles.item, styles.content]} pointerEvents="none">
            <Text
              numberOfLines={1}
              style={[styles.title, { color: titleColor }]}
            >
              {title}
            </Text>
            {description ? (
              <Text
                numberOfLines={2}
                style={[
                  styles.description,
                  {
                    color: descriptionColor,
                  },
                ]}
              >
                {description}
              </Text>
            ) : null}
          </View>
          {right ? right({ color: descriptionColor }) : null}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    margin: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListItem);
