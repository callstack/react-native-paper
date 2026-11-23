import * as React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  type Role,
  type GestureResponderEvent,
  type PressableAndroidRippleConfig,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useMenuRoot } from './context';
import { MenuTokens, type MenuColorScheme } from './tokens';
import {
  getContentMaxWidth,
  getMenuItemBorderRadius,
  getMenuItemColor,
  MAX_WIDTH,
  MIN_WIDTH,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
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
   * Items of a submenu. Pressing the item opens them in a nested `Menu` at its
   * right edge, instead of calling `onPress`, and a `menu-right` trailing icon
   * is shown unless `trailingIcon` is set. The submenu closes with its parent;
   * to close it from one of its items, close the parent `Menu`.
   */
  submenu?: React.ReactNode;
  /**
   * Whether the item is selected / active. Applies MD3 selected colors
   * (`tertiaryContainer` / `onTertiaryContainer` in the standard scheme)
   * and `corner.medium` rounding.
   *
   * On web this also marks the item as `menuitemradio`, so assistive tech
   * announces it as one of a set. Pass `selected={false}` on the other items
   * in the group so they share the role.
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
   * Sets min height with dense layout.
   */
  dense?: boolean;
  /**
   * Type of background drawable to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Specifies the largest possible scale the title font can reach. Also applies to
   * the supporting and trailing supporting text.
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
   * Style that is passed to the content container.
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
   *
   * On web this marks the item as `menuitemcheckbox`, for options that toggle
   * independently rather than forming a single-choice group.
   */
  'aria-checked'?: boolean | 'mixed';
  /**
   * Indicates whether the element is selected. Prefer `selected`, which maps to
   * `aria-checked` — the state assistive tech reads on a menu item.
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

// Native keeps plain `menuitem`: Android drops the role description for a
// value it cannot map, and iOS ignores all of them anyway.
const getRole = (
  ariaChecked: Props['aria-checked'],
  selected: Props['selected']
): Role => {
  if (Platform.OS !== 'web') {
    return 'menuitem';
  }
  if (ariaChecked !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- valid ARIA role missing from RN's union
    return 'menuitemcheckbox' as Role;
  }
  if (selected !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- valid ARIA role missing from RN's union
    return 'menuitemradio' as Role;
  }
  return 'menuitem';
};

/**
 * A component to show a single list item inside a Menu.
 *
 * Supports MD3 selection (`selected`), supporting text, trailing supporting text,
 * and dense layout.
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
 *     <Menu.Item
 *       leadingIcon="content-paste"
 *       onPress={() => {}}
 *       title="Paste"
 *       supportingText="Insert clipboard"
 *       trailingSupportingText="⌘V"
 *       selected
 *     />
 *     <Menu.Item title="Share" dense />
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
  submenu,
  selected: selectedProp,
  colorScheme: colorSchemeProp,
  disabled,
  background,
  onPress,
  style,
  containerStyle,
  contentStyle,
  titleStyle,
  supportingTextStyle,
  trailingSupportingTextStyle,
  testID,
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
  const root = useMenuRoot();
  const selected = selectedProp ?? false;

  const [submenuVisible, setSubmenuVisible] = React.useState(false);
  const [submenuAnchor, setSubmenuAnchor] = React.useState({ x: 0, y: 0 });
  const itemRef = React.useRef<React.ComponentRef<typeof View>>(null);
  const MenuComponent = root?.MenuComponent;
  const hasSubmenu = Boolean(submenu) && MenuComponent !== undefined;

  // The submenu opens at the item's right edge, level with its top.
  const handlePress = (event: GestureResponderEvent) => {
    if (!hasSubmenu) {
      onPress?.(event);
      return;
    }

    itemRef.current?.measureInWindow((x, y, width) => {
      setSubmenuAnchor({ x: x + width, y });
      setSubmenuVisible(true);
    });
  };
  const resolvedTrailingIcon =
    trailingIcon ?? (hasSubmenu ? 'menu-right' : undefined);

  const role = getRole(ariaChecked, selectedProp);

  const colorScheme = colorSchemeProp ?? root?.colorScheme ?? 'standard';

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

  const hasSupportingText =
    supportingText != null && typeof supportingText !== 'boolean';
  const hasTrailingSupportingText =
    trailingSupportingText != null &&
    typeof trailingSupportingText !== 'boolean';

  const contentMaxWidth = getContentMaxWidth({
    iconWidth: iconSize,
    leadingIcon,
    trailingIcon: resolvedTrailingIcon,
    hasTrailingSupportingText,
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

  return (
    <>
      <TouchableRipple
        ref={itemRef}
        // Items fill the menu's scroll view edge to edge with no gap, which
        // clips an outward ring and runs it into the neighbouring items.
        focusRing="inward"
        theme={theme}
        style={[
          styles.container,
          {
            paddingHorizontal: itemPaddingHorizontal,
            minWidth,
            maxWidth,
            minHeight: dense ? denseItemHeight : itemHeight,
            ...(hasSupportingText || hasTrailingSupportingText
              ? { paddingVertical: 8 }
              : { height: dense ? denseItemHeight : itemHeight }),
          },
          getMenuItemBorderRadius({ theme, selected }),
          containerColor ? { backgroundColor: containerColor } : null,
          style,
        ]}
        onPress={onPress || hasSubmenu ? handlePress : undefined}
        disabled={disabled}
        testID={testID}
        background={background}
        aria-label={ariaLabel}
        role={role}
        aria-disabled={disabled}
        aria-checked={ariaChecked ?? selectedProp}
        aria-selected={ariaSelected}
        aria-busy={ariaBusy}
        aria-expanded={
          ariaExpanded ?? (hasSubmenu ? submenuVisible : undefined)
        }
        hitSlop={hitSlop}
      >
        <View style={[styles.row, { opacity: contentOpacity }, containerStyle]}>
          {leadingIcon ? (
            <View
              style={[{ width: iconSize }, styles.leadingIcon]}
              pointerEvents="box-none"
            >
              <Icon source={leadingIcon} size={iconSize} color={iconColor} />
            </View>
          ) : null}
          <View
            style={[
              styles.content,
              {
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
              style={[titleTextStyle, titleStyle]}
              maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
            >
              {title}
            </Text>
            {hasSupportingText ? (
              <Text
                variant={MenuTokens.typography.supporting}
                selectable={false}
                numberOfLines={1}
                style={[supportingTextStyleResolved, supportingTextStyle]}
                maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
              >
                {supportingText}
              </Text>
            ) : null}
          </View>
          {hasTrailingSupportingText ? (
            <Text
              variant={MenuTokens.typography.trailingSupporting}
              selectable={false}
              numberOfLines={1}
              style={[
                styles.trailingSupporting,
                trailingSupportingTextStyleResolved,
                trailingSupportingTextStyle,
              ]}
              maxFontSizeMultiplier={titleMaxFontSizeMultiplier}
              pointerEvents="none"
            >
              {trailingSupportingText}
            </Text>
          ) : null}
          {resolvedTrailingIcon ? (
            <View
              style={[{ width: iconSize }, styles.trailingIcon]}
              pointerEvents="box-none"
            >
              <Icon
                source={resolvedTrailingIcon}
                size={iconSize}
                color={iconColor}
              />
            </View>
          ) : null}
        </View>
      </TouchableRipple>
      {hasSubmenu ? (
        <MenuComponent
          visible={submenuVisible}
          onDismiss={() => setSubmenuVisible(false)}
          anchor={submenuAnchor}
          colorScheme={colorScheme}
          theme={themeOverrides}
        >
          {submenu}
        </MenuComponent>
      ) : null}
    </>
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
    maxWidth: MAX_WIDTH - MenuTokens.sizes.itemPaddingHorizontal * 2,
  },
  leadingIcon: {
    flexShrink: 0,
  },
  content: {
    flexShrink: 1,
    flexGrow: 1,
    justifyContent: 'center',
  },
  trailingSupporting: {
    marginLeft: 12,
    flexShrink: 0,
  },
  trailingIcon: {
    marginLeft: 12,
    flexShrink: 0,
  },
});

export default MenuItem;
