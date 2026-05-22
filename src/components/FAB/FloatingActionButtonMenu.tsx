import * as React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  StyleSheet,
  View,
} from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FabContent from './FabContent';
import FabShell from './FabShell';
import {
  FloatingActionButtonMenuTokens,
  FloatingActionButtonSize,
  FloatingActionButtonTokens,
  FloatingActionButtonVariant,
} from './tokens';
import { resolveColors } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { InternalTheme, ThemeProp } from '../../types';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';

export type FloatingActionButtonMenuItemProps = {
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

const FloatingActionButtonMenuItem = (
  _props: FloatingActionButtonMenuItemProps
): React.ReactElement | null => null;
FloatingActionButtonMenuItem.displayName = 'FloatingActionButtonMenu.Item';

export type FloatingActionButtonMenuProps = {
  /**
   * Whether the menu is open.
   */
  expanded: boolean;
  /**
   * Called when the user taps the close button or taps an item.
   */
  onDismiss?: () => void;
  /**
   * Trigger FAB. Pass a `<FloatingActionButton .../>`. The menu reads its
   * `variant`, `size`, `icon`, and `onPress` and renders a single morphing
   * FAB that animates between the trigger and the spec'd close button.
   */
  button: React.ReactElement;
  /**
   * Horizontal side the menu sits on. Default `'end'`.
   */
  horizontalAlignment?: 'start' | 'center' | 'end';
  /**
   * Icon used by the close button when the menu is expanded. Default
   * `'close'`.
   */
  closeIcon?: IconSource;
  /**
   * Menu items as `<FloatingActionButtonMenu.Item />`. Spec calls for 2 to 6
   * items; a dev-mode warning fires outside that range.
   */
  children: React.ReactNode;
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
const getCloseVariant = (
  triggerVariant: FloatingActionButtonVariant
): FloatingActionButtonVariant => {
  if (triggerVariant === 'primary' || triggerVariant === 'tonalPrimary') {
    return 'primary';
  }
  if (triggerVariant === 'secondary' || triggerVariant === 'tonalSecondary') {
    return 'secondary';
  }
  return 'tertiary';
};

const getItemsVariant = (
  triggerVariant: FloatingActionButtonVariant
): FloatingActionButtonVariant => {
  if (triggerVariant === 'primary' || triggerVariant === 'tonalPrimary') {
    return 'tonalPrimary';
  }
  if (triggerVariant === 'secondary' || triggerVariant === 'tonalSecondary') {
    return 'tonalSecondary';
  }
  return 'tonalTertiary';
};

type ButtonExtractableProps = {
  variant?: FloatingActionButtonVariant;
  size?: FloatingActionButtonSize;
  icon?: IconSource;
  containerColor?: ColorValue;
  contentColor?: ColorValue;
  visible?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  testID?: string;
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

type MenuItemProps = {
  icon?: IconSource;
  label: string;
  variant: FloatingActionButtonVariant;
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
}: MenuItemProps) => {
  const colors = resolveColors({ theme, variant });
  const { height, iconSize, leading, trailing, iconLabelGap, shape } =
    FloatingActionButtonMenuTokens.listItem;
  const borderRadius = resolveCornerRadius(theme, shape);
  return (
    <View
      style={[
        styles.menuItem,
        { height, borderRadius, backgroundColor: colors.container },
      ]}
    >
      <TouchableRipple
        borderless
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        style={{ borderRadius }}
        testID={testID}
      >
        <FabContent
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
  );
};

type MorphingTriggerProps = {
  triggerVariant: FloatingActionButtonVariant;
  closeVariant: FloatingActionButtonVariant;
  triggerContainerColor?: ColorValue;
  triggerContentColor?: ColorValue;
  size: FloatingActionButtonSize;
  openIcon: IconSource;
  closeIcon: IconSource;
  expanded: boolean;
  /** Whether the trigger FAB is visible; drives the scale/alpha enter/exit. */
  visible: boolean;
  horizontalAlignment: 'start' | 'center' | 'end';
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
  horizontalAlignment,
  onPress,
  accessibilityLabel,
  theme,
  testID,
}: MorphingTriggerProps) => {
  const reduceMotion = useReduceMotion();

  const closedSpec = FloatingActionButtonTokens.sizes[size];
  const closedContainer = closedSpec.container;
  const closedIconSize = closedSpec.icon;
  const closedBorderRadius = resolveCornerRadius(theme, closedSpec.shape);

  const openContainer = FloatingActionButtonMenuTokens.closeButton.container;
  const openIconSize = FloatingActionButtonMenuTokens.closeButton.iconSize;
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

  // Derived shared values for the morph shape. Passing them to FabShell as
  // individual shared values (rather than packing them into an animated
  // style) means FabShell can put each into a single `useAnimatedStyle` with
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

  // Outer slot is fixed at the trigger's resting size; the FAB itself
  // shrinks toward the top-{start|center|end} corner of that slot when
  // expanded (only meaningful for medium / large sizes).
  const slotAlign: 'flex-start' | 'center' | 'flex-end' =
    horizontalAlignment === 'start'
      ? 'flex-start'
      : horizontalAlignment === 'center'
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
      <FabShell
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
        <View style={styles.iconStackContainer}>
          <Animated.View style={[styles.iconStack, openPlaneStyle]}>
            <Icon
              source={openIcon}
              size={closedIconSize}
              color={triggerColors.content}
            />
          </Animated.View>
          <Animated.View style={[styles.iconStack, closePlaneStyle]}>
            <Icon
              source={closeIcon}
              size={openIconSize}
              color={closeColors.content}
            />
          </Animated.View>
        </View>
      </FabShell>
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
 *   <FloatingActionButtonMenu
 *     expanded={open}
 *     onDismiss={() => setOpen(false)}
 *     button={
 *       <FloatingActionButton
 *         icon="plus"
 *         variant="primary"
 *         onPress={() => setOpen(true)}
 *       />
 *     }
 *   >
 *     <FloatingActionButtonMenu.Item
 *       icon="email"
 *       label="Send"
 *       onPress={() => {}}
 *     />
 *     <FloatingActionButtonMenu.Item
 *       icon="bell"
 *       label="Remind"
 *       onPress={() => {}}
 *     />
 *   </FloatingActionButtonMenu>
 * </Portal>
 * ```
 */
const FloatingActionButtonMenu = ({
  expanded,
  onDismiss,
  button,
  horizontalAlignment = 'end',
  closeIcon = 'close',
  children,
  testID = 'floating-action-button-menu',
  theme: themeOverrides,
}: FloatingActionButtonMenuProps) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const isRTL = direction === 'rtl';
  const insets = useSafeAreaInsets();

  const items = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<FloatingActionButtonMenuItemProps> =>
        React.isValidElement(child) &&
        child.type === FloatingActionButtonMenuItem
    )
    .map((child) => child.props);

  if (
    process.env.NODE_ENV !== 'production' &&
    (items.length < 2 || items.length > 6)
  ) {
    console.warn(
      `FloatingActionButtonMenu expects 2 to 6 items; received ${items.length}.`
    );
  }

  const buttonProps: ButtonExtractableProps = React.isValidElement(button)
    ? (button.props as ButtonExtractableProps)
    : {};
  const triggerVariant: FloatingActionButtonVariant =
    buttonProps.variant ?? 'tonalPrimary';
  const size: FloatingActionButtonSize = buttonProps.size ?? 'default';
  const openIcon: IconSource = buttonProps.icon ?? 'plus';
  const openOnPress = buttonProps.onPress;
  const triggerVisible = buttonProps.visible ?? true;
  const closeVariant = getCloseVariant(triggerVariant);
  const itemsVariant = getItemsVariant(triggerVariant);

  // When the trigger isn't visible, items don't either; they share the
  // FAB's enter/exit.
  const effectiveExpanded = triggerVisible && expanded;

  const handleItemPress =
    (item: FloatingActionButtonMenuItemProps) => (e: GestureResponderEvent) => {
      item.onPress(e);
      onDismiss?.();
    };

  const alignment: 'flex-start' | 'center' | 'flex-end' =
    horizontalAlignment === 'start'
      ? 'flex-start'
      : horizontalAlignment === 'center'
      ? 'center'
      : 'flex-end';
  // Per-item motion is purely horizontal (matches Compose's width animation);
  // the bottom-up feel comes from the stagger order, not the scale anchor.
  // RN auto-mirrors `left`/`right` position styles in RTL, so the items
  // container visually moves to the opposite edge — but `transformOrigin` is
  // a transform property and is NOT auto-flipped. Invert the mapping in RTL
  // so each item still scales out from the screen-edge side rather than the
  // screen-center side.
  const itemTransformOrigin: 'left' | 'center' | 'right' =
    horizontalAlignment === 'start'
      ? isRTL
        ? 'right'
        : 'left'
      : horizontalAlignment === 'center'
      ? 'center'
      : isRTL
      ? 'left'
      : 'right';
  // The trigger's slot is fixed at the original FAB's size. The close button
  // (always 56 dp) anchors to the top of this slot when expanded.
  const triggerSlotSize = FloatingActionButtonTokens.sizes[size].container;

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
      <View style={[styles.stack, { alignItems: alignment }]}>
        {/* Absolutely positioned above the trigger so item layout (and the
            scaleX bounce on each item) never affects the trigger's position
            — no vertical spring. The items container sits closeToLastItem
            above the original FAB slot. */}
        <View
          style={[
            styles.items,
            horizontalAlignment === 'start'
              ? styles.itemsStart
              : horizontalAlignment === 'center'
              ? styles.itemsCenter
              : styles.itemsEnd,
            {
              bottom:
                triggerSlotSize +
                FloatingActionButtonMenuTokens.spacing.closeToLastItem,
              alignItems: alignment,
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
                marginBottom={
                  isLast
                    ? 0
                    : FloatingActionButtonMenuTokens.spacing.betweenItems
                }
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
          triggerContainerColor={buttonProps.containerColor}
          triggerContentColor={buttonProps.contentColor}
          size={size}
          openIcon={openIcon}
          closeIcon={closeIcon}
          expanded={effectiveExpanded}
          visible={triggerVisible}
          horizontalAlignment={horizontalAlignment}
          onPress={effectiveExpanded ? onDismiss : openOnPress}
          accessibilityLabel={buttonProps.accessibilityLabel}
          theme={theme}
          testID={buttonProps.testID}
        />
      </View>
    </View>
  );
};

FloatingActionButtonMenu.Item = FloatingActionButtonMenuItem;
FloatingActionButtonMenu.displayName = 'FloatingActionButtonMenu';

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
  menuItem: {
    overflow: 'hidden',
  },
  triggerSlot: {
    justifyContent: 'flex-start',
  },
  colorPlane: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
  },
  iconStackContainer: {
    flex: 1,
    pointerEvents: 'none',
  },
  iconStack: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
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

export default FloatingActionButtonMenu;

// @component-docs ignore-next-line
export { FloatingActionButtonMenu };
