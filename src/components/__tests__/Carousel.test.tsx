import { Text, View } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen, userEvent } from '../../test-utils';
import Carousel from '../Carousel/Carousel';
import { CarouselItem, CarouselItemContent } from '../Carousel/CarouselItem';
import { createStrategy, type CarouselStrategy } from '../Carousel/strategy';
import { CarouselGeometry, CarouselTokens } from '../Carousel/tokens';
import type {
  CarouselItemMask,
  CarouselLayout,
  CarouselRenderItemInfo,
} from '../Carousel/types';
import {
  getSnapScrollProps,
  resolveItemPlacement,
  resolveSettleOffset,
} from '../Carousel/utils';

const CONTAINER = 360;
const HEIGHT = 200;

const strategyFor = (
  layout: CarouselLayout,
  overrides: Partial<Parameters<typeof createStrategy>[0]> = {}
): CarouselStrategy => {
  const strategy = createStrategy({
    layout,
    alignment: 'start',
    containerSize: CONTAINER,
    containerHeight: HEIGHT,
    preferredItemSize: 220,
    itemCount: 10,
    ...overrides,
  });
  if (!strategy) {
    throw new Error(`no strategy for ${layout}`);
  }
  return strategy;
};

const inContainerSizes = (strategy: CarouselStrategy) =>
  // Drop the gone and anchor keylines at either end.
  strategy.defaultState.sizes.slice(2, -2);

describe('createStrategy', () => {
  it('returns null until the container has been measured', () => {
    const options = {
      layout: 'multi-browse' as const,
      alignment: 'start' as const,
      containerHeight: HEIGHT,
      preferredItemSize: 220,
    };
    expect(
      createStrategy({ ...options, containerSize: 0, itemCount: 10 })
    ).toBeNull();
    expect(
      createStrategy({ ...options, containerSize: CONTAINER, itemCount: 0 })
    ).toBeNull();
  });

  it.each<CarouselLayout>([
    'multi-browse',
    'hero',
    'uncontained',
    'full-screen',
  ])('fills the container exactly for %s', (layout) => {
    const sizes = inContainerSizes(strategyFor(layout));
    const total = sizes.reduce((sum, size) => sum + size, 0);
    expect(total).toBeCloseTo(CONTAINER, 5);
  });

  it('keeps small items inside the 40–56dp band', () => {
    const strategy = strategyFor('multi-browse');
    const sizes = inContainerSizes(strategy);
    const smallest = sizes[sizes.length - 1];
    expect(smallest).toBeGreaterThanOrEqual(CarouselGeometry.smallSizeMin);
    expect(smallest).toBeLessThanOrEqual(CarouselGeometry.smallSizeMax);
  });

  it('sizes the multi-browse medium item as the mean of large and small', () => {
    const sizes = inContainerSizes(strategyFor('multi-browse'));
    const [large, medium, small] = sizes;
    expect(sizes).toHaveLength(3);
    expect(medium).toBeCloseTo((large + small) / 2, 5);
  });

  it('lands multi-browse large items near the requested size', () => {
    const strategy = strategyFor('multi-browse', { preferredItemSize: 220 });
    expect(strategy.itemSize).toBeGreaterThan(180);
    expect(strategy.itemSize).toBeLessThan(260);
  });

  it('gives hero a single focal item with a peek beside it', () => {
    const strategy = strategyFor('hero');
    expect(strategy.focalCount).toBe(1);
    expect(inContainerSizes(strategy)).toHaveLength(2);
  });

  it('keeps a hero large item within twice its own height', () => {
    const strategy = strategyFor('hero');
    expect(strategy.itemSize).toBeLessThanOrEqual(
      CarouselGeometry.heroLargeMaxAspectRatio * HEIGHT
    );
  });

  it('centre-aligns hero with a peek on either side', () => {
    const sizes = inContainerSizes(
      strategyFor('hero', { alignment: 'center', itemCount: 5 })
    );
    expect(sizes).toHaveLength(3);
    expect(sizes[0]).toBeCloseTo(sizes[2], 5);
    expect(sizes[1]).toBeGreaterThan(sizes[0]);
  });

  it('falls back to start-aligned hero below three items', () => {
    const sizes = inContainerSizes(
      strategyFor('hero', { alignment: 'center', itemCount: 2 })
    );
    expect(sizes).toHaveLength(2);
    expect(sizes[0]).toBeGreaterThan(sizes[1]);
  });

  it('hands uncontained items the width they asked for', () => {
    const strategy = strategyFor('uncontained', { preferredItemSize: 160 });
    expect(strategy.itemSize).toBeCloseTo(160, 5);
  });

  it('caps an uncontained cut-off item below the medium threshold', () => {
    // A 190dp item in a 360dp container leaves a 170dp strip — 89% of a full
    // item, close enough that it would stop reading as a peek.
    const strategy = strategyFor('uncontained', { preferredItemSize: 190 });
    const sizes = inContainerSizes(strategy);
    expect(sizes).toHaveLength(2);
    expect(sizes[1] / sizes[0]).toBeLessThanOrEqual(
      CarouselGeometry.uncontainedMediumThreshold + 1e-6
    );
  });

  it('gives full-screen one item filling the container', () => {
    const strategy = strategyFor('full-screen');
    expect(strategy.itemSize).toBe(CONTAINER);
    expect(strategy.focalCount).toBe(1);
  });

  it('picks a distinct fling behaviour per layout', () => {
    expect(strategyFor('multi-browse').snap).toBe('multi');
    expect(strategyFor('hero').snap).toBe('single');
    expect(strategyFor('full-screen').snap).toBe('single');
    expect(strategyFor('uncontained').snap).toBe('none');
  });

  it('honours an explicit snap override', () => {
    expect(strategyFor('uncontained', { snap: 'single' }).snap).toBe('single');
  });

  it('leaves room for the focal items at the end of the scroll', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 10 });
    expect(strategy.maxScroll).toBeCloseTo(
      (10 - strategy.focalCount) * strategy.itemSize,
      5
    );
    expect(strategy.contentSize).toBeCloseTo(strategy.maxScroll + CONTAINER, 5);
  });

  it('does not scroll when every item is already focal', () => {
    expect(strategyFor('full-screen', { itemCount: 1 }).maxScroll).toBe(0);
  });
});

