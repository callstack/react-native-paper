import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ColorValue, GestureResponderEvent } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Content from './Content';
import Shell from './Shell';
import {
  MenuTokens,
  Tokens,
  FOCUS_RING_INSET,
  FOCUS_RING_THICKNESS,
  webNoOutline,
} from './tokens';
import type { Size, Variant } from './tokens';
import { useFocusRing } from './useFocusRing';
import { resolveColors } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { InternalTheme, ThemeProp } from '../../types';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type MenuItemProps = {
  /**
   * Optional icon for the item.
   */
  icon?: IconSource;
  /**
   * Mandatory label.
   */
  label: string;
  /**
   * Called when the item is pressed. The menu is dismissed automatically
   * after `onPress` runs.
   */
  onPress: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label. Falls back to `label`.
   */
  accessibilityLabel?: string;
  testID?: string;
};

export type MenuTriggerProps = {
  /**
   * Icon displayed in the trigger FAB (and cross-faded to `closeIcon` when
   * the menu is open).
   */
  icon: IconSource;
  variant?: Variant;
  size?: Size;
  containerColor?: ColorValue;
  contentColor?: ColorValue;
  visible?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  testID?: string;
};

type TwoToSix<T> =
  | [T, T]
  | [T, T, T]
  | [T, T, T, T]
  | [T, T, T, T, T]
  | [T, T, T, T, T, T];

export type MenuProps = {
  /**
   * Whether the menu is open.
   */
  expanded: boolean;
  /**
   * Called when the user taps the close button or taps an item.
   */
  onDismiss: () => void;
  /**
   * Trigger FAB configuration. The menu renders a morphing FAB that
   * animates between the trigger appearance and the spec'd close button.
   */
  trigger: MenuTriggerProps;
  /**
   * Horizontal side the menu sits on. Default `'end'`.
   */
  alignment?: 'start' | 'center' | 'end';
  /**
   * Icon used by the close button when the menu is expanded. Default
   * `'close'`.
   */
  closeIcon?: IconSource;
  /**
   * Menu items. Spec calls for 2 to 6 items.
   */
  items: TwoToSix<MenuItemProps>;
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Per the M3 FAB Menu spec, the menu picks one of three color sets (primary,
 * secondary, tertiary) based on which family the trigger FAB belongs to.
 * The close button is always the saturated role color; items are always the
 * tonal (container) role color.
 */
const getCloseVariant = (triggerVariant: Variant): Variant => {
  if (triggerVariant === 'primary' || triggerVariant === 'tonalPrimary') {
    return 'primary';
  }
  if (triggerVariant === 'secondary' || triggerVariant === 'tonalSecondary') {
    return 'secondary';
  }
  return 'tertiary';
};

const getItemsVariant = (triggerVariant: Variant): Variant => {
  if (triggerVariant === 'primary' || triggerVariant === 'tonalPrimary') {
    return 'tonalPrimary';
  }
  if (triggerVariant === 'secondary' || triggerVariant === 'tonalSecondary') {
    return 'tonalSecondary';
  }
  return 'tonalTertiary';
};

// Per-item delay used by the stagger. Compose uses a single SlowEffects-driven
// integer count that crosses each item's threshold; we approximate with a
// fixed delay per index.
const STAGGER_MS = 30;

type AnimatedItemProps = {
  expanded: boolean;
  index: number;
  itemCount: number;
  theme: InternalTheme;
  transformOrigin: 'left' | 'center' | 'right';
  marginBottom: number;
  children: React.ReactNode;
};

const AnimatedItem = ({
  expanded,
  index,
  itemCount,
  theme,
  transformOrigin,
  marginBottom,
  children,
}: AnimatedItemProps) => {
  const reduceMotion = useReduceMotion();
  // Initial values match the resting state for the current `expanded` prop so
  // first mount doesn't animate unexpectedly.
  const scaleX = useSharedValue(expanded ? 1 : 0);
  const alpha = useSharedValue(expanded ? 1 : 0);

  React.useEffect(() => {
    const target = expanded ? 1 : 0;
    // Bottom-up on open, top-down on close (matches Compose).
    const delay = expanded
      ? (itemCount - 1 - index) * STAGGER_MS
      : index * STAGGER_MS;

    if (reduceMotion) {
      scaleX.value = target;
      alpha.value = target;
      return;
    }
    scaleX.value = withDelay(
      delay,
      withSpring(target, toRawSpring(theme.motion.spring.fast.spatial))
    );
    alpha.value = withDelay(
      delay,
      withSpring(target, toRawSpring(theme.motion.spring.fast.effects))
    );
  }, [expanded, index, itemCount, theme, reduceMotion, scaleX, alpha]);

  // Only scaleX and opacity animate. Layout height stays at the item's
  // natural size — the items container is absolutely positioned above the
  // trigger, so this fixed height never affects the trigger's position.
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
    opacity: alpha.value,
  }));

  return (
    <Animated.View
      style={[
        { transformOrigin, marginBottom },
        animStyle,
        expanded ? styles.pointerEventsAuto : styles.pointerEventsNone,
      ]}
      importantForAccessibility={expanded ? 'yes' : 'no-hide-descendants'}
      accessibilityElementsHidden={!expanded}
    >
      {children}
    </Animated.View>
  );
};

