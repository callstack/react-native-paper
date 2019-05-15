/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../Typography/Text';
import Divider from '../Divider';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import type { ViewStyleProp } from 'react-native/Libraries/StyleSheet/StyleSheet';

type Props = React.ElementConfig<typeof View> & {
  /**
   * Title to show as the header for the section.
   */
  title?: string,
  /**
   * Content of the `Drawer.Section`.
   */
  children: React.Node,
  style?: ViewStyleProp,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * A component to group content inside a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     active: 'first',
 *   };
 *
 *   render() {
 *     const { active } = this.state;
 *
 *     return (
 *       <Drawer.Section title="Some title">
 *         <Drawer.Item
 *           label="First Item"
 *           active={active === 'first'}
 *           onPress={() => { this.setState({ active: 'first' }); }}
 *         />
 *         <Drawer.Item
 *           label="Second Item"
 *           active={active === 'second'}
 *           onPress={() => { this.setState({ active: 'second' }); }}
 *         />
 *      </Drawer.Section>
 *     );
 *   }
 * }
 * ```
 */
class DrawerSection extends React.Component<Props> {
  static displayName = 'Drawer.Section';

  render() {
    const { children, title, theme, style, ...rest } = this.props;
    const { colors, fonts } = theme;
    const titleColor = color(colors.text)
      .alpha(0.54)
      .rgb()
      .string();
    const fontFamily = fonts.medium;

    return (
      <View style={[styles.container, style]} {...rest}>
        {title && (
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={1}
              style={{ color: titleColor, fontFamily, marginLeft: 16 }}
            >
              {title}
            </Text>
          </View>
        )}
        {children}
        <Divider style={styles.divider} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
  },
  divider: {
    marginTop: 4,
  },
});

export default withTheme(DrawerSection);