describe('resolveItemPlacement', () => {
  it('puts the first item on the focal keyline at rest', () => {
    const strategy = strategyFor('multi-browse');
    const placement = resolveItemPlacement(strategy, 0, 0);
    expect(placement.size).toBeCloseTo(strategy.itemSize, 5);
    expect(placement.center).toBeCloseTo(strategy.itemSize / 2, 5);
  });

  it('puts the last item on the focal keyline at the end of the scroll', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 10 });
    const placement = resolveItemPlacement(strategy, strategy.maxScroll, 9);
    expect(placement.size).toBeCloseTo(strategy.itemSize, 5);
  });

  it('snaps on whole items, so every snap target is a focal keyline', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 10 });
    for (let index = 0; index < 8; index++) {
      const placement = resolveItemPlacement(
        strategy,
        index * strategy.itemSize,
        index
      );
      expect(placement.size).toBeCloseTo(strategy.itemSize, 5);
    }
  });

  it('shrinks an item monotonically as it leaves the focal range', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 10 });
    const sizes = [0, 0.25, 0.5, 0.75, 1].map(
      (step) =>
        resolveItemPlacement(strategy, (3 + step) * strategy.itemSize, 3).size
    );
    for (let i = 1; i < sizes.length; i++) {
      expect(sizes[i]).toBeLessThanOrEqual(sizes[i - 1] + 1e-6);
    }
    expect(sizes[sizes.length - 1]).toBeLessThan(sizes[0]);
  });

  it('collapses an off-screen item to the gone keyline', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 20 });
    const placement = resolveItemPlacement(strategy, 10 * strategy.itemSize, 0);
    expect(placement.size).toBeCloseTo(CarouselGeometry.goneSize, 5);
  });

  it('stays continuous across the start and end shift boundaries', () => {
    const strategy = strategyFor('hero', {
      alignment: 'center',
      itemCount: 10,
    });
    const epsilon = 0.001;
    for (const boundary of [
      strategy.startShift,
      strategy.maxScroll - strategy.endShift,
    ]) {
      for (let index = 0; index < 4; index++) {
        const before = resolveItemPlacement(
          strategy,
          boundary - epsilon,
          index
        );
        const after = resolveItemPlacement(strategy, boundary + epsilon, index);
        expect(after.size).toBeCloseTo(before.size, 2);
        expect(after.center).toBeCloseTo(before.center, 2);
      }
    }
  });

  it('never resizes the item box, only the mask', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 10 });
    const sizes = new Set<number>();
    for (let scroll = 0; scroll < strategy.maxScroll; scroll += 17) {
      sizes.add(resolveItemPlacement(strategy, scroll, 4).size);
    }
    // The mask varies while the box the item is laid out at does not.
    expect(sizes.size).toBeGreaterThan(1);
    expect(strategy.itemSize).toBeCloseTo(inContainerSizes(strategy)[0], 5);
  });
});

