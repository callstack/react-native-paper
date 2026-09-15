import * as React from 'react';
import {
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useSharedValue,
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
  visibleSlotCount,
} from './utils';
import { useInternalTheme } from '../../core/theming';
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
  const scrollRef = React.useRef<ScrollView>(null);
  const scrollX = useSharedValue(0);

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

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const itemSize = strategy?.itemSize ?? 0;

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
      scrollRef.current?.scrollTo({
        x: Math.min(clamped * strategy.itemSize, strategy.maxScroll),
        animated,
      });
    },
    [strategy, itemCount]
  );

  React.useImperativeHandle(ref, () => ({ scrollToIndex }), [scrollToIndex]);

  // Jump to the requested item as soon as the container has been measured.
  const appliedInitialIndex = React.useRef(false);
  React.useEffect(() => {
    if (!strategy || appliedInitialIndex.current || initialIndex <= 0) return;
    appliedInitialIndex.current = true;
    scrollToIndex(initialIndex, false);
  }, [strategy, initialIndex, scrollToIndex]);

  const lastReportedIndex = React.useRef(initialIndex);
  const handleScrollSettled = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (!strategy || !onIndexChange) return;
    const index = Math.min(
      Math.max(
        Math.round(event.nativeEvent.contentOffset.x / strategy.itemSize),
        0
      ),
      Math.max(itemCount - 1, 0)
    );
    if (index !== lastReportedIndex.current) {
      lastReportedIndex.current = index;
      onIndexChange(index);
    }
  };

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
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollSettled}
          onScrollEndDrag={handleScrollSettled}
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
