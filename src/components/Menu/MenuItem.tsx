import * as React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type PressableAndroidRippleConfig,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { useMenuItemLayout } from './context';
import { MenuTokens, type MenuColorScheme } from './tokens';
import {
  getContentMaxWidth,
  getMenuContainerColor,
  getMenuItemMorphRadii,
  getMenuItemColor,
  MAX_WIDTH,
  MIN_WIDTH,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../theme/types';
import Badge from '../Badge';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
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
   * Optional badge content. `true` shows a small dot; string/number shows a pill badge.
   * @see https://m3.material.io/components/menus/overview
   */
  badge?: boolean | string | number;
  /**
   * Nested menu content. When set, pressing the item opens a lightweight
   * nested surface (portal) with these children (typically more `Menu.Item`s).
   * This is not a full nested `Menu` instance (no independent spring open of
   * the submenu surface); it is an M3 expressive stretch for simple submenus.
   */
  submenu?: React.ReactNode;
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
   * Sets min height with dense layout.
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
   * Type of background drawable to display the feedback (Android).
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
 * Supports MD3 selection (`selected`), supporting text, trailing supporting text,
 * dense layout, badges, and lightweight nested `submenu` surfaces.
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
 *     <Menu.Item title="Share" dense badge={3} />
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
  badge,
  submenu,
  selected = false,
  colorScheme: colorSchemeProp,
  disabled,
  roundedTop: roundedTopProp,
  roundedBottom: roundedBottomProp,
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
  const layout = useMenuItemLayout();
  // Prefer layout/root value so portaled items still honor reduce-motion.
  const ambientReduceMotion = useReduceMotion();
  const reduceMotion = layout?.reduceMotion ?? ambientReduceMotion;

  const colorScheme = colorSchemeProp ?? layout?.colorScheme ?? 'standard';
  const roundedTop = roundedTopProp ?? layout?.roundedTop ?? false;
  const roundedBottom = roundedBottomProp ?? layout?.roundedBottom ?? false;
  // H3: selected or focus morph target animates to full medium corners
  const morphActive = Boolean(layout?.morphActive);

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

  const resolvedTrailingIcon: IconSource | undefined = trailingIcon
    ? trailingIcon
    : submenu
      ? 'menu-right'
      : undefined;

  const contentMaxWidth = getContentMaxWidth({
    iconWidth: iconSize,
    leadingIcon,
    trailingIcon: resolvedTrailingIcon,
    hasTrailingSupportingText:
      Boolean(trailingSupportingText) ||
      (badge !== undefined && badge !== false && badge !== null),
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

  const morphRadii = getMenuItemMorphRadii({
    theme,
    selected,
    morphActive,
    roundedTop,
    roundedBottom,
  });

  // H3: spring-animated per-corner radii as focus/selection morphs the item shape.
  const topLeftRadius = useSharedValue(morphRadii.topLeft);
  const topRightRadius = useSharedValue(morphRadii.topRight);
  const bottomLeftRadius = useSharedValue(morphRadii.bottomLeft);
  const bottomRightRadius = useSharedValue(morphRadii.bottomRight);

  React.useEffect(() => {
    const targets = [
      { value: topLeftRadius, toValue: morphRadii.topLeft },
      { value: topRightRadius, toValue: morphRadii.topRight },
      { value: bottomLeftRadius, toValue: morphRadii.bottomLeft },
      { value: bottomRightRadius, toValue: morphRadii.bottomRight },
    ];

    if (reduceMotion) {
      targets.forEach(({ value, toValue }) => {
        value.value = toValue;
      });
      return;
    }

    const spatialSpring = toRawSpring(theme.motion.spring.fast.spatial);
    targets.forEach(({ value, toValue }) => {
      value.value = withSpring(toValue, spatialSpring);
    });
  }, [
    morphRadii.topLeft,
    morphRadii.topRight,
    morphRadii.bottomLeft,
    morphRadii.bottomRight,
    reduceMotion,
    theme.motion.spring.fast.spatial,
    topLeftRadius,
    topRightRadius,
    bottomLeftRadius,
    bottomRightRadius,
  ]);

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: topLeftRadius.value,
    borderTopRightRadius: topRightRadius.value,
    borderBottomLeftRadius: bottomLeftRadius.value,
    borderBottomRightRadius: bottomRightRadius.value,
  }));

  const isSelected = selected && !disabled;
  const [submenuOpen, setSubmenuOpen] = React.useState(false);
  const [submenuAnchor, setSubmenuAnchor] = React.useState({ x: 0, y: 0 });
  const itemRef = React.useRef<React.ComponentRef<typeof View>>(null);

  const handlePress = (e: GestureResponderEvent) => {
    layout?.setFocusedKey(layout.itemKey);

    if (submenu && !disabled) {
      setSubmenuOpen(true);
      itemRef.current?.measureInWindow((x, y, width) => {
        setSubmenuAnchor({
          x: x + width,
          y,
        });
      });
      return;
    }

    onPress?.(e);
  };

  const showBadge = badge !== undefined && badge !== false && badge !== null;
  const badgeIsDot = badge === true;

  return (
    <>
      <View ref={itemRef} collapsable={false}>
        <Animated.View
          style={[
            styles.morphShell,
            {
              paddingHorizontal: itemPaddingHorizontal,
              minWidth,
              maxWidth,
              minHeight: dense ? denseItemHeight : itemHeight,
              ...(supportingText
                ? { paddingVertical: 8 }
                : { height: dense ? denseItemHeight : itemHeight }),
            },
            animatedBorderStyle,
            containerColor ? { backgroundColor: containerColor } : null,
            style,
          ]}
          testID={testID}
        >
          <TouchableRipple
            // Items fill the menu's scroll view edge to edge with no gap, which
            // clips an outward ring and runs it into the neighbouring items.
            focusRing="inward"
            theme={theme}
            style={styles.pressableFill}
            onPress={handlePress}
            onPressIn={() => {
              if (!disabled && layout) {
                layout.setFocusedKey(layout.itemKey);
              }
            }}
            disabled={disabled}
            background={background}
            aria-label={ariaLabel}
            role="menuitem"
            aria-disabled={disabled}
            aria-checked={ariaChecked}
            aria-selected={ariaSelected ?? (isSelected ? true : undefined)}
            aria-busy={ariaBusy}
            aria-expanded={ariaExpanded ?? (submenu ? submenuOpen : undefined)}
            hitSlop={hitSlop}
          >
            <View
              style={[styles.row, { opacity: contentOpacity }, containerStyle]}
            >
              {leadingIcon ? (
                <View
                  style={[{ width: iconSize }, styles.leadingIcon]}
                  pointerEvents="box-none"
                >
                  <Icon
                    source={leadingIcon}
                    size={iconSize}
                    color={iconColor}
                  />
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
                {supportingText ? (
                  <Text
                    variant={MenuTokens.typography.supporting}
                    selectable={false}
                    numberOfLines={1}
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
              {showBadge ? (
                <View
                  style={styles.badgeSlot}
                  testID="menu-item-badge"
                  pointerEvents="none"
                >
                  <Badge visible>{badgeIsDot ? undefined : badge}</Badge>
                </View>
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
        </Animated.View>
      </View>
      {submenu && submenuOpen ? (
        <Portal>
          <TouchableRipple
            onPress={() => setSubmenuOpen(false)}
            style={styles.submenuOverlay}
            accessibilityRole="button"
            accessibilityLabel="Dismiss submenu"
          >
            <View />
          </TouchableRipple>
          <View
            style={[
              styles.submenu,
              {
                left: Math.min(
                  submenuAnchor.x,
                  Dimensions.get('window').width - MIN_WIDTH - 8
                ),
                top: submenuAnchor.y,
              },
            ]}
          >
            <Surface
              elevation={MenuTokens.elevation.default}
              borderRadius={theme.shapes.corner.large}
              backgroundColor={getMenuContainerColor({
                theme,
                elevation: MenuTokens.elevation.default,
                colorScheme,
              })}
              style={styles.submenuSurface}
            >
              {submenu}
            </Surface>
          </View>
        </Portal>
      ) : null}
    </>
  );
};

MenuItem.displayName = 'Menu.Item';

const styles = StyleSheet.create({
  morphShell: {
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  pressableFill: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    maxWidth: MAX_WIDTH - MenuTokens.sizes.itemPaddingHorizontal * 2,
  },
  leadingIcon: {
    flexShrink: 0,
  },
  content: {
    flexShrink: 1,
    flexGrow: 0,
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
  badgeSlot: {
    marginLeft: 8,
    flexShrink: 0,
    justifyContent: 'center',
  },
  submenuOverlay: {
    ...StyleSheet.absoluteFill,
  },
  submenu: {
    position: 'absolute',
    zIndex: 1000,
  },
  submenuSurface: {
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
    paddingVertical: MenuTokens.sizes.containerPaddingVertical,
    overflow: 'hidden',
  },
});

export default MenuItem;
