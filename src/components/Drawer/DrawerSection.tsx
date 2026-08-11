import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewProps, ViewStyle } from 'react-native';

import { DrawerSectionTokens } from './tokens';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Divider from '../Divider';
import Text from '../Typography/Text';

export type Props = ViewProps & {
  /**
   * Title to show as the header for the section.
   */
  title?: string;
  /**
   * Content of the `Drawer.Section`.
   */
  children: React.ReactNode;
  /**
   * Whether to show `Divider` at the end of the section. True by default.
   */
  showDivider?: boolean;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to group content inside a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [active, setActive] = React.useState('');
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
const DrawerSection = ({
  children,
  title,
  theme: themeOverrides,
  style,
  showDivider = true,
  titleMaxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <View style={[styles.container, style]} {...rest}>
      {title && (
        <View style={styles.titleContainer}>
          <Text
            variant={DrawerSectionTokens.headlineText}
            numberOfLines={1}
            style={[
              styles.title,
              { color: theme.colors[DrawerSectionTokens.headlineColor] },
            ]}
            maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
          >
            {title}
          </Text>
        </View>
      )}
      {children}
      {/* Drawer-specific divider tokens are deprecated in MD3; the standalone
          divider spec (`outlineVariant`, 1dp) applies instead. */}
      {showDivider && (
        <Divider
          horizontalInset
          bold
          style={styles.divider}
          theme={theme}
          testID="drawer-section-divider"
        />
      )}
    </View>
  );
};

DrawerSection.displayName = 'Drawer.Section';

const styles = StyleSheet.create({
  container: {
    marginBottom: DrawerSectionTokens.bottomSpacing,
  },
  titleContainer: {
    height: DrawerSectionTokens.headlineHeight,
    justifyContent: 'center',
  },
  // Aligns the headline with the destination icons.
  title: {
    marginStart: DrawerSectionTokens.headlinePadding,
  },
  divider: {
    marginTop: DrawerSectionTokens.dividerSpacing,
  },
});

export default DrawerSection;
