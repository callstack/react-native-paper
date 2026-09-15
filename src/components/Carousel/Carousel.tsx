import * as React from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import Animated, {
  cancelAnimation,
  ReduceMotion,
  runOnJS,
  runOnUI,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import CarouselItemShell from './CarouselItemShell';
import { createStrategy } from './strategy';
import type {
  CarouselAlignment,
  CarouselLayout,
  CarouselRenderItemInfo,
  CarouselSnap,
} from './types';
import {
  getDefaultCarouselColors,
  getSnapScrollProps,
  resolveSettleOffset,
  visibleSlotCount,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../theme/types';

/** Items kept mounted either side of the on-screen ones. */
const OVERSCAN = 2;

export type CarouselHandle = {
  /** Scrolls until `index` sits on the first focal keyline. */
  scrollToIndex: (index: number, animated?: boolean) => void;
};

export type Props<ItemT> = {
  /**
   * Items to render.
   */
  data: readonly ItemT[];
  /**
   * Renders one item. Receives the item's live mask, which the content is
   * expected to react to — see `CarouselItem` for the default behaviour.
   */
  renderItem: (info: CarouselRenderItemInfo<ItemT>) => React.ReactNode;
  /**
   * Height of the carousel. Every item is laid out at this height.
   */
  height: number;
  /**
   * Arrangement of the items. Defaults to `multi-browse`.
   *
   * Reach for `uncontained` when item aspect ratios have to be preserved: it
   * hands items the width you asked for and does not snap.
   */
  layout?: CarouselLayout;
  /**
   * Where a `hero` layout puts its large item. `center` falls back to `start`
   * below three items. Ignored by the other layouts.
   */
  alignment?: CarouselAlignment;
  /**
   * Overrides the layout's fling behaviour.
   */
  snap?: CarouselSnap;
  /**
   * Width to lay large items out at, for `multi-browse` and `uncontained`.
   * Defaults to a square item. `hero` derives its own width from the container
   * and `full-screen` always fills it.
   */
  itemWidth?: number;
  /**
   * Gap between items.
   */
  itemSpacing?: number;
  /**
   * Draws each item with a one-pixel outline.
   */
  outlined?: boolean;
  /**
   * Disables scrolling and renders the disabled visual state.
   */
  disabled?: boolean;
  /**
   * Item to rest on when the carousel is first laid out.
   */
  initialIndex?: number;
  /**
   * Called with the focal item's index once scrolling settles.
   */
  onIndexChange?: (index: number) => void;
  /**
   * Called when an item is pressed. Items are only hoverable, focusable and
   * pressable when this is set.
   */
  onItemPress?: (item: ItemT, index: number) => void;
  keyExtractor?: (item: ItemT, index: number) => string;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  ref?: React.Ref<CarouselHandle>;
  /**
   * Accessibility label for the carousel.
   */
  'aria-label'?: string;
};

/**
 * Carousels show a scrolling strip of items — images, most often — that grow
 * and shrink as they pass through the container.
 *
 * Items are never resized. Every item is measured at the large size for the
 * whole of its life; the size change you see is an interpolated mask rectangle
 * plus a translation, with items stacked in descending order so a collapsing
 * item passes under the one before it.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Image } from 'react-native';
 * import { Carousel, CarouselItem } from 'react-native-paper';
 *
 * const photos = [{ id: '1', uri: '…' }, { id: '2', uri: '…' }];
 *
 * const MyComponent = () => (
 *   <Carousel
 *     data={photos}
 *     height={200}
 *     itemWidth={220}
 *     keyExtractor={(photo) => photo.id}
 *     renderItem={({ item, mask }) => (
 *       <CarouselItem mask={mask}>
 *         <Image source={{ uri: item.uri }} style={{ flex: 1 }} />
 *       </CarouselItem>
 *     )}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * ## Theming
 * Customize by overriding these `theme.colors` roles:
 * - `surfaceContainerHigh`: item container, behind the content
 * - `outlineVariant`: the `outlined` item border
 * - `onSurface`: hover, focus and press state layers
 * - `secondary`: focus indicator
 *
 * The item corner radius comes from `theme.shapes.corner.extraLarge`.
 *
 * Note: layout is left-to-right. Right-to-left locales are not handled yet.
 */
const Carousel = <ItemT,>({
  data,
  renderItem,
  height,
  layout = 'multi-browse',
  alignment = 'start',
  snap,
  itemWidth,
  itemSpacing = 0,
  outlined = false,
  disabled = false,
  initialIndex = 0,
  onIndexChange,
  onItemPress,
  keyExtractor,
  style,
  contentContainerStyle,
  testID,
  theme: themeOverrides,
  ref,
  'aria-label': ariaLabel,
}: Props<ItemT>) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollX = useSharedValue(0);

  // Settle state. `settle` is the spring's output, written into the scroll view
  // on the UI thread while `settling` is set; a new touch clears both, which is
  // what makes the settle interruptible.
  const settle = useSharedValue(0);
  const settling = useSharedValue(false);
  const dragStart = useSharedValue(0);
  // Velocity is tracked here rather than read from the drag-end event: the
  // event's units and sign differ between platforms, whereas successive offsets
  // do not.
  const velocity = useSharedValue(0);
  const lastOffset = useSharedValue(0);
  const lastTimestamp = useSharedValue(0);

  const [containerWidth, setContainerWidth] = React.useState(0);
  const [windowStart, setWindowStart] = React.useState(initialIndex);

  const itemCount = data.length;
  const strategy = React.useMemo(
    () =>
      createStrategy({
        layout,
        alignment,
        containerSize: containerWidth,
        containerHeight: height,
        preferredItemSize: itemWidth ?? height,
        itemCount,
        snap,
      }),
    [layout, alignment, containerWidth, height, itemWidth, itemCount, snap]
  );

  const colors = React.useMemo(() => getDefaultCarouselColors(theme), [theme]);

  const itemSize = strategy?.itemSize ?? 0;

  const lastReportedIndex = React.useRef(initialIndex);
  const reportIndex = React.useCallback(
    (index: number) => {
      if (!onIndexChange) return;
      const clamped = Math.min(Math.max(index, 0), Math.max(itemCount - 1, 0));
      if (clamped === lastReportedIndex.current) return;
      lastReportedIndex.current = clamped;
      onIndexChange(clamped);
    },
    [onIndexChange, itemCount]
  );

  // The settle is scroll-driven and interruptible, so it belongs in the
  // imperative tier: a shared value sprung on the M3 spatial spring rather than
  // the scroll view's own deceleration curve.
  const springConfig = React.useMemo(
    () => ({
      ...toRawSpring(theme.motion.spring.default.spatial),
      reduceMotion: reduceMotion ? ReduceMotion.Always : ReduceMotion.Never,
    }),
    [theme.motion.spring.default.spatial, reduceMotion]
  );

  const springTo = React.useCallback(
    (target: number) => {
      'worklet';
      settling.value = true;
      settle.value = scrollX.value;
      settle.value = withSpring(target, springConfig, (finished) => {
        if (finished) {
          settling.value = false;
          if (itemSize > 0) {
            runOnJS(reportIndex)(Math.round(target / itemSize));
          }
        }
      });
    },
    [springConfig, itemSize, reportIndex, settle, settling, scrollX]
  );

  // Drive the scroll view from the spring while it runs.
  useAnimatedReaction(
    () => (settling.value ? settle.value : null),
    (offset) => {
      if (offset !== null) {
        scrollTo(scrollRef, offset, 0, false);
      }
    }
  );

  const scrollHandler = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        const offset = event.contentOffset.x;
        const now = performance.now();
        const elapsed = now - lastTimestamp.value;
        // Ignore stale gaps; a resumed scroll would otherwise read as a fling.
        if (elapsed > 0 && elapsed < 100) {
          const sample = ((offset - lastOffset.value) / elapsed) * 1000;
          velocity.value = velocity.value * 0.7 + sample * 0.3;
        }
        lastOffset.value = offset;
        lastTimestamp.value = now;
        scrollX.value = offset;
      },
      onBeginDrag: (event) => {
        // A new touch wins over an in-flight settle.
        cancelAnimation(settle);
        settling.value = false;
        velocity.value = 0;
        dragStart.value = event.contentOffset.x;
      },
      onEndDrag: (event) => {
        if (!strategy) return;
        const target = resolveSettleOffset(
          strategy,
          event.contentOffset.x,
          dragStart.value,
          velocity.value
        );
        if (target !== null) {
          springTo(target);
        }
      },
    },
    [strategy, springTo]
  );

  // Only an uncontained carousel still decelerates natively; everywhere else
  // the settle spring reports the index from its own completion.
  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (itemSize > 0) {
      reportIndex(Math.round(event.nativeEvent.contentOffset.x / itemSize));
    }
  };

  useAnimatedReaction(
    () => (itemSize > 0 ? Math.floor(scrollX.value / itemSize) : 0),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setWindowStart)(current);
      }
    },
    [itemSize]
  );

  const scrollToIndex = React.useCallback(
    (index: number, animated = true) => {
      if (!strategy) return;
      const clamped = Math.min(Math.max(index, 0), Math.max(itemCount - 1, 0));
      const target = Math.min(clamped * strategy.itemSize, strategy.maxScroll);
      if (animated) {
        // Programmatic moves settle on the same spring as a fling.
        runOnUI(springTo)(target);
      } else {
        scrollRef.current?.scrollTo({ x: target, animated: false });
        reportIndex(clamped);
      }
    },
    [strategy, itemCount, springTo, scrollRef, reportIndex]
  );

  React.useImperativeHandle(ref, () => ({ scrollToIndex }), [scrollToIndex]);

  // Jump to the requested item as soon as the container has been measured.
  const appliedInitialIndex = React.useRef(false);
  React.useEffect(() => {
    if (!strategy || appliedInitialIndex.current || initialIndex <= 0) return;
    appliedInitialIndex.current = true;
    scrollToIndex(initialIndex, false);
  }, [strategy, initialIndex, scrollToIndex]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const snapProps = React.useMemo(
    () => (strategy ? getSnapScrollProps(strategy) : {}),
    [strategy]
  );

  const visible = React.useMemo(() => {
    if (!strategy) return { from: 0, to: 0 };
    const slots = visibleSlotCount(strategy);
    return {
      from: Math.max(windowStart - OVERSCAN, 0),
      to: Math.min(windowStart + slots + OVERSCAN, itemCount),
    };
  }, [strategy, windowStart, itemCount]);

  return (
    <View
      style={[styles.container, { height }, style]}
      onLayout={handleLayout}
      testID={testID}
    >
      {strategy ? (
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!disabled}
          onScroll={scrollHandler}
          onMomentumScrollEnd={handleMomentumEnd}
          scrollEventThrottle={16}
          aria-label={ariaLabel}
          testID={testID ? `${testID}-scroll-view` : undefined}
          contentContainerStyle={[
            { width: strategy.contentSize, height },
            contentContainerStyle,
          ]}
          {...snapProps}
        >
          {data.slice(visible.from, visible.to).map((item, offset) => {
            const index = visible.from + offset;
            return (
              <CarouselItemShell
                key={keyExtractor?.(item, index) ?? String(index)}
                item={item}
                index={index}
                itemCount={itemCount}
                renderItem={renderItem}
                strategy={strategy}
                scrollX={scrollX}
                height={height}
                spacing={itemSpacing}
                colors={colors}
                outlined={outlined}
                disabled={disabled}
                onPress={onItemPress}
                theme={theme}
                testID={testID ? `${testID}-item-${index}` : undefined}
              />
            );
          })}
        </Animated.ScrollView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Carousel;
