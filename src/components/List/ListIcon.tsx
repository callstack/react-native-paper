import * as React from 'react';
import { View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple';

type Props = {
  /**
   * Icon to show.
   */
  icon: IconSource;
  /**
   * Color for the icon.
   */
  color: string;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * A component to show an icon in a list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List, Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <List.Icon color={Colors.blue500} icon="folder" />
 * );
 *
 * export default MyComponent;
 * ```
 */
export default class ListIcon extends React.Component<Props> {
  static displayName = 'List.Icon';

  render() {
    const { icon, color: iconColor, onPress, style } = this.props;

    return (
      <View style={[styles.item, style]}>
        <TouchableRipple onPress={onPress}>
          <Icon source={icon} size={24} color={iconColor} />
        </TouchableRipple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    margin: 8,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
