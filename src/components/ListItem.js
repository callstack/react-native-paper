/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import Text from './Typography/Text';
import Subheading from './Typography/Subheading';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * The primary text of the item.
   */
  title: React.Node,
  /**
   * Secondary (optional) text for the item.
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
 * ListItem is a component used to show Tiles inside a List.
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
const ListItem = ({
  icon,
  avatar,
  title,
  description,
  theme,
  ...props
}: Props) => {
  const { colors } = theme;
  const descriptionColor = color(colors.text)
    .alpha(0.54)
    .rgb()
    .string();
  return (
    <TouchableRipple {...props}>
      <View style={[styles.wrapper, props.style]}>
        {avatar || icon ? (
          <View style={{ marginRight: 16 }}>
            {avatar || <Icon name={icon} size={24} color={descriptionColor} />}
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Subheading numberOfLines={1}>{title}</Subheading>
          {description && (
            <Text
              style={{
                color: descriptionColor,
              }}
            >
              {description}
            </Text>
          )}
        </View>
        {avatar && icon ? (
          <Icon
            name={icon}
            size={24}
            color={descriptionColor}
            style={{ margin: 16 }}
          />
        ) : null}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
});

export default withTheme(ListItem);
