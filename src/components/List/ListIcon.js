/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon, { type IconSource } from '../Icon';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = {
  /**
   * Icon to show.
   */
  icon: IconSource,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

/**
 * A component to show an icon in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ListSection } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ListSection.Icon icon="folder" />
 * );
 * ```
 */
class ListIcon extends React.Component<Props> {
  static displayName = 'ListSection.Icon';

  render() {
    const { icon, theme, style } = this.props;

    const iconColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

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

export default withTheme(ListIcon);
