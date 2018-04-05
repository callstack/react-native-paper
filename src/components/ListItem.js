/* @flow */

import color from 'color';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import Subheading from './Typography/Subheading';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * The primary text of the item.
   */
  text: string | React.Node,
  /**
   * Secondary (optional) text for the item.
   */
  secondaryText?: string | React.Node,
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
   * Custom color for the drawer text and icon.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
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
 *   <ListItem text="First Item" secondaryText="Item description" icon="folder" />
 * );
 * ```
 */
const ListItem = ({
  icon,
  avatar,
  text,
  secondaryText,
  theme,
  ...props
}: Props) => {
  const { colors } = theme;
  const secondaryTextColor = color(colors.text)
    .alpha(0.54)
    .rgb()
    .string();
  return (
    <TouchableRipple {...props}>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: 'transparent',
            paddingHorizontal: 16,
          },
        ]}
      >
        {(avatar || icon) && (
          <View style={{ width: 56 }}>
            {avatar || (
              <Icon name={icon} size={24} color={secondaryTextColor} />
            )}
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Subheading numberOfLines={1}>{text}</Subheading>
          {secondaryText && (
            <Text
              style={{
                color: secondaryTextColor,
              }}
            >
              {secondaryText}
            </Text>
          )}
        </View>
        {avatar && icon ? (
          <View
            style={{
              maxWidth: 56,
              paddingLeft: 16,
            }}
          >
            <Icon name={icon} size={24} color={secondaryTextColor} />
          </View>
        ) : null}
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default withTheme(ListItem);
