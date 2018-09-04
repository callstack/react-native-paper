/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import TouchableRipple from '../TouchableRipple';
import Icon from '../Icon';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = {
  /**
   * Title text for the list accordion.
   */
  title: React.Node,
  /**
   * Description text for the list accordion.
   */
  description?: React.Node,
  /**
   * Callback which returns a React element to display on the left side.
   */
  left?: (props: { color: string }) => React.Node,
  /**
   * Content of the section.
   */
  children: React.Node,
  /**
   * @optional
   */
  theme: Theme,
  style?: any,
};

type State = {
  expanded: boolean,
};

/**
 * A component used to display an expandable list item.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/list-accordion-1.png" />
 *   <img class="medium" src="screenshots/list-accordion-2.png" />
 *   <img class="medium" src="screenshots/list-accordion-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Accordion
 *     title="Accordion"
 *     left={props => <List.Icon {...props} icon="folder" />}
 *   >
 *     <List.Item title="First item" />
 *     <List.Item title="Second item" />
 *   </List.Accordion>
 * );
 *
 * export default MyComponent;
 * ```
 */
class ListAccordion extends React.Component<Props, State> {
  static displayName = 'List.Accordion';

  state = {
    expanded: false,
  };

  _handlePress = () =>
    this.setState(state => ({
      expanded: !state.expanded,
    }));

  render() {
    const { left, title, description, children, theme, style } = this.props;
    const titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <View>
        <TouchableRipple
          style={[styles.container, style]}
          onPress={this._handlePress}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          accessibilityRole="button"
        >
          <View style={styles.row} pointerEvents="none">
            {left
              ? left({
                  color: this.state.expanded
                    ? theme.colors.primary
                    : descriptionColor,
                })
              : null}
            <View style={[styles.item, styles.content]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.title,
                  {
                    color: this.state.expanded
                      ? theme.colors.primary
                      : titleColor,
                  },
                ]}
              >
                {title}
              </Text>
              {description && (
                <Text
                  numberOfLines={2}
                  style={[
                    styles.description,
                    {
                      color: descriptionColor,
                    },
                  ]}
                >
                  {description}
                </Text>
              )}
            </View>
            <View style={[styles.item, description && styles.multiline]}>
              <Icon
                source={
                  this.state.expanded
                    ? 'keyboard-arrow-up'
                    : 'keyboard-arrow-down'
                }
                color={titleColor}
                size={24}
              />
            </View>
          </View>
        </TouchableRipple>
        {this.state.expanded
          ? React.Children.map(children, child => {
              if (
                left &&
                React.isValidElement(child) &&
                !child.props.left &&
                !child.props.right
              ) {
                return React.cloneElement(child, {
                  style: [styles.child, child.props.style],
                });
              }

              return child;
            })
          : null}
      </View>
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
  multiline: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  child: {
    paddingLeft: 64,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListAccordion);