type ItemProps = {
  icon?: IconSource;
  label: string;
  variant: Variant;
  theme: InternalTheme;
  onPress: (e: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * A single FAB Menu item. Visually a tonal pill with an icon and a label,
 * but it is not a floating action button: no shadow, no enter/exit scaling
 * of its own (the surrounding `AnimatedItem` handles entrance), and its
 * shape and dimensions come from the menu spec rather than FAB tokens.
 */
const MenuItem = ({
  icon,
  label,
  variant,
  theme,
  onPress,
  accessibilityLabel,
  testID,
}: ItemProps) => {
  const colors = resolveColors({ theme, variant });
  const { height, iconSize, leading, trailing, iconLabelGap, shape } =
    MenuTokens.listItem;
  const borderRadius = resolveCornerRadius(theme, shape);

  const { focusedSV, onFocus, onBlur } = useFocusRing();
  const focusRingStyle = useAnimatedStyle(() => ({
    opacity: focusedSV.value ? 1 : 0,
  }));

  return (
    <View style={styles.menuItemWrapper}>
      <View
        style={[
          styles.menuItem,
          { height, borderRadius, backgroundColor: colors.container },
        ]}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          onFocus={onFocus}
          onBlur={onBlur}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? label}
          style={[
            { borderRadius },
            Platform.OS === 'web' ? webNoOutline : null,
          ]}
          testID={testID}
        >
          <Content
            icon={icon}
            label={label}
            contentColor={colors.content}
            height={height}
            iconSize={iconSize}
            leading={leading}
            trailing={trailing}
            iconLabelGap={iconLabelGap}
            testID={testID}
          />
        </TouchableRipple>
      </View>
      <Animated.View
        style={[
          styles.menuItemFocusRing,
          {
            borderColor: theme.colors.secondary,
            borderRadius: borderRadius + FOCUS_RING_INSET,
          },
          focusRingStyle,
        ]}
      />
    </View>
  );
};

type MorphingTriggerProps = {
  triggerVariant: Variant;
  closeVariant: Variant;
  triggerContainerColor?: ColorValue;
  triggerContentColor?: ColorValue;
  size: Size;
  openIcon: IconSource;
  closeIcon: IconSource;
  expanded: boolean;
  /** Whether the trigger FAB is visible; drives the scale/alpha enter/exit. */
  visible: boolean;
  alignment: 'start' | 'center' | 'end';
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  theme: InternalTheme;
  testID?: string;
};

const MorphingTrigger = ({
  triggerVariant,
  closeVariant,
  triggerContainerColor,
  triggerContentColor,
  size,
  openIcon,
  closeIcon,
  expanded,
  visible,
  alignment,
  onPress,
  accessibilityLabel,
  theme,
  testID,
}: MorphingTriggerProps) => {
  const reduceMotion = useReduceMotion();

  const closedSpec = Tokens.sizes[size];
  const closedContainer = closedSpec.container;
  const closedIconSize = closedSpec.icon;
  const closedBorderRadius = resolveCornerRadius(theme, closedSpec.shape);

  const openContainer = MenuTokens.closeButton.container;
  const openIconSize = MenuTokens.closeButton.iconSize;
  // Use container/2 (instead of the cornerFull sentinel) as the open radius,
  // so the interpolation produces a smooth round-corner morph rather than
  // jumping past the visual "circle" threshold almost immediately.
  const openBorderRadius = openContainer / 2;

  // Trigger color set (respects user overrides) and close color set (always
  // the saturated role color per spec — no overrides).
  const triggerColors = resolveColors({
    theme,
    variant: triggerVariant,
    containerColor: triggerContainerColor,
    contentColor: triggerContentColor,
  });
  const closeColors = resolveColors({ theme, variant: closeVariant });

  const progress = useSharedValue(expanded ? 1 : 0);

  React.useEffect(() => {
    if (reduceMotion) {
      progress.value = expanded ? 1 : 0;
      return;
    }
    // Compose's ToggleFloatingActionButton uses a single FastSpatial spring
    // for the full open/close progress (size, corner, color, icon all share
    // one timeline).
    progress.value = withSpring(
      expanded ? 1 : 0,
      toRawSpring(theme.motion.spring.fast.spatial)
    );
  }, [expanded, theme, reduceMotion, progress]);

  // Derived shared values for the morph shape. Passing them to Shell as
  // individual shared values (rather than packing them into an animated
  // style) means Shell can put each into a single `useAnimatedStyle` with
  // no inter-style merge surprises. Explicit deps so toggling `size` while
  // the menu is open re-derives immediately — e.g. closed-state values
  // change to match the new size's resting shape, and the close-state values
  // (always 56 / 28) keep the open shape circular.
  const widthShared = useDerivedValue(
    () => interpolate(progress.value, [0, 1], [closedContainer, openContainer]),
    [closedContainer, openContainer]
  );
  const heightShared = useDerivedValue(
    () => interpolate(progress.value, [0, 1], [closedContainer, openContainer]),
    [closedContainer, openContainer]
  );
  const borderRadiusShared = useDerivedValue(
    () =>
      interpolate(
        progress.value,
        [0, 1],
        [closedBorderRadius, openBorderRadius]
      ),
    [closedBorderRadius, openBorderRadius]
  );

  const openPlaneStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));
  const closePlaneStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));
  const openIconAnimStyle = useAnimatedStyle(() => {
    const offset = (widthShared.value - closedIconSize) / 2;
    return {
      opacity: 1 - progress.value,
      transform: [{ translateX: offset }, { translateY: offset }],
    };
  });
  const closeIconAnimStyle = useAnimatedStyle(() => {
    const offset = (widthShared.value - openIconSize) / 2;
    return {
      opacity: progress.value,
      transform: [{ translateX: offset }, { translateY: offset }],
    };
  });

  // Outer slot is fixed at the trigger's resting size; the FAB itself
  // shrinks toward the top-{start|center|end} corner of that slot when
  // expanded (only meaningful for medium / large sizes).
  const slotAlign: 'flex-start' | 'center' | 'flex-end' =
    alignment === 'start'
      ? 'flex-start'
      : alignment === 'center'
        ? 'center'
        : 'flex-end';

  return (
    <View
      style={[
        styles.triggerSlot,
        {
          width: closedContainer,
          height: closedContainer,
          alignItems: slotAlign,
        },
        visible ? styles.pointerEventsBoxNone : styles.pointerEventsNone,
      ]}
      testID={testID}
    >
      <Shell
        size={size}
        variant={triggerVariant}
        containerColor={triggerContainerColor}
        contentColor={triggerContentColor}
        visible={visible}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        widthShared={widthShared}
        heightShared={heightShared}
        borderRadiusShared={borderRadiusShared}
        transparentBackground
        overlay={
          // Two solid color planes cross-faded by opacity. We avoid
          // interpolateColor because theme.colors.* can be a PlatformColor /
          // DynamicColorIOS opaque value the worklet cannot parse.
          <>
            <Animated.View
              style={[
                styles.colorPlane,
                { backgroundColor: triggerColors.container },
                openPlaneStyle,
              ]}
            />
            <Animated.View
              style={[
                styles.colorPlane,
                { backgroundColor: closeColors.container },
                closePlaneStyle,
              ]}
            />
          </>
        }
        theme={theme}
      >
        <View style={styles.iconOrigin}>
          <Animated.View style={[styles.iconAbsolute, openIconAnimStyle]}>
            <Icon
              source={openIcon}
              size={closedIconSize}
              color={triggerColors.content}
            />
          </Animated.View>
          <Animated.View style={[styles.iconAbsolute, closeIconAnimStyle]}>
            <Icon
              source={closeIcon}
              size={openIconSize}
              color={closeColors.content}
            />
          </Animated.View>
        </View>
      </Shell>
    </View>
  );
};

