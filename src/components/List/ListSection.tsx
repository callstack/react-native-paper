import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import ListSubheader from './ListSubheader';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = React.ComponentProps<typeof View> & {
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
  theme: Theme;
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
 * import { List } from 'react-native-paper';
 *
 * class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <List.Section>
 *         <List.Subheader>Some title</List.Subheader>
 *         <List.Item
 *           title="First Item"
 *           left={() => <List.Icon icon="folder" />}
 *        />
 *         <List.Item
 *           title="Second Item"
 *           left={() => <List.Icon color="#000" icon="folder" />}
 *        />
 *      </List.Section>
 *     );
 *   }
 * }
 *
 * export default MyComponent;
 * ```
 */
class ListSection extends React.Component<Props> {
  static displayName = 'List.Section';

  render() {
    const { children, title, titleStyle, style, ...rest } = this.props;

    return (
      <View {...rest} style={[styles.container, style]}>
        {title && <ListSubheader style={titleStyle}>{title}</ListSubheader>}
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

export default withTheme(ListSection);
