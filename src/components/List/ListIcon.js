/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { type IconSource } from '../Icon';

type Props = {|
  /**
   * Icon to show.
   */
  icon: IconSource,
  /**
   * Color for the icon.
   */
  color: string,
  style?: any,
|};

/**
 * A component to show an icon in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Icon color={Colors.blue500} icon="folder" />
 * );
 *
 * export default MyComponent;
 * ```
 */
export default class ListIcon extends React.Component<Props> {
  static displayName = 'List.Icon';

  render() {
    const { icon, color: iconColor, style } = this.props;

    return (
      <View style={[styles.item, style]} pointerEvents="box-none">
        <Icon source={icon} size={24} color={iconColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    margin: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