describe('Carousel', () => {
  const data = ['a', 'b', 'c', 'd', 'e', 'f'];

  const layout = (width: number) => ({
    nativeEvent: { layout: { width, height: HEIGHT, x: 0, y: 0 } },
  });

  const renderCarousel = async (props = {}) => {
    await render(
      <Carousel
        testID="carousel"
        data={data}
        height={HEIGHT}
        itemWidth={220}
        renderItem={({ item, mask }) => (
          <CarouselItem mask={mask}>
            <CarouselItemContent mask={mask}>
              <Text>{item}</Text>
            </CarouselItemContent>
          </CarouselItem>
        )}
        {...props}
      />
    );
  };

  const measure = async (width = CONTAINER) => {
    await fireEvent(screen.getByTestId('carousel'), 'layout', layout(width));
  };

  it('renders no items until it has been measured', async () => {
    await renderCarousel();
    // The scroll view is always present; the arrangement needs a width first.
    expect(screen.getByTestId('carousel')).toBeTruthy();
    expect(screen.queryByText('a')).toBeNull();
  });

  it('renders items once measured', async () => {
    await renderCarousel();
    await measure();
    expect(screen.getByTestId('carousel')).toBeTruthy();
    expect(screen.getByText('a')).toBeTruthy();
  });

  it('hands renderItem a live mask rectangle', async () => {
    let captured: CarouselItemMask | undefined;
    await render(
      <Carousel
        testID="carousel"
        data={data}
        height={HEIGHT}
        itemWidth={220}
        renderItem={({ item, mask }: CarouselRenderItemInfo<string>) => {
          captured ??= mask;
          return <View testID={`item-${item}`} />;
        }}
      />
    );
    await measure();

    expect(captured?.height).toBe(HEIGHT);
    expect(captured?.width).toBeGreaterThan(0);
    expect(captured?.rect.value).toEqual(
      expect.objectContaining({ top: 0, bottom: HEIGHT })
    );
    // At rest the first item is focal, so its mask covers the whole item.
    expect(captured?.rect.value.left).toBeCloseTo(0, 5);
    expect(captured?.expansion.value).toBeCloseTo(1, 5);
  });

  it('does not make items interactive without onItemPress', async () => {
    await renderCarousel();
    await measure();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('calls onItemPress when an item is pressed', async () => {
    const onItemPress = jest.fn();
    await renderCarousel({ onItemPress });
    await measure();

    const user = userEvent.setup();
    const items = screen.getAllByRole('button');
    expect(items.length).toBeGreaterThan(0);
    await user.press(items[0]);
    expect(onItemPress).toHaveBeenCalledWith('a', 0);
  });

  it('does not respond to presses when disabled', async () => {
    const onItemPress = jest.fn();
    await renderCarousel({ onItemPress, disabled: true });
    await measure();
    expect(screen.queryByRole('button')).toBeNull();
    expect(onItemPress).not.toHaveBeenCalled();
  });

  it('only mounts the items that can be on screen', async () => {
    await renderCarousel({
      data: Array.from({ length: 50 }, (_, i) => `${i}`),
    });
    await measure();
    expect(screen.getByText('0')).toBeTruthy();
    expect(screen.queryByText('49')).toBeNull();
  });

  it('reports the focal index once scrolling settles', async () => {
    const onIndexChange = jest.fn();
    await renderCarousel({ onIndexChange });
    await measure();

    const { itemSize } = strategyFor('multi-browse', {
      itemCount: data.length,
    });
    await fireEvent(screen.getByTestId('carousel'), 'momentumScrollEnd', {
      nativeEvent: { contentOffset: { x: itemSize * 2, y: 0 } },
    });
    expect(onIndexChange).toHaveBeenCalledWith(2);
  });
});

describe('getSnapScrollProps', () => {
  it('switches native deceleration off wherever the carousel snaps', () => {
    for (const layout of ['hero', 'full-screen', 'multi-browse'] as const) {
      expect(getSnapScrollProps(strategyFor(layout)).decelerationRate).toBe(0);
    }
  });

  it('leaves native momentum alone for uncontained', () => {
    expect(
      getSnapScrollProps(strategyFor('uncontained')).decelerationRate
    ).toBe('normal');
  });
});

describe('resolveSettleOffset', () => {
  const at = (strategy: CarouselStrategy, index: number) =>
    index * strategy.itemSize;

  it('does not settle an uncontained carousel at all', () => {
    const strategy = strategyFor('uncontained');
    expect(
      resolveSettleOffset(strategy, at(strategy, 2) + 30, at(strategy, 2), 2000)
    ).toBeNull();
  });

  it('carries a multi-browse fling across several items', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 20 });
    // Half a second of travel at four items per second is two items.
    const target = resolveSettleOffset(strategy, 0, 0, strategy.itemSize * 4);
    expect(target).toBeCloseTo(at(strategy, 2), 5);
  });

  it('advances multi-browse backwards on a reverse fling', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 20 });
    const from = at(strategy, 6);
    const target = resolveSettleOffset(
      strategy,
      from,
      from,
      -strategy.itemSize * 4
    );
    expect(target).toBeCloseTo(at(strategy, 4), 5);
  });

  it('advances hero by exactly one item however hard it is flung', () => {
    const strategy = strategyFor('hero', { itemCount: 20 });
    const from = at(strategy, 3);
    for (const velocity of [strategy.itemSize, strategy.itemSize * 50]) {
      expect(resolveSettleOffset(strategy, from, from, velocity)).toBeCloseTo(
        at(strategy, 4),
        5
      );
    }
    expect(
      resolveSettleOffset(strategy, from, from, -strategy.itemSize * 50)
    ).toBeCloseTo(at(strategy, 2), 5);
  });

  it('returns a held hero item to where the drag started', () => {
    const strategy = strategyFor('hero', { itemCount: 20 });
    const from = at(strategy, 3);
    const target = resolveSettleOffset(strategy, from + 4, from, 0);
    expect(target).toBeCloseTo(from, 5);
  });

  it('settles on focal keyline offsets, never between them', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 20 });
    for (let velocity = -4000; velocity <= 4000; velocity += 250) {
      const target = resolveSettleOffset(
        strategy,
        at(strategy, 5),
        at(strategy, 5),
        velocity
      );
      if (target === null) {
        throw new Error('a snapping carousel must settle somewhere');
      }
      const index = target / strategy.itemSize;
      expect(Math.abs(index - Math.round(index))).toBeLessThan(1e-9);
    }
  });

  it('never settles past either end of the list', () => {
    const strategy = strategyFor('multi-browse', { itemCount: 8 });
    expect(resolveSettleOffset(strategy, 0, 0, -50000)).toBe(0);
    expect(resolveSettleOffset(strategy, strategy.maxScroll, 0, 50000)).toBe(
      strategy.maxScroll
    );
  });
});

describe('CarouselTokens', () => {
  it('takes its corner radius from the shape scale', () => {
    expect(CarouselTokens.containerShape).toBe('extraLarge');
  });

  it('is the only non-zero elevation in the set', () => {
    expect(CarouselTokens.hoverContainerElevation).toBe(1);
    expect(CarouselTokens.containerElevation).toBe(0);
    expect(CarouselTokens.focusContainerElevation).toBe(0);
    expect(CarouselTokens.pressedContainerElevation).toBe(0);
  });

  it('disables at the spec opacity', () => {
    expect(CarouselTokens.disabledContainerOpacity).toBe(0.38);
  });

  it('declares no token the component does not consume', () => {
    const source = [
      readFileSync(
        join(__dirname, '../Carousel/CarouselItemShell.tsx'),
        'utf8'
      ),
      readFileSync(join(__dirname, '../Carousel/utils.ts'), 'utf8'),
    ].join('\n');

    for (const name of Object.keys(CarouselTokens)) {
      expect(source).toContain(name);
    }
  });
});
