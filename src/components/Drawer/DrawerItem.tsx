import color from 'color';
import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Text from '../Typography/Text';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple';
import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * The label text of the item.
   */
  label: string;
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?: IconSource;
  /**
   * Whether to highlight the drawer item as active.
   */
  active?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Drawer.Item label="First Item" />
 * );
 *
 * export default MyComponent;
 * ```
 */
class DrawerItem extends React.Component<Props> {
  static displayName = 'Drawer.Item';

  render() {
    const {
      icon,
      label,
      active,
      theme,
      style,
      onPress,
      accessibilityLabel,
      ...rest
    } = this.props;
    const { colors, roundness } = theme;
    const backgroundColor = active
      ? color(colors.primary)
          .alpha(0.12)
          .rgb()
          .string()
      : 'transparent';
    const contentColor = active
      ? colors.primary
      : color(colors.text)
          .alpha(0.68)
          .rgb()
          .string();
    const font = theme.fonts.medium;
    const labelMargin = icon ? 32 : 0;

    return (
      <View
        {...rest}
        style={[
          styles.container,
          { backgroundColor, borderRadius: roundness },
          style,
        ]}
      >
        <TouchableRipple
          borderless
          delayPressIn={0}
          onPress={onPress}
          style={{ borderRadius: roundness }}
          accessibilityTraits={active ? ['button', 'selected'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={active ? ['selected'] : []}
          accessibilityLabel={accessibilityLabel}
        >
          <View style={styles.wrapper}>
            {icon ? (
              <Icon source={icon} size={24} color={contentColor} />
            ) : null}
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: contentColor,
                  ...font,
                  marginLeft: labelMargin,
                },
              ]}
            >
              {label}
            </Text>
          </View>
        </TouchableRipple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 4,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    marginRight: 32,
  },
});

export default withTheme(DrawerItem);
