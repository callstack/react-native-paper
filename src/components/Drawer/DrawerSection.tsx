import color from 'color';
import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import Text from '../Typography/Text';
import Divider from '../Divider';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Title to show as the header for the section.
   */
  title?: string;
  /**
   * Content of the `Drawer.Section`.
   */
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * A component to group content inside a navigation drawer.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/drawer-section.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [active, setActive] = React.useState('');
 *
 *
 *   return (
 *     <Drawer.Section title="Some title">
 *       <Drawer.Item
 *         label="First Item"
 *         active={active === 'first'}
 *         onPress={() => setActive('first')}
 *       />
 *       <Drawer.Item
 *         label="Second Item"
 *         active={active === 'second'}
 *         onPress={() => setActive('second')}
 *       />
 *     </Drawer.Section>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const DrawerSection = ({ children, title, theme, style, ...rest }: Props) => {
  const { fonts } = theme;

  const titleColor = color(
    theme.isV3 ? theme.colors.onSurface : theme.colors.text
  )
    .alpha(0.54)
    .rgb()
    .string();
  const font = fonts.medium;

  return (
    <View style={[styles.container, style]} {...rest}>
      {title && (
        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[{ color: titleColor, ...font }, styles.title]}
          >
            {title}
          </Text>
        </View>
      )}
      {children}
      <Divider bold insets style={styles.divider} />
    </View>
  );
};

DrawerSection.displayName = 'Drawer.Section';

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  titleContainer: {
    height: 56,
    justifyContent: 'center',
  },
  title: {
    marginLeft: 28,
  },
  divider: {
    // marginTop: 4,
  },
});

export default withTheme(DrawerSection);
