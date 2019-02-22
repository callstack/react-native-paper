/* @flow */

import * as React from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import color from 'color';
import Icon from '../Icon';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ElementConfig<typeof TouchableWithoutFeedback> & {|
  /**
   * Text content of the `DataTableTitle`.
   */
  children: React.Node,
  /**
   * Align the text to the right. Generally monetary or number fields are aligned to right.
   */
  numeric?: boolean,
  /**
   * Direction of sorting. An arrow indicating the direction is displayed when this is given.
   */
  sortDirection?: 'ascending' | 'descending',
  /**
   * The number of lines to show.
   */
  numberOfLines?: number,
  /**
   * Function to execute on press.
   */
  onPress?: () => mixed,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
|};

type State = {
  spinAnim: Animated.Value,
};

class DataTableTitle extends React.Component<Props, State> {
  static displayName = 'DataTable.Title';

  static defaultProps = {
    numberOfLines: 1,
  };

  state = {
    spinAnim: new Animated.Value(
      this.props.sortDirection === 'ascending' ? 0 : 1
    ),
  };

  componentDidUpdate(prevProps) {
    if (prevProps.sortDirection === this.props.sortDirection) {
      return;
    }

    Animated.timing(this.state.spinAnim, {
      toValue: this.props.sortDirection === 'ascending' ? 0 : 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }

  render() {
    const {
      numeric,
      children,
      onPress,
      sortDirection,
      theme,
      style,
      numberOfLines,
      ...rest
    } = this.props;

    const textColor = color(theme.colors.text)
      .alpha(0.6)
      .rgb()
      .string();

    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const icon = sortDirection ? (
      <Animated.View style={[styles.icon, { transform: [{ rotate: spin }] }]}>
        <Icon source="arrow-downward" size={16} color={theme.colors.text} />
      </Animated.View>
    ) : null;

    return (
      <TouchableWithoutFeedback disabled={!onPress} onPress={onPress} {...rest}>
        <View style={[styles.container, numeric && styles.right, style]}>
          {icon}

          <Text
            style={[
              styles.cell,
              sortDirection ? styles.sorted : { color: textColor },
            ]}
            numberOfLines={numberOfLines}
          >
            {children}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 12,
  },

  right: {
    justifyContent: 'flex-end',
  },

  cell: {
    height: 24,
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '500',
    alignItems: 'center',
  },

  sorted: {
    marginLeft: 8,
  },

  icon: {
    height: 24,
    justifyContent: 'center',
  },
});

export default withTheme(DataTableTitle);
