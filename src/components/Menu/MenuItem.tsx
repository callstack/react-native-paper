import color from 'color';
import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';

export type Props = {
  /**
   * Title text for the `MenuItem`.
   */
  title: React.ReactNode;
  /**
   * Icon to display for the `MenuItem`.
   */
  icon?: IconSource;
  /**
   * Whether the 'item' is disabled. A disabled 'item' is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * @optional
   */
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * Accessibility label for the Touchable. This is read by the screen reader when the user taps the component.
   */
  accessibilityLabel?: string;
};

/**
 * A component to show a single list item inside a Menu.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/menu-item.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View } from 'react-native';
 * import { Menu } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <View style={{ flex: 1 }}>
 *     <Menu.Item icon="redo" onPress={() => {}} title="Redo" />
 *     <Menu.Item icon="undo" onPress={() => {}} title="Undo" />
 *     <Menu.Item icon="content-cut" onPress={() => {}} title="Cut" disabled />
 *     <Menu.Item icon="content-copy" onPress={() => {}} title="Copy" disabled />
 *     <Menu.Item icon="content-paste" onPress={() => {}} title="Paste" />
 *   </View>
 * );
 *
 * export default MyComponent;
 * ```
 */
const MenuItem = ({
  icon,
  title,
  disabled,
  onPress,
  style,
  contentStyle,
  testID,
  titleStyle,
  accessibilityLabel,
  theme,
}: Props) => {
  const disabledColor = color(theme.dark ? white : black)
    .alpha(0.32)
    .rgb()
    .string();

  const titleColor = disabled
    ? disabledColor
    : color(theme.colors.text).alpha(0.87).rgb().string();

  const iconColor = disabled
    ? disabledColor
    : color(theme.colors.text).alpha(0.54).rgb().string();

  return (
    <TouchableRipple
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
    >
      <View style={styles.row}>
        {icon ? (
          <View style={[styles.item, styles.icon]} pointerEvents="box-none">
            <Icon source={icon} size={24} color={iconColor} />
          </View>
        ) : null}
        <View
          style={[
            styles.item,
            styles.content,
            icon ? styles.widthWithIcon : null,
            contentStyle,
          ]}
          pointerEvents="none"
        >
          <Text
            selectable={false}
            numberOfLines={1}
            style={[styles.title, { color: titleColor }, titleStyle]}
          >
            {title}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
};

MenuItem.displayName = 'Menu.Item';

const minWidth = 112;
const maxWidth = 280;
const iconWidth = 40;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    minWidth,
    maxWidth,
    height: 48,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  icon: {
    width: iconWidth,
  },
  title: {
    fontSize: 16,
  },
  item: {
    marginHorizontal: 8,
  },
  content: {
    justifyContent: 'center',
    minWidth: minWidth - 16,
    maxWidth: maxWidth - 16,
  },
  widthWithIcon: {
    maxWidth: maxWidth - (iconWidth + 48),
  },
});

export default withTheme(MenuItem);