/**
 * Floating action button menu. Wraps a trigger FAB; when `expanded` is true,
 * items appear stacked above and the trigger morphs into the spec'd close
 * button (`shape: 'full'`, 56 dp, saturated role color).
 *
 * No visual backdrop and no outside-tap dismiss — that matches the MD3 spec
 * and lets the user keep interacting with the content underneath. Dismiss
 * via the close button or by tapping an item.
 *
 * ## Usage
 * ```tsx
 * const [open, setOpen] = React.useState(false);
 *
 * <Portal>
 *   <FAB.Menu
 *     expanded={open}
 *     onDismiss={() => setOpen(false)}
 *     trigger={{ icon: 'plus', variant: 'primary', onPress: () => setOpen(true) }}
 *     items={[
 *       { icon: 'email', label: 'Send', onPress: () => {} },
 *       { icon: 'bell', label: 'Remind', onPress: () => {} },
 *     ]}
 *   />
 * </Portal>
 * ```
 */
const Menu = ({
  expanded,
  onDismiss,
  trigger,
  alignment = 'end',
  closeIcon = 'close',
  items,
  testID = 'floating-action-button-menu',
  theme: themeOverrides,
}: MenuProps) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const isRTL = direction === 'rtl';
  const insets = useSafeAreaInsets();

  const triggerVariant: Variant = trigger.variant ?? 'tonalPrimary';
  const size: Size = trigger.size ?? 'default';
  const openIcon: IconSource = trigger.icon;
  const openOnPress = trigger.onPress;
  const triggerVisible = trigger.visible ?? true;
  const closeVariant = getCloseVariant(triggerVariant);
  const itemsVariant = getItemsVariant(triggerVariant);

  const effectiveExpanded = triggerVisible && expanded;

  const handleItemPress =
    (item: MenuItemProps) => (e: GestureResponderEvent) => {
      item.onPress(e);
      onDismiss();
    };

  const flexAlign: 'flex-start' | 'center' | 'flex-end' =
    alignment === 'start'
      ? 'flex-start'
      : alignment === 'center'
        ? 'center'
        : 'flex-end';
  const itemTransformOrigin: 'left' | 'center' | 'right' =
    alignment === 'start'
      ? isRTL
        ? 'right'
        : 'left'
      : alignment === 'center'
        ? 'center'
        : isRTL
          ? 'left'
          : 'right';

  const triggerSlotSize = Tokens.sizes[size].container;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 16,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
      testID={testID}
    >
      <View style={[styles.stack, { alignItems: flexAlign }]}>
        <View
          style={[
            styles.items,
            alignment === 'start'
              ? styles.itemsStart
              : alignment === 'center'
                ? styles.itemsCenter
                : styles.itemsEnd,
            {
              bottom: triggerSlotSize + MenuTokens.spacing.closeToLastItem,
              alignItems: flexAlign,
            },
          ]}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <AnimatedItem
                key={index}
                expanded={effectiveExpanded}
                index={index}
                itemCount={items.length}
                theme={theme}
                transformOrigin={itemTransformOrigin}
                marginBottom={isLast ? 0 : MenuTokens.spacing.betweenItems}
              >
                <MenuItem
                  icon={item.icon}
                  label={item.label}
                  variant={itemsVariant}
                  theme={theme}
                  accessibilityLabel={item.accessibilityLabel ?? item.label}
                  onPress={handleItemPress(item)}
                  testID={item.testID}
                />
              </AnimatedItem>
            );
          })}
        </View>
        <MorphingTrigger
          triggerVariant={triggerVariant}
          closeVariant={closeVariant}
          triggerContainerColor={trigger.containerColor}
          triggerContentColor={trigger.contentColor}
          size={size}
          openIcon={openIcon}
          closeIcon={closeIcon}
          expanded={effectiveExpanded}
          visible={triggerVisible}
          alignment={alignment}
          onPress={effectiveExpanded ? onDismiss : openOnPress}
          accessibilityLabel={trigger.accessibilityLabel}
          theme={theme}
          testID={trigger.testID}
        />
      </View>
    </View>
  );
};

