import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon, { IconSource } from '../Icon';

export type Props = {
  /**
   * Icon to show.
   */
  icon: IconSource;
  /**
   * Color for the icon.
   */
  color?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Size of the icon.
   */
  iconSize?: number;
};

const ICON_SIZE = 24;

/**
 * A component to show an icon in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <>
 *     <List.Icon color={MD3Colors.tertiary70} icon="folder" />
 *     <List.Icon color={MD3Colors.tertiary70} icon="equal" iconSize={32} />  // 👈 NEW EXAMPLE
 *     <List.Icon color={MD3Colors.tertiary70} icon="calendar" iconSize={18} />
 *   </>
 * );
 * ```
 *
 * @property iconSize Size of the icon.
 */

const ListIcon = ({
  icon,
  color: iconColor,
  style,
  theme: themeOverrides,
  iconSize,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <View
      style={[theme.isV3 ? styles.itemV3 : styles.item, style]}
      pointerEvents="box-none"
    >
      <Icon
        source={icon}
        size={iconSize || ICON_SIZE}
        color={iconColor}
        theme={theme}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemV3: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ListIcon.displayName = 'List.Icon';

export default ListIcon;
