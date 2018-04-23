/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import Text from './Typography/Text';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * Title text for the list item.
   */
  title: React.Node,
  /**
   * Description text for the list item.
   */
  description?: React.Node,
  /**
   * Name of the icon. Can be a string (name of `MaterialIcon`),
   * an object of shape `{ uri: 'https://path.to' }`,
   * a local image: `require('../path/to/image.png')`,
   * or a valid React Native component.
   */
  icon?: IconSource,
  /**
   * Component to display as avatar image.
   */
  avatar?: React.Node,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

/**
 * ListItem can be used to show tiles inside a List.
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
 * import { ListItem } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ListItem title="First Item" description="Item description" icon="folder" />
 * );
 * ```
 */
class ListItem extends React.Component<Props> {
  render() {
    const {
      icon,
      avatar,
      title,
      description,
      onPress,
      theme,
      style,
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
      <TouchableRipple style={[styles.container, style]} onPress={onPress}>
        <View style={styles.row}>
          {avatar || icon ? (
            <View
              style={[
                styles.item,
                styles.avatar,
                description && styles.multiline,
              ]}
            >
              {avatar || (
                <Icon name={icon} size={24} color={descriptionColor} />
              )}
            </View>
          ) : null}
          <View style={[styles.item, styles.content]}>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: titleColor }]}
            >
              {title}
            </Text>
            {description && (
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
            )}
          </View>
          {avatar && icon ? (
            <View style={[styles.item, description && styles.multiline]}>
              <Icon name={icon} size={24} color={descriptionColor} />
            </View>
          ) : null}
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
  avatar: {
    width: 40,
  },
  multiline: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
