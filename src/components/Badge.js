/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from './Typography/Text';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {
  /**
   * Custom background color for badge.
   */
  color?: string,
  /**
   * Count to display for the badge.
   */
  count?: number,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A badge is component that renders a circle with a number inside.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge count={8} />
 * );
 *
 * export default MyComponent;
 * ```
 */
class Badge extends React.Component<Props, State> {
  static defaultProps = {
    mode: 'text',
  };

  render() {
    const { count, color, style, theme, ...rest } = this.props;
    const { colors } = theme;
    const fontFamily = theme.fonts.medium;

    const backgroundColor = color || colors.primary;

    const badgeStyle = {
      backgroundColor,
    };

    return (
      <View {...rest} style={[styles.badge, badgeStyle, style]}>
        <Text style={[styles.content, { fontFamily }]}>
          {count && count > 99 ? `99+` : count}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default withTheme(Badge);
