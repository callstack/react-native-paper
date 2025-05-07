import * as React from 'react';
import {
  AccessibilityState,
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import {
  getContentMaxWidth,
  getMenuItemColor,
  MAX_WIDTH,
  MIN_WIDTH,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon, { IconSource } from '../Icon';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Title text for the `MenuItem`.
   */
  title: React.ReactNode;
  /**
   * @renamed Renamed from 'icon' to 'leadingIcon' in v5.x
   *
   * Leading icon to display for the `MenuItem`.
   */
  leadingIcon?: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Trailing icon to display for the `MenuItem`.
   */
  trailingIcon?: IconSource;
  /**
   * Whether the 'item' is disabled. A disabled 'item' is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Sets min height with densed layout.
   */
  dense?: boolean;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * Style that is passed to the root TouchableRipple container.
   * @optional
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to the outermost container that wraps the entire content, including leading and trailing icons and title text.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to the content container, which wraps the title text.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to the Title element.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * Accessibility label for the Touchable. This is read by the screen reader when the user taps the component.
   */
  accessibilityLabel?: string;
  /**
   * Accessibility state for the Touchable. This is read by the screen reader when the user taps the component.
   */
  accessibilityState?: AccessibilityState;
};

/**
 * A component to show a single list item inside a Menu.
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
  background,
  onPress,
  style,
  containerStyle,
  contentStyle,
  titleStyle,
  rippleColor: customRippleColor,
  testID = 'menu-item',
  accessibilityLabel,
  accessibilityState,
  theme: themeOverrides,
  titleMaxFontSizeMultiplier = 1.5,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { titleColor, iconColor, rippleColor } = getMenuItemColor({
    theme,
    disabled,
    customRippleColor,
  });
  const { isV3 } = theme;

  const containerPadding = isV3 ? 12 : 8;

  const iconWidth = isV3 ? 24 : 40;

  const minWidth = MIN_WIDTH - (isV3 ? 12 : 16);

  const maxWidth = getContentMaxWidth({
    isV3,
    iconWidth,
    leadingIcon,
    trailingIcon,
  });

  const titleTextStyle = {
    color: titleColor,
    ...(isV3 ? theme.fonts.bodyLarge : {}),
  };

  const newAccessibilityState = { ...accessibilityState, disabled };

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
      background={background}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="menuitem"
      accessibilityState={newAccessibilityState}
      rippleColor={rippleColor}
      hitSlop={hitSlop}
    >
      <View style={[styles.row, containerStyle]}>
        {leadingIcon ? (
          <View
            style={[!isV3 && styles.item, { width: iconWidth }]}
            pointerEvents="box-none"
          >
            <Icon source={leadingIcon} size={24} color={iconColor} />
          </View>
        ) : null}
        <View
          style={[
            !isV3 && styles.item,
            styles.content,
            { minWidth, maxWidth },
            isV3 &&
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
            testID={`${testID}-title`}
            style={[!isV3 && styles.title, titleTextStyle, titleStyle]}
            maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
          >
            {title}
          </Text>
        </View>
        {isV3 && trailingIcon ? (
          <View
            style={[!isV3 && styles.item, { width: iconWidth }]}
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

export default MenuItem;
