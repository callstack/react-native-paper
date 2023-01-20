import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import ListSubheader from './ListSubheader';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * Title text for the section.
   */
  title?: string;
  /**
   * Content of the section.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Style that is passed to Title element.
   */
  titleStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component used to group list items.
 *
 * <div class="screenshots">
 *   <img src="screenshots/list-section.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Section>
 *     <List.Subheader>Some title</List.Subheader>
 *     <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
 *     <List.Item
 *       title="Second Item"
 *       left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
 *     />
 *   </List.Section>
 * );
 *
 * export default MyComponent;
 * ```
 */
const ListSection = ({
  children,
  title,
  titleStyle,
  style,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const viewProps = { ...rest, theme };

  return (
    <View {...viewProps} style={[styles.container, style]}>
      {title ? (
        <ListSubheader style={titleStyle} theme={theme}>
          {title}
        </ListSubheader>
      ) : null}
      {children}
    </View>
  );
};

ListSection.displayName = 'List.Section';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

export default ListSection;
