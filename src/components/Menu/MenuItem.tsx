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
import { black, white } from '../../styles/themes/v2/colors';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

const MIN_WIDTH = 112;
const MAX_WIDTH = 280;

type Props = {
  /**
   * Title text for the `MenuItem`.
   */
  title: React.ReactNode;
  /**
   * @renamed Renamed from 'icon' to 'leadingIcon' in v3.x
   *
   * Leading icon to display for the `MenuItem`.
   */
  leadingIcon?: IconSource;
  /**
   * @supported Available in v3.x with theme version 3
   *
   * Trailing icon to display for the `MenuItem`.
   */
  trailingIcon?: IconSource;
  /**
   * Whether the 'item' is disabled. A disabled 'item' is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * @supported Available in v3.x with theme version 3
   *
   * Sets min height with densed layout.
   */
  dense?: boolean;
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
  theme: Theme;
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
 *     <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
 *     <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
 *     <Menu.Item leadingIcon="content-cut" onPress={() => {}} title="Cut" disabled />
 *     <Menu.Item leadingIcon="content-copy" onPress={() => {}} title="Copy" disabled />
 *     <Menu.Item leadingIcon="content-paste" onPress={() => {}} title="Paste" />
 *   </View>
 * );
 *
 * export default MyComponent;
 * ```
 */
const MenuItem = ({
  leadingIcon,
  trailingIcon,
  dense,
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
  const disabledColor = theme.isV3
    ? theme.colors.onSurfaceDisabled
    : color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();

  const titleColor = disabled
    ? disabledColor
    : theme.isV3
    ? theme.colors.onSurface
    : color(theme.colors.text).alpha(0.87).rgb().string();

  const iconColor = disabled
    ? disabledColor
    : theme.isV3
    ? theme.colors.onSurfaceVariant
    : color(theme.colors.text).alpha(0.54).rgb().string();

  const underlayColor = theme.isV3
    ? color(theme.colors.primary).alpha(0.12).rgb().string()
    : undefined;

  const iconWidth = theme.isV3 ? 24 : 40;

  const getContentWidth = React.useMemo(() => {
    let maxWidth = MAX_WIDTH;
    let minWidth = MIN_WIDTH;

    if (theme.isV3) {
      minWidth = minWidth - 12;
      if (leadingIcon || trailingIcon) {
        maxWidth = maxWidth - (iconWidth + 24);
      } else if (leadingIcon && trailingIcon) {
        maxWidth = maxWidth - (2 * iconWidth + 24);
      } else {
        maxWidth = maxWidth - 12;
      }
    } else {
      minWidth = minWidth - 16;
      if (leadingIcon) {
        maxWidth = maxWidth - (iconWidth + 48);
      } else {
        maxWidth = maxWidth - 16;
      }
    }

    return {
      minWidth,
      maxWidth,
    };
  }, [theme.isV3, leadingIcon, trailingIcon]);

  const { minWidth, maxWidth } = getContentWidth;

  const containerPadding = theme.isV3 ? 12 : 8;

  return (
    <TouchableRipple
      style={[
        styles.container,
        { paddingHorizontal: containerPadding },
        dense && styles.md3DenseContainer,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="menuitem"
      accessibilityState={{ disabled }}
      underlayColor={underlayColor}
    >
      <View style={styles.row}>
        {leadingIcon ? (
          <View
            style={[!theme.isV3 && styles.item, { width: iconWidth }]}
            pointerEvents="box-none"
          >
            <Icon source={leadingIcon} size={24} color={iconColor} />
          </View>
        ) : null}
        <View
          style={[
            !theme.isV3 && styles.item,
            styles.content,
            { minWidth, maxWidth },
            theme.isV3 &&
              (leadingIcon
                ? styles.md3LeadingIcon
                : styles.md3WithoutLeadingIcon),
            contentStyle,
          ]}
          pointerEvents="none"
        >
          <Text
            variant="bodyLarge"
            selectable={false}
            numberOfLines={1}
            style={[
              !theme.isV3 && styles.title,
              { color: titleColor },
              titleStyle,
            ]}
          >
            {title}
          </Text>
        </View>
        {theme.isV3 && trailingIcon ? (
          <View
            style={[!theme.isV3 && styles.item, { width: iconWidth }]}
            pointerEvents="box-none"
          >
            <Icon source={trailingIcon} size={24} color={iconColor} />
          </View>
        ) : null}
      </View>
    </TouchableRipple>
  );
};

MenuItem.displayName = 'Menu.Item';

const styles = StyleSheet.create({
  container: {
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    height: 48,
    justifyContent: 'center',
  },
  md3DenseContainer: {
    height: 32,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 16,
  },
  item: {
    marginHorizontal: 8,
  },
  content: {
    justifyContent: 'center',
  },
  md3LeadingIcon: {
    marginLeft: 12,
  },
  md3WithoutLeadingIcon: {
    marginLeft: 4,
  },
});

export default withTheme(MenuItem);
