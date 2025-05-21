import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import { Colors } from '../../styles/themes/tokens';
import type { ThemeProp } from '../../types';
import Divider from '../Divider';
import Text from '../Typography/Text';

export type Props = React.ComponentPropsWithRef<typeof View> & {
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
  const {
    colors: { onSurfaceVariant },
    fonts: { titleSmall },
  } = theme;
  const titleMargin = 28;

  return (
    <View style={[styles.container, style]} {...rest}>
      {title && (
        <View style={[styles.titleContainer]}>
          {title && (
            <Text
              variant="titleSmall"
              numberOfLines={1}
              style={[
                {
                  color: onSurfaceVariant,
                  marginLeft: titleMargin,
                  ...titleSmall,
                },
              ]}
              maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
            >
              {title}
            </Text>
          )}
        </View>
      )}
      {children}
      {showDivider && (
        <Divider horizontalInset bold style={styles.divider} theme={theme} />
      )}
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
  divider: {
    marginTop: 4,
    backgroundColor: Colors.neutralVariant50,
  },
});

export default DrawerSection;
