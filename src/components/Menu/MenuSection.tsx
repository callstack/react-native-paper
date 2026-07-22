import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import { MenuTokens } from './tokens';
import { useInternalTheme } from '../../core/theming';
import type { Theme, ThemeProp } from '../../types';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Optional section title (`labelMedium`).
   */
  title?: React.ReactNode;
  /**
   * Grouped `Menu.Item` children (and other menu content).
   */
  children: React.ReactNode;
  /**
   * Style for the section container. Parent `Menu` applies group gaps between
   * sections; do not rely on sibling introspection.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the optional title.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID for tests.
   */
  testID?: string;
};

/**
 * Groups menu items with M3 vertical group spacing.
 *
 * ## Usage
 * ```js
 * <Menu visible onDismiss={...} anchor={...}>
 *   <Menu.Section title="Edit">
 *     <Menu.Item title="Cut" onPress={() => {}} />
 *     <Menu.Item title="Copy" onPress={() => {}} />
 *   </Menu.Section>
 *   <Menu.Section title="Share">
 *     <Menu.Item title="Share" onPress={() => {}} />
 *   </Menu.Section>
 * </Menu>
 * ```
 */
const MenuSection = ({
  title,
  children,
  style,
  titleStyle,
  theme: themeOverrides,
  testID = 'menu-section',
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <View style={[styles.container, style]} testID={testID}>
      {title != null && title !== false ? (
        <Text
          variant="labelMedium"
          style={[
            styles.title,
            {
              color: (theme as Theme).colors.onSurfaceVariant,
              paddingHorizontal: MenuTokens.sizes.itemPaddingHorizontal,
            },
            titleStyle,
          ]}
          testID={`${testID}-title`}
        >
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
};

MenuSection.displayName = 'Menu.Section';

const styles = StyleSheet.create({
  container: {
    // Gap between sections is applied by Menu when composing children.
  },
  title: {
    paddingVertical: 4,
  },
});

export default MenuSection;