Menu.displayName = 'Menu';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
  stack: {
    flexDirection: 'column',
    pointerEvents: 'box-none',
  },
  items: {
    position: 'absolute',
    flexDirection: 'column',
    pointerEvents: 'box-none',
  },
  itemsStart: {
    left: 0,
  },
  itemsCenter: {
    left: 0,
    right: 0,
  },
  itemsEnd: {
    right: 0,
  },
  menuItemWrapper: {
    position: 'relative',
  },
  menuItem: {
    overflow: 'hidden',
  },
  menuItemFocusRing: {
    position: 'absolute',
    top: -FOCUS_RING_INSET,
    left: -FOCUS_RING_INSET,
    right: -FOCUS_RING_INSET,
    bottom: -FOCUS_RING_INSET,
    borderWidth: FOCUS_RING_THICKNESS,
    pointerEvents: 'none',
  },
  triggerSlot: {
    justifyContent: 'flex-start',
  },
  colorPlane: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  iconOrigin: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  iconAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  },
  pointerEventsAuto: {
    pointerEvents: 'auto',
  },
  pointerEventsNone: {
    pointerEvents: 'none',
  },
  pointerEventsBoxNone: {
    pointerEvents: 'box-none',
  },
});

export default Menu;

// @component-docs ignore-next-line
export { Menu };
