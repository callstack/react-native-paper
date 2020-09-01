import * as React from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
  I18nManager,
} from 'react-native';
import color from 'color';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';

type Props = React.ComponentPropsWithRef<typeof TouchableWithoutFeedback> & {
  /**
   * Text content of the `DataTableTitle`.
   */
  children: React.ReactNode;
  /**
   * Align the text to the right. Generally monetary or number fields are aligned to right.
   */
  numeric?: boolean;
  /**
   * Direction of sorting. An arrow indicating the direction is displayed when this is given.
   */
  sortDirection?: 'ascending' | 'descending';
  /**
   * The number of lines to show.
   */
  numberOfLines?: number;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type State = {
  spinAnim: Animated.Value;
};

/**
 * A component to display title in table header.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/data-table-header.png" />
 *   </figure>
 * </div>
 *
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *       <DataTable>
 *         <DataTable.Header>
 *           <DataTable.Title
 *             sortDirection='descending'
 *           >
 *             Dessert
 *           </DataTable.Title>
 *           <DataTable.Title numeric>Calories</DataTable.Title>
 *           <DataTable.Title numeric>Fat (g)</DataTable.Title>
 *         </DataTable.Header>
 *       </DataTable>
 * );
 *
 * export default MyComponent;
 * ```
 */

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

  componentDidUpdate(prevProps: Props) {
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

    const textColor = color(theme.colors.text).alpha(0.6).rgb().string();

    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const icon = sortDirection ? (
      <Animated.View style={[styles.icon, { transform: [{ rotate: spin }] }]}>
        <MaterialCommunityIcon
          name="arrow-down"
          size={16}
          color={theme.colors.text}
          direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
        />
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

// @component-docs ignore-next-line
export { DataTableTitle };
