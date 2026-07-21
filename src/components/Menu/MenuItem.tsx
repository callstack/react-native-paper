import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { MenuTokens, type MenuColorScheme } from './tokens';
import {
  getContentMaxWidth,
  getMenuItemBorderRadius,
  getMenuItemColor,
  MAX_WIDTH,
  MIN_WIDTH,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Title text for the `MenuItem`.
   */
  title: React.ReactNode;
  /**
   * Optional supporting text rendered under the title (`bodySmall`).
   */
  supportingText?: React.ReactNode;
  /**
   * Optional trailing supporting text (`labelLarge`), e.g. a keyboard shortcut.
   */
  trailingSupportingText?: React.ReactNode;
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
   * Whether the item is selected / active. Applies MD3 selected colors
   * (`tertiaryContainer` / `onTertiaryContainer` in the standard scheme)
   * and `corner.medium` rounding.
   */
  selected?: boolean;
  /**
   * Color scheme for the item. Inherited from parent `Menu` when omitted.
   * - `standard` (default)
   * - `vibrant` — M3 Expressive tertiary roles
   */
  colorScheme?: MenuColorScheme;
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
   * Round the top corners (`corner.medium`). Used for the first item in a menu.
   * Prefer letting the parent `Menu` set this via context when possible.
   */
  roundedTop?: boolean;
  /**
   * Round the bottom corners (`corner.medium`). Used for the last item in a menu.
   */
  roundedBottom?: boolean;
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
   * Style that is passed to the supporting text element.
   */
  supportingTextStyle?: StyleProp<TextStyle>;
  /**
   * Style that is passed to the trailing supporting text element.
   */
  trailingSupportingTextStyle?: StyleProp<TextStyle>;
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
  'aria-label'?: string;
  /**
   * Indicates whether the element is checked. Accepts `true`, `false`,
   * or `'mixed'` for an indeterminate state.
   */
  'aria-checked'?: boolean | 'mixed';
  /**
   * Indicates whether the element is selected.
   */
  'aria-selected'?: boolean;
  /**
   * Indicates whether the element is currently busy (e.g. loading).
   */
  'aria-busy'?: boolean;
  /**
   * Indicates whether the element's controlled content is expanded.
   */
  'aria-expanded'?: boolean;
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
 *     <Menu.Item leadingIcon="content-paste" onPress={() => {}} title="Paste" selected />
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
  supportingText,
  trailingSupportingText,
  selected = false,
  colorScheme = 'standard',
  disabled,
  roundedTop,
  roundedBottom,
  background,
  onPress,
  style,
  containerStyle,
  contentStyle,
  titleStyle,
  supportingTextStyle,
  trailingSupportingTextStyle,
  testID = 'menu-item',
  'aria-label': ariaLabel,
  'aria-checked': ariaChecked,
  'aria-selected': ariaSelected,
  'aria-busy': ariaBusy,
  'aria-expanded': ariaExpanded,
  theme: themeOverrides,
  titleMaxFontSizeMultiplier = 1.5,
  hitSlop,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const {
    titleColor,
    iconColor,
    supportingColor,
    containerColor,
    contentOpacity,
  } = getMenuItemColor({
    theme,
    disabled,
    selected,
    colorScheme,
  });

  const {
    itemPaddingHorizontal,
    iconSize,
    iconLabelGap,
    noLeadingIconStart,
    itemHeight,
    denseItemHeight,
    minWidth,
    maxWidth,
  } = MenuTokens.sizes;

  const contentMaxWidth = getContentMaxWidth({
    iconWidth: iconSize,
    leadingIcon,
    trailingIcon,
    hasTrailingSupportingText: Boolean(trailingSupportingText),
  });

  const titleTextStyle = {
    color: titleColor,
    ...theme.fonts[MenuTokens.typography.label],
  };

  const supportingTextStyleResolved = {
    color: supportingColor,
    ...theme.fonts[MenuTokens.typography.supporting],
  };

  const trailingSupportingTextStyleResolved = {
    color: supportingColor,
    ...theme.fonts[MenuTokens.typography.trailingSupporting],
  };

  const borderRadiusStyle = getMenuItemBorderRadius({
    theme,
    selected,
    roundedTop,
    roundedBottom,
  });

  const isSelected = selected && !disabled;

  return (
    <TouchableRipple
      style={[
        styles.container,
        {
          paddingHorizontal: itemPaddingHorizontal,
          minWidth,
          maxWidth,
          height: dense ? denseItemHeight : itemHeight,
        },
        borderRadiusStyle,
        containerColor ? { backgroundColor: containerColor } : null,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      background={background}
      aria-label={ariaLabel}
      role="menuitem"
      aria-disabled={disabled}
      aria-checked={ariaChecked}
      aria-selected={ariaSelected ?? (isSelected ? true : undefined)}
      aria-busy={ariaBusy}
      aria-expanded={ariaExpanded}
      hitSlop={hitSlop}
    >
      <View style={[styles.row, { opacity: contentOpacity }, containerStyle]}>
        {leadingIcon ? (
          <View style={[{ width: iconSize }]} pointerEvents="box-none">
            <Icon source={leadingIcon} size={iconSize} color={iconColor} />
          </View>
        ) : null}
        <View
          style={[
            styles.content,
            {
              minWidth: minWidth - itemPaddingHorizontal,
              maxWidth: contentMaxWidth,
            },
            leadingIcon
              ? { marginLeft: iconLabelGap }
              : { marginLeft: noLeadingIconStart },
            contentStyle,
          ]}
          pointerEvents="none"
        >
          <Text
            variant={MenuTokens.typography.label}
            selectable={false}
            numberOfLines={1}
            testID={`${testID}-title`}
            style={[titleTextStyle, titleStyle]}
            maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
          >
            {title}
          </Text>
          {supportingText ? (
            <Text
              variant={MenuTokens.typography.supporting}
              selectable={false}
              numberOfLines={1}
              testID={`${testID}-supporting`}
              style={[supportingTextStyleResolved, supportingTextStyle]}
            >
              {supportingText}
            </Text>
          ) : null}
        </View>
        {trailingSupportingText ? (
          <Text
            variant={MenuTokens.typography.trailingSupporting}
            selectable={false}
            numberOfLines={1}
            testID={`${testID}-trailing-supporting`}
            style={[
              styles.trailingSupporting,
              trailingSupportingTextStyleResolved,
              trailingSupportingTextStyle,
            ]}
            pointerEvents="none"
          >
            {trailingSupportingText}
          </Text>
        ) : null}
        {trailingIcon ? (
          <View style={[{ width: iconSize }]} pointerEvents="box-none">
            <Icon source={trailingIcon} size={iconSize} color={iconColor} />
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
    justifyContent: 'center',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  trailingSupporting: {
    marginLeft: 12,
  },
});

export default MenuItem;
