import * as React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';

import Animated, {
  cubicBezier,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Content from './Content';
import { getFocusableElement } from './focus';
import Shell from './Shell';
import {
  MenuTokens,
  STATE_LAYER_OPACITY,
  Tokens,
  FOCUS_RING_INSET,
  FOCUS_RING_THICKNESS,
  webNoHoverTint,
  webNoOutline,
} from './tokens';
import type { Interaction, Size, Variant } from './tokens';
import { resolveColors } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { InternalTheme, ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Surface from '../Surface';
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
  'aria-label'?: string;
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
  /**
   * Accessibility label for the trigger FAB.
   */
  'aria-label'?: string;
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
   * Called when the menu should close: the user taps the close button, an
   * item, or outside the menu, presses Escape (web), the hardware back button
   * (Android) or performs the screen reader escape gesture (iOS).
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

// Room the items scroll view keeps around the items, so it doesn't clip the
// focus ring and the hover shadow. Taps in this margin don't reach the content
// below on Android, so keep it small.
const ITEMS_SCROLL_INSET = FOCUS_RING_INSET + 4;

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
  const { scale } = theme.animation;
  const { duration, easing } = theme.motion;

  // Bottom-up on open, top-down on close (matches Compose).
  const staggerIndex = expanded ? itemCount - 1 - index : index;

  // Reduced motion keeps the opacity fade but drops the horizontal scale and
  // the stagger.
  const transitionStyle: AnimatedStyle<ViewStyle> = {
    transitionProperty: ['opacity', 'transform'],
    transitionDuration: [
      duration.short2 * scale,
      reduceMotion ? 0 : duration.short4 * scale,
    ],
    transitionDelay: reduceMotion ? 0 : staggerIndex * STAGGER_MS * scale,
    transitionTimingFunction: cubicBezier(...easing.standard),
  };

  // Only scaleX and opacity animate. Layout height stays at the item's
  // natural size — the items container is absolutely positioned above the
  // trigger, so this fixed height never affects the trigger's position.
  const stateStyle: AnimatedStyle<ViewStyle> = {
    opacity: expanded ? 1 : 0,
    transform: [{ scaleX: expanded ? 1 : 0 }],
  };

  return (
    <Animated.View
      style={[
        { transformOrigin, marginBottom },
        stateStyle,
        transitionStyle,
        expanded ? styles.pointerEventsAuto : styles.pointerEventsNone,
      ]}
      importantForAccessibility={expanded ? 'yes' : 'no-hide-descendants'}
      aria-hidden={!expanded}
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
  /**
   * Whether the menu is open. Collapsed items are removed from the keyboard
   * tab order.
   */
  expanded: boolean;
  index: number;
  /**
   * Called with the item's index and its node when it mounts and unmounts.
   */
  registerRef: (
    index: number,
    node: React.ComponentRef<typeof View> | null
  ) => void;
  onPress: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label. Falls back to `label`.
   */
  'aria-label'?: string;
  testID?: string;
};

/**
 * A single FAB Menu item. Visually a tonal pill with an icon and a label,
 * but it is not a floating action button: no enter/exit scaling of its own
 * (the surrounding `AnimatedItem` handles entrance), and its shape and
 * dimensions come from the menu spec rather than FAB tokens. It follows the
 * FAB's state elevation and state layers.
 */
const MenuItem = ({
  icon,
  label,
  variant,
  theme,
  expanded,
  index,
  registerRef,
  onPress,
  'aria-label': ariaLabel,
  testID,
}: ItemProps) => {
  const colors = resolveColors({ theme, variant });
  const { height, iconSize, leading, trailing, iconLabelGap, shape } =
    MenuTokens.listItem;
  const borderRadius = resolveCornerRadius(theme, shape);

  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  // Items stay mounted while collapsed. Drop their interaction state with the
  // menu, otherwise a pointer left over an item shows its state layer again on
  // the next open.
  React.useEffect(() => {
    if (!expanded) {
      setHovered(false);
      setFocused(false);
      setPressed(false);
    }
  }, [expanded]);

  const interaction: Interaction = pressed
    ? 'pressed'
    : focused
      ? 'focus'
      : hovered
        ? 'hover'
        : 'enabled';
  const stateLayerStyle: AnimatedStyle<ViewStyle> = {
    backgroundColor: colors.content,
    opacity: STATE_LAYER_OPACITY[interaction],
    transitionProperty: 'opacity',
    transitionDuration: theme.motion.duration.short2 * theme.animation.scale,
  };

  const itemRef = React.useCallback(
    (node: React.ComponentRef<typeof View> | null) => registerRef(index, node),
    [registerRef, index]
  );

  return (
    <View style={styles.menuItemWrapper}>
      <Surface
        backgroundColor={colors.container}
        borderRadius={borderRadius}
        elevation={MenuTokens.listItem.elevation[interaction]}
        style={{ height }}
        theme={theme}
      >
        <View style={[styles.menuItem, { height, borderRadius }]}>
          <Animated.View style={[styles.stateLayer, stateLayerStyle]} />
          <TouchableRipple
            ref={itemRef}
            borderless
            onPress={onPress}
            onFocus={(e) => setFocused(isKeyboardFocusEvent(e))}
            onBlur={() => setFocused(false)}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            role={Platform.OS === 'web' ? 'menuitem' : 'button'}
            aria-label={ariaLabel ?? label}
            // `aria-hidden` and `pointerEvents` don't take collapsed items
            // out of the tab order.
            focusable={expanded}
            tabIndex={expanded ? 0 : -1}
            style={[
              { borderRadius },
              // The state layer replaces the hover tint of TouchableRipple.
              Platform.OS === 'web' ? [webNoOutline, webNoHoverTint] : null,
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
              labelTypescale={MenuTokens.listItem.labelTypescale}
            />
          </TouchableRipple>
        </View>
      </Surface>
      <View
        style={[
          styles.menuItemFocusRing,
          {
            borderColor: theme.colors.secondary,
            borderRadius: borderRadius + FOCUS_RING_INSET,
          },
          focused ? null : styles.invisible,
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
  /**
   * Accessibility label for the trigger button.
   */
  'aria-label'?: string;
  theme: InternalTheme;
  testID?: string;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
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
  'aria-label': ariaLabel,
  theme,
  testID,
  ref,
}: MorphingTriggerProps) => {
  const reduceMotion = useReduceMotion();
  const { scale } = theme.animation;

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

  // The morph itself (size, corner, icon position) is the spring above. The
  // color and icon cross-fades are effects, so they are CSS transitions.
  const fadeTransition: AnimatedStyle<ViewStyle> = {
    transitionProperty: 'opacity',
    transitionDuration: theme.motion.duration.short3 * scale,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };
  const openPlaneStyle: AnimatedStyle<ViewStyle> = {
    opacity: expanded ? 0 : 1,
  };
  const closePlaneStyle: AnimatedStyle<ViewStyle> = {
    opacity: expanded ? 1 : 0,
  };
  const openIconAnimStyle = useAnimatedStyle(() => {
    const offset = (widthShared.value - closedIconSize) / 2;
    return {
      transform: [{ translateX: offset }, { translateY: offset }],
    };
  });
  const closeIconAnimStyle = useAnimatedStyle(() => {
    const offset = (widthShared.value - openIconSize) / 2;
    return {
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
    >
      <Shell
        size={size}
        variant={triggerVariant}
        containerColor={triggerContainerColor}
        contentColor={triggerContentColor}
        visible={visible}
        onPress={onPress}
        aria-label={ariaLabel}
        aria-expanded={expanded}
        aria-haspopup="menu"
        testID={testID}
        buttonRef={ref}
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
                fadeTransition,
              ]}
            />
            <Animated.View
              style={[
                styles.colorPlane,
                { backgroundColor: closeColors.container },
                closePlaneStyle,
                fadeTransition,
              ]}
            />
          </>
        }
        theme={theme}
      >
        <View style={styles.iconOrigin}>
          <Animated.View style={[styles.iconAbsolute, openIconAnimStyle]}>
            <Animated.View style={[openPlaneStyle, fadeTransition]}>
              <Icon
                source={openIcon}
                size={closedIconSize}
                color={triggerColors.content}
              />
            </Animated.View>
          </Animated.View>
          <Animated.View style={[styles.iconAbsolute, closeIconAnimStyle]}>
            <Animated.View style={[closePlaneStyle, fadeTransition]}>
              <Icon
                source={closeIcon}
                size={openIconSize}
                color={closeColors.content}
              />
            </Animated.View>
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
 * There is no visual scrim. Pressing outside the menu, the close button or an
 * item, pressing Escape (web), the hardware back button (Android) or the
 * screen reader escape gesture (iOS) calls `onDismiss`. Focus moves to the
 * first item when the menu opens and returns to the trigger when it closes.
 * On web, the arrow keys, Home and End move focus between the items and the
 * close button.
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
  testID,
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

  const triggerRef = React.useRef<React.ComponentRef<typeof View>>(null);
  const scrollRef = React.useRef<React.ComponentRef<typeof ScrollView>>(null);
  const itemRefs = React.useRef<(React.ComponentRef<typeof View> | null)[]>([]);

  const [containerHeight, setContainerHeight] = React.useState<number>();

  const registerItemRef = React.useCallback(
    (index: number, node: React.ComponentRef<typeof View> | null) => {
      itemRefs.current[index] = node;
    },
    []
  );

  const handleItemPress =
    (item: MenuItemProps) => (e: GestureResponderEvent) => {
      item.onPress(e);
      onDismiss();
    };

  // A long list scrolls, so start from the first item every time it opens.
  React.useEffect(() => {
    if (effectiveExpanded) {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [effectiveExpanded]);

  // Arrow keys, Home and End move focus between the items and the close
  // button. Opening, closing and dismissing the menu are left to the overlay
  // handling.
  React.useEffect(() => {
    if (Platform.OS !== 'web' || !effectiveExpanded) {
      return undefined;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      // Something else, such as a dialog on top, already handled the key.
      if (e.defaultPrevented) {
        return;
      }

      if (
        !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      // Items are in visual order, top to bottom, followed by the close
      // button.
      const stops = [...itemRefs.current, triggerRef.current].flatMap(
        (node) => getFocusableElement(node) ?? []
      );
      const current = stops.findIndex((el) => el === document.activeElement);

      if (current === -1) {
        return;
      }

      e.preventDefault();

      const last = stops.length - 1;
      const next =
        e.key === 'Home'
          ? 0
          : e.key === 'End'
            ? last
            : e.key === 'ArrowDown'
              ? (current + 1) % stops.length
              : (current - 1 + stops.length) % stops.length;

      stops[next].focus();
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [effectiveExpanded]);

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

  const paddingBottom = insets.bottom + 16;
  // Space left above the trigger. The scroll inset is added back because the
  // scroll view reserves room for the shadow and focus ring of every item.
  const itemsMaxHeight =
    containerHeight === undefined
      ? undefined
      : Math.max(
          0,
          containerHeight -
            insets.top -
            paddingBottom -
            triggerSlotSize -
            MenuTokens.spacing.closeToLastItem
        ) +
        ITEMS_SCROLL_INSET * 2;

  // Only the items take touches, so taps next to them in the scroll view's
  // margin reach the content below. When collapsed, nothing does. Android
  // doesn't scroll with `box-none`.
  const itemsPointerEvents = !effectiveExpanded
    ? styles.pointerEventsNone
    : Platform.OS === 'android'
      ? null
      : styles.pointerEventsBoxNone;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom,
          paddingLeft: insets.left + 16,
          paddingRight: insets.right + 16,
        },
      ]}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
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
          // A menu without items would be announced as an empty one.
          role={Platform.OS === 'web' && effectiveExpanded ? 'menu' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
            style={[
              styles.itemsScroll,
              { maxHeight: itemsMaxHeight },
              itemsPointerEvents,
            ]}
            contentContainerStyle={[
              styles.itemsScrollContent,
              { alignItems: flexAlign },
              itemsPointerEvents,
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
                    index={index}
                    registerRef={registerItemRef}
                    icon={item.icon}
                    label={item.label}
                    variant={itemsVariant}
                    theme={theme}
                    expanded={effectiveExpanded}
                    aria-label={item['aria-label'] ?? item.label}
                    onPress={handleItemPress(item)}
                    testID={item.testID}
                  />
                </AnimatedItem>
              );
            })}
          </ScrollView>
        </View>
        <MorphingTrigger
          ref={triggerRef}
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
          aria-label={trigger['aria-label']}
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
  itemsScroll: {
    flexGrow: 0,
    // Cancels the padding below, so the scroll view doesn't clip the shadow
    // and focus ring of the items and the items keep their position.
    margin: -ITEMS_SCROLL_INSET,
  },
  itemsScrollContent: {
    padding: ITEMS_SCROLL_INSET,
  },
  menuItemWrapper: {
    position: 'relative',
  },
  stateLayer: {
    ...StyleSheet.absoluteFill,
    pointerEvents: 'none',
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
  invisible: {
    opacity: 0,
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
