/* @flow */

import color from 'color';
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TouchableRipple from '../TouchableRipple';
import Text from '../Typography/Text';
import withTheme from '../../core/withTheme';
import type { Theme } from '../../types';

type Props = {
  /**
   * Title text for the list control.
   */
  title: React.Node,
  /**
   * Description text for the list control.
   */
  description?: React.Node,
  /**
   * Component to display as primary action of the `ListControl`.
   */
  primaryAction?: React.Element<*>,
  /**
   * Component to display as secondary action of the `ListControl`.
   */
  secondaryAction?: React.Node,
  /**
   * Content of the section.
   */
  children?: React.Node,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
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
 * ListControl is be used to display information,
 * indicate a state or provide actions for a `ListSection` row.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ListControl, Checkbox } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <ListControl
 *     title="First Item"
 *     primaryAction={<Checkbox checked />}
 *   />
 * );
 * ```
 */
class ListControl extends React.Component<Props, State> {
  state = {
    expanded: false,
  };

  _handlePress = () => {
    this.props.onPress && this.props.onPress();
    if (this.props.children) {
      this.setState({
        expanded: !this.state.expanded,
      });
    }
  };

  render() {
    const {
      primaryAction,
      secondaryAction,
      title,
      description,
      children,
      theme,
      style,
    } = this.props;
    const titleColor = color(theme.colors.text)
      .alpha(0.87)
      .rgb()
      .string();
    const descriptionColor = color(theme.colors.text)
      .alpha(0.54)
      .rgb()
      .string();

    return (
      <React.Fragment>
        <TouchableRipple
          style={[styles.container, style]}
          onPress={this._handlePress}
        >
          <View style={styles.row}>
            <View style={[styles.item, styles.avatar, styles.multiline]}>
              {primaryAction}
            </View>
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
            {secondaryAction || children ? (
              <View style={[styles.item, styles.multiline]}>
                {children ? (
                  <MaterialIcons
                    name={
                      this.state.expanded
                        ? 'keyboard-arrow-up'
                        : 'keyboard-arrow-down'
                    }
                    color={titleColor}
                    size={24}
                  />
                ) : (
                  secondaryAction
                )}
              </View>
            ) : null}
          </View>
        </TouchableRipple>
        {this.state.expanded ? children : null}
      </React.Fragment>
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
  avatar: {
    width: 40,
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default withTheme(ListControl);
