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
};

const ICON_SIZE = 24;

/**
 * A component to show an icon in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <>
 *     <List.Icon color={Colors.tertiary70} icon="folder" />
 *     <List.Icon color={Colors.tertiary70} icon="equal" />
 *     <List.Icon color={Colors.tertiary70} icon="calendar" />
 *   </>
 * );
 *
 * export default MyComponent;
 * ```
 */
const ListIcon = ({
  icon,
  color: iconColor,
  style,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  return (
    <View style={[styles.item, style]} pointerEvents="box-none">
      <Icon source={icon} size={ICON_SIZE} color={iconColor} theme={theme} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ListIcon.displayName = 'List.Icon';

export default ListIcon;
