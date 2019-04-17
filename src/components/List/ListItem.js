/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import type {
  ViewStyleProp,
  TextStyleProp,
} from 'react-native/Libraries/StyleSheet/StyleSheet';
import TouchableRipple from '../TouchableRipple';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme, $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {|
  /**
   * Title text for the list item.
   */
  title: React.Node,
  /**
   * Description text for the list item.
   */
  description?: React.Node,
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { color: string }) => React.Node,
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { color: string }) => React.Node,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  /**
   * @optional
   */
  theme: Theme,
  /**
   * Style that is passed to the wrapping TouchableRipple element.
   */
  style?: ViewStyleProp,
  /**
   * Style that is passed to Title element.
   */
  titleStyle?: TextStyleProp,
  /**
   * Style that is passed to Description element.
   */
  descriptionStyle?: TextStyleProp,
  /**
   * Ellipsize Mode for the Title
   */
  titleEllipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
  /**
   * Ellipsize Mode for the Description
   */
  descriptionEllipsizeMode?: 'head' | 'middle' | 'tail' | 'clip',
|};

/**
 * A component to show tiles inside a List.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-item-1.png" />
 *   <img class="medium" src="screenshots/list-item-2.png" />
 *   <img class="medium" src="screenshots/list-item-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Item
 *     title="First Item"
 *     description="Item description"
 *     left={props => <List.Icon {...props} icon="folder" />}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
class ListItem extends React.Component<Props> {
  static displayName = 'List.Item';

  render() {
    const {
      left,
      right,
      title,
      description,
      onPress,
      theme: { colors },
      style,
      titleStyle,
      descriptionStyle,
      titleEllipsizeMode,
      descriptionEllipsizeMode,
      ...rest
    } = this.props;

    return (
      <TouchableRipple
        {...rest}
        style={[styles.container, style]}
        onPress={onPress}
      >
        <View style={styles.row}>
          {left ? left({ color: colors.typography.secondary }) : null}
          <View style={[styles.item, styles.content]} pointerEvents="none">
            <Text
              ellipsizeMode={titleEllipsizeMode}
              numberOfLines={1}
              style={[
                styles.title,
                { color: colors.typography.primary },
                titleStyle,
              ]}
            >
              {title}
            </Text>
            {description ? (
              <Text
                ellipsizeMode={descriptionEllipsizeMode}
                numberOfLines={2}
                style={[
                  styles.description,
                  {
                    color: colors.typography.secondary,
                  },
                  descriptionStyle,
                ]}
              >
                {description}
              </Text>
            ) : null}
          </View>
          {right ? right({ color: colors.typography.secondary }) : null}
        </View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    margin: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListItem);
