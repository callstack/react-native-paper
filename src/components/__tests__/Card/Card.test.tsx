import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react-native';
import { cubicBezier, getAnimatedStyle } from 'react-native-reanimated';

import { fireEvent, render, screen, userEvent } from '../../../test-utils';
import { ReduceMotionContext } from '../../../theme/accessibility/ReduceMotionContext';
import { DarkTheme, LightTheme } from '../../../theme/schemes';
import { androidElevationLevels } from '../../../theme/tokens/sys/elevation';
import Button from '../../Button/Button';
import Card from '../../Card/Card';
import type { Props as CardProps } from '../../Card/Card';
import { resolveCardVisuals } from '../../Card/tokens';
import type { CardVariant, CardStateFlags } from '../../Card/tokens';

const styles = StyleSheet.create({
  contentStyle: {
    flexDirection: 'column-reverse',
  },
  customAction: {
    marginRight: 12,
  },
});

const getVariantCard = (
  variant: 'filled' | 'elevated' | 'outlined',
  props: Pick<CardProps, 'disabled' | 'dragged' | 'onPress' | 'theme'> = {}
) => {
  if (variant === 'elevated') {
    return <Card testID="card" {...props} variant="elevated" />;
  }
  if (variant === 'outlined') {
    return <Card testID="card" {...props} variant="outlined" />;
  }
  return <Card testID="card" {...props} variant="filled" />;
};

type Layer = NonNullable<ReturnType<typeof screen.getByTestId>['parent']>;

// The Card's visual layers are internal nodes with no public testID, so they
// are reached from the node that has one. For an actionable Card that is the
// interaction node; for a neutral Card it is the slot content. Either way the
// layers are the children of the clipped visual node, in paint order:
// container, slot content, state layer, then the outline of an outlined Card.
// The Surface that carries the elevation and the focus ring is its parent.
const getCardLayers = ({ neutral = false } = {}) => {
  const target = screen.getByTestId('card');
  const visual = neutral ? target.parent : target;

  if (!visual?.parent) {
    throw new Error('Card visual node not found');
  }

  const [container, content, stateLayer, outline] = visual.children.filter(
    (child): child is Layer => typeof child !== 'string'
  );

  return {
    surface: visual.parent,
    visual,
    container,
    content,
    stateLayer,
    outline,
  };
};

// A focus event the Card's own interaction node receives. On web,
// `focusVisible` is what `:focus-visible` matches.
const selfFocus = (focusVisible: boolean) => {
  const node = { matches: () => focusVisible };
  return { target: node, currentTarget: node };
};

// Asserts that every layer shows the Material visuals of one state. The
// values come from the token matrix, which `Card.tokens.test.ts` checks
// against the specification.
const expectCardState = (
  variant: CardVariant,
  flags: CardStateFlags = {},
  { theme = LightTheme, neutral = false } = {}
) => {
  const visuals = resolveCardVisuals({ theme, variant, ...flags });
  const { surface, container, content, stateLayer, outline } = getCardLayers({
    neutral,
  });

  expect(container).toHaveStyle({
    backgroundColor: visuals.containerColor,
    opacity: visuals.containerOpacity,
  });
  expect(content).toHaveStyle({ opacity: visuals.contentOpacity });
  // TouchableRipple draws the pressed layer, so Card skips its own.
  expect(stateLayer).toHaveStyle({
    backgroundColor: visuals.stateLayerColor,
    opacity: visuals.state === 'pressed' ? 0 : visuals.stateLayerOpacity,
  });

  if (variant === 'outlined') {
    expect(outline).toHaveStyle({
      borderWidth: 1,
      borderColor: visuals.outlineColor,
      opacity: visuals.outlineOpacity,
    });
  } else {
    expect(outline).toBeUndefined();
  }

  if (Platform.OS === 'android') {
    expect(surface).toHaveStyle({
      elevation: androidElevationLevels[visuals.elevation],
    });
  }
};

const settle = async () => {
  await act(() => {
    jest.runOnlyPendingTimers();
  });
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Card', () => {
  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders the enabled %s appearance',
    async (variant) => {
      await render(getVariantCard(variant));

      expect(screen.toJSON()).toMatchSnapshot();
    }
  );

  it.each<
    [CardVariant, 'surfaceContainerHighest' | 'surfaceContainerLow' | 'surface']
  >([
    ['filled', 'surfaceContainerHighest'],
    ['elevated', 'surfaceContainerLow'],
    ['outlined', 'surface'],
  ])(
    'uses the %s theme roles in light and dark themes',
    async (variant, containerRole) => {
      jest.replaceProperty(Platform, 'OS', 'android');

      for (const theme of [LightTheme, DarkTheme]) {
        const { unmount } = await render(getVariantCard(variant, { theme }));

        expect(getCardLayers({ neutral: true }).container).toHaveStyle({
          backgroundColor: theme.colors[containerRole],
        });
        expectCardState(variant, {}, { theme, neutral: true });

        await unmount();
      }
    }
  );

  it.each(['filled', 'elevated'] as const)(
    'does not render an outline for the %s variant',
    async (variant) => {
      await render(getVariantCard(variant));

      expect(getCardLayers({ neutral: true }).outline).toBeUndefined();
    }
  );

  it('uses filled as the default and resolves deeply merged custom colors', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    await render(
      <Card
        testID="card"
        theme={{
          colors: {
            surfaceContainerHighest: '#111111',
            onSurface: '#222222',
          },
        }}
      />
    );

    const { surface, container, stateLayer, outline } = getCardLayers({
      neutral: true,
    });

    expect(container).toHaveStyle({ backgroundColor: '#111111' });
    expect(stateLayer).toHaveStyle({ backgroundColor: '#222222' });
    expect(outline).toBeUndefined();
    expect(surface).toHaveStyle({ elevation: 0 });
  });

  it('uses custom theme roles for elevated and outlined variants', async () => {
    const { unmount } = await render(
      <Card
        testID="card"
        variant="elevated"
        theme={{ colors: { surfaceContainerLow: '#123456' } }}
      />
    );

    expect(getCardLayers({ neutral: true }).container).toHaveStyle({
      backgroundColor: '#123456',
    });
    await unmount();

    await render(
      <Card
        testID="card"
        variant="outlined"
        theme={{
          colors: { surface: '#abcdef', outlineVariant: '#654321' },
        }}
      />
    );

    const { container, outline } = getCardLayers({ neutral: true });

    expect(container).toHaveStyle({ backgroundColor: '#abcdef' });
    expect(outline).toHaveStyle({ borderColor: '#654321' });
  });

  it('lets only elevated Cards customize their resting elevation', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(<Card testID="card" variant="elevated" elevation={5} />);

    expect(getCardLayers({ neutral: true }).surface).toHaveStyle({
      elevation: androidElevationLevels[5],
    });
  });

  it.each<[CardVariant, number]>([
    ['filled', 0],
    ['elevated', 1],
    ['outlined', 0],
  ])('renders the enabled %s elevation at level %d', async (variant, level) => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(getVariantCard(variant));

    expect(getCardLayers({ neutral: true }).surface).toHaveStyle({
      elevation: androidElevationLevels[level],
    });
  });

  it('applies the medium shape and asymmetric overrides across the shell', async () => {
    const shape = {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 20,
    };
    const { unmount } = await render(<Card testID="card" variant="outlined" />);

    const medium = getCardLayers({ neutral: true });

    for (const layer of [
      medium.surface,
      medium.visual,
      medium.container,
      medium.stateLayer,
      medium.outline,
    ]) {
      expect(layer).toHaveStyle({
        borderRadius: LightTheme.shapes.corner.medium,
      });
    }
    await unmount();

    await render(<Card testID="card" variant="outlined" {...shape} />);

    const { surface, visual, container, stateLayer, outline } = getCardLayers({
      neutral: true,
    });

    for (const layer of [surface, visual, container, stateLayer, outline]) {
      expect(layer).toHaveStyle(shape);
    }
  });

  it('renders populated slots in deterministic order without rewriting nodes', async () => {
    const CustomContent = React.memo(() => (
      <View testID="content-custom-wrapper">
        <Text>Custom content</Text>
      </View>
    ));

    await render(
      <Card
        media={<View testID="region-media" />}
        header={<View testID="region-header" />}
        content={[
          <View key="first" testID="region-content-array" />,
          null,
          <CustomContent key="second" />,
        ]}
        actions={
          <>
            {null}
            <View testID="region-actions" />
          </>
        }
      />
    );

    expect(screen.getAllByTestId(/^(region-|content-custom-wrapper)/)).toEqual([
      screen.getByTestId('region-media'),
      screen.getByTestId('region-header'),
      screen.getByTestId('region-content-array'),
      screen.getByTestId('content-custom-wrapper'),
      screen.getByTestId('region-actions'),
    ]);
  });

  it('renders omitted slots as a neutral filled grouping container', async () => {
    await render(<Card testID="card" />);

    expectCardState('filled', {}, { neutral: true });
    expect(screen.getByTestId('card')).not.toHaveProp('focusable');
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('preserves explicit semantics on a neutral Card shell', async () => {
    await render(
      <Card
        testID="product-card"
        role="summary"
        accessible
        accessibilityLabel="Product summary"
        accessibilityHint="Contains product information"
        focusable={false}
      />
    );

    const shell = screen.getByRole('summary', { name: 'Product summary' });

    expect(shell).toHaveProp(
      'accessibilityHint',
      'Contains product information'
    );
    expect(shell).toHaveProp('focusable', false);
    expect(screen.getByTestId('product-card')).not.toHaveProp('role');
  });

  it('creates one target for whole-Card interaction callbacks', async () => {
    const onPress = jest.fn();
    const onLongPress = jest.fn();
    const onPressIn = jest.fn();
    const onPressOut = jest.fn();
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const onHoverIn = jest.fn();
    const onHoverOut = jest.fn();
    const hitSlop = { top: 4, right: 8, bottom: 12, left: 16 };
    await render(
      <Card
        testID="card"
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onFocus={onFocus}
        onBlur={onBlur}
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        delayLongPress={750}
        hitSlop={hitSlop}
      />
    );

    const [target] = screen.getAllByRole('button');
    const events = {
      press: { nativeEvent: { target: 'press' } },
      longPress: { nativeEvent: { target: 'long-press' } },
      pressIn: { nativeEvent: { target: 'press-in' } },
      pressOut: { nativeEvent: { target: 'press-out' } },
      focus: { nativeEvent: { target: 'focus' } },
      blur: { nativeEvent: { target: 'blur' } },
      hoverIn: { nativeEvent: { target: 'hover-in' } },
      hoverOut: { nativeEvent: { target: 'hover-out' } },
    };

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(target).toBe(screen.getByTestId('card'));
    expect(target).toHaveProp('hitSlop', hitSlop);
    expect(target).toHaveProp('focusable', true);

    await fireEvent(target, 'press', events.press);
    await fireEvent(target, 'longPress', events.longPress);
    await fireEvent(target, 'pressIn', events.pressIn);
    await fireEvent(target, 'pressOut', events.pressOut);
    await fireEvent(target, 'focus', events.focus);
    await fireEvent(target, 'blur', events.blur);
    await fireEvent(target, 'hoverIn', events.hoverIn);
    await fireEvent(target, 'hoverOut', events.hoverOut);

    expect(onPress).toHaveBeenCalledWith(events.press);
    expect(onLongPress).toHaveBeenCalledWith(events.longPress);
    expect(onPressIn).toHaveBeenCalledWith(events.pressIn);
    expect(onPressOut).toHaveBeenCalledWith(events.pressOut);
    expect(onFocus).toHaveBeenCalledWith(events.focus);
    expect(onBlur).toHaveBeenCalledWith(events.blur);
    expect(onHoverIn).toHaveBeenCalledWith(events.hoverIn);
    expect(onHoverOut).toHaveBeenCalledWith(events.hoverOut);
  });

  it('routes whole-Card accessibility semantics and callbacks to its target', async () => {
    const onAccessibilityAction = jest.fn();
    const onAccessibilityEscape = jest.fn();
    const onAccessibilityTap = jest.fn();
    const onMagicTap = jest.fn();
    const accessibilityActionEvent = {
      nativeEvent: { actionName: 'activate' },
    };
    await render(
      <Card
        testID="product-card"
        onPress={() => {}}
        role="link"
        accessibilityLabel="Open product"
        accessibilityHint="Shows product details"
        accessibilityState={{ selected: true }}
        accessibilityValue={{ text: 'In stock' }}
        accessibilityActions={[{ name: 'activate', label: 'Open product' }]}
        onAccessibilityAction={onAccessibilityAction}
        onAccessibilityEscape={onAccessibilityEscape}
        onAccessibilityTap={onAccessibilityTap}
        onMagicTap={onMagicTap}
      />
    );

    const target = screen.getByRole('link', { name: 'Open product' });

    expect(target).toBe(screen.getByTestId('product-card'));
    expect(target).toHaveProp('accessibilityHint', 'Shows product details');
    expect(target).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: true })
    );
    expect(target).toHaveAccessibilityValue({ text: 'In stock' });
    expect(target).toHaveProp('accessibilityActions', [
      { name: 'activate', label: 'Open product' },
    ]);
    // The shell only forwards accessibility semantics to the interaction
    // target, so the shell itself should carry none of them.
    const shell = target.parent?.parent;

    expect(shell).not.toHaveProp('role');
    expect(shell).not.toHaveProp('accessibilityHint');
    expect(shell).not.toHaveProp('accessibilityState');
    expect(shell).not.toHaveProp('accessibilityValue');
    expect(shell).not.toHaveProp('accessibilityActions');

    await fireEvent(target, 'accessibilityAction', accessibilityActionEvent);
    await fireEvent(target, 'accessibilityEscape');
    await fireEvent(target, 'accessibilityTap');
    await fireEvent(target, 'magicTap');

    expect(onAccessibilityAction).toHaveBeenCalledWith(
      accessibilityActionEvent
    );
    expect(onAccessibilityEscape).toHaveBeenCalledTimes(1);
    expect(onAccessibilityTap).toHaveBeenCalledTimes(1);
    expect(onMagicTap).toHaveBeenCalledTimes(1);
  });

  it('keeps the ripple, visual layers, and focus indicator on the Card shape', async () => {
    const shape = {
      borderTopLeftRadius: 4,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 20,
    };
    const { unmount } = await render(
      <Card {...shape} testID="product-card" onPress={() => {}} />
    );

    const interaction = screen.getByTestId('product-card');
    const [container, , stateLayer] = interaction.children.filter(
      (child): child is Layer => typeof child !== 'string'
    );

    // The interaction node is the clipped visual region, so the ripple
    // stays inside the Card shape. The Surface around it draws the ring.
    expect(interaction).toHaveStyle({ ...shape, overflow: 'hidden' });
    expect(container).toHaveStyle(shape);
    expect(stateLayer).toHaveStyle(shape);
    expect(interaction.parent).toHaveStyle(shape);
    await unmount();

    // `ref` forwards to a Reanimated Animated.View, which the test renderer
    // cannot serialize once populated, so its behavior is verified in a
    // separate, unsnapshotted render.
    const shellRef = React.createRef<React.ElementRef<typeof View>>();
    const touchableRef = React.createRef<React.ElementRef<typeof View>>();
    await render(
      <Card
        testID="card"
        {...shape}
        ref={shellRef}
        touchableRef={touchableRef}
        onPress={() => {}}
      />
    );

    expect(shellRef.current).not.toBeNull();
    expect(touchableRef.current).not.toBeNull();
    expect(touchableRef.current).not.toBe(shellRef.current);
  });

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'shows and clears the %s hover feedback',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      await render(getVariantCard(variant, { onPress: () => {} }));
      const target = screen.getByTestId('card');

      await fireEvent(target, 'hoverIn');
      await settle();

      expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.08 });
      expectCardState(variant, { hovered: true });

      await fireEvent(target, 'hoverOut');
      await settle();

      expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
      expectCardState(variant);
    }
  );

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'shows and clears the %s pressed feedback',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      await render(getVariantCard(variant, { onPress: () => {} }));
      const target = screen.getByTestId('card');

      await fireEvent(target, 'pressIn');
      await settle();

      expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
      expectCardState(variant, { pressed: true });

      await fireEvent(target, 'pressOut');
      await settle();

      expectCardState(variant);
    }
  );

  it.each<[CardVariant, number]>([
    ['filled', 3],
    ['elevated', 4],
    ['outlined', 3],
  ])(
    'renders the consumer-controlled %s dragged presentation at level %d',
    async (variant, level) => {
      jest.replaceProperty(Platform, 'OS', 'android');

      await render(getVariantCard(variant, { dragged: true }));

      const { surface, stateLayer } = getCardLayers({ neutral: true });

      expect(surface).toHaveStyle({ elevation: androidElevationLevels[level] });
      expect(stateLayer).toHaveStyle({ opacity: 0.16 });
      expectCardState(variant, { dragged: true }, { neutral: true });
    }
  );

  it.each(['filled', 'elevated'] as const)(
    'renders the Material disabled treatment for %s Cards',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      await render(
        getVariantCard(variant, { disabled: true, onPress: () => {} })
      );

      const { container, content } = getCardLayers();

      expect(container).toHaveStyle({ opacity: 0.38 });
      expect(content).toHaveStyle({ opacity: 0.38 });
      expectCardState(variant, { disabled: true });
    }
  );

  it('renders the Material disabled treatment for outlined Cards', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    await render(
      getVariantCard('outlined', { disabled: true, onPress: () => {} })
    );

    const { container, content, outline } = getCardLayers();

    expect(container).toHaveStyle({ opacity: 1 });
    expect(outline).toHaveStyle({ opacity: 0.12 });
    expect(content).toHaveStyle({ opacity: 0.38 });
    expectCardState('outlined', { disabled: true });
  });

  it('resolves disabled and dragged before pressed, focused, and hovered visuals', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const props = {
      variant: 'outlined' as const,
      dragged: true,
      onPress: () => {},
    };
    const { rerender } = await render(<Card testID="card" {...props} />);
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.16 });
    expectCardState('outlined', { dragged: true });

    await rerender(<Card testID="card" {...props} disabled />);
    await settle();

    expect(getCardLayers().outline).toHaveStyle({ opacity: 0.12 });
    expectCardState('outlined', { disabled: true });
  });

  it('updates the controlled dragged presentation in both directions', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const props = { variant: 'outlined' as const, onPress: () => {} };
    const { rerender } = await render(<Card testID="card" {...props} />);

    await rerender(<Card testID="card" {...props} dragged />);
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.16 });
    expectCardState('outlined', { dragged: true });

    await rerender(<Card testID="card" {...props} dragged={false} />);
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
    expectCardState('outlined');
  });

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders keyboard focus feedback for the %s variant',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'web');
      await render(getVariantCard(variant, { onPress: () => {} }));

      await fireEvent(screen.getByTestId('card'), 'focus', selfFocus(true));
      await settle();

      expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.1 });
      expectCardState(variant, { focused: true });
      // The ring itself is drawn by CSS on web when a direct child of the
      // Surface has `:focus-visible`.
      expect(getCardLayers().surface).toHaveProp('dataSet', {
        focusRingWithin: 'outward',
      });
      expect(getCardLayers().surface).toHaveStyle(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        {
          ['--rnp-focus-ring-color']: LightTheme.colors.secondary,
        } as unknown as ViewStyle
      );
    }
  );

  it('shows focus feedback only for keyboard-visible focus and clears it on blur', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<Card testID="card" variant="outlined" onPress={() => {}} />);
    const target = screen.getByTestId('card');

    await fireEvent(target, 'focus', selfFocus(false));
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
    expectCardState('outlined');

    await fireEvent(target, 'focus', selfFocus(true));
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.1 });
    expectCardState('outlined', { focused: true });

    await fireEvent(target, 'blur');
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
    expectCardState('outlined');
  });

  it('clears hover feedback when the Card stops being actionable', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const { rerender } = await render(
      <Card testID="card" variant="outlined" onPressIn={() => {}} />
    );

    await fireEvent(screen.getByTestId('card'), 'hoverIn');
    await settle();
    expectCardState('outlined', { hovered: true });

    // The interaction node unmounts without a handler, so it sends no hover out.
    await rerender(<Card testID="card" variant="outlined" />);
    await rerender(
      <Card testID="card" variant="outlined" onPressIn={() => {}} />
    );
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
    expectCardState('outlined');
  });

  it('uses pressed, focused, then hovered precedence and settles at the latest state', async () => {
    await render(<Card testID="card" variant="outlined" onPress={() => {}} />);
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
    expectCardState('outlined', { pressed: true });

    await fireEvent(target, 'pressOut');
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.1 });
    expectCardState('outlined', { focused: true });

    await fireEvent(target, 'blur');
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.08 });
    expectCardState('outlined', { hovered: true });

    await fireEvent(target, 'hoverOut');
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0 });
    expectCardState('outlined');
  });

  it('uses the theme motion duration and easing for visual transitions', async () => {
    const easing = [0.1, 0.2, 0.3, 0.4] as const;
    const theme = {
      motion: {
        duration: { short3: 320 },
        easing: { standard: easing },
      },
    };
    const transition = {
      transitionDuration: 320,
      transitionTimingFunction: cubicBezier(...easing),
    };
    const { rerender } = await render(
      <Card testID="card" variant="outlined" onPress={() => {}} theme={theme} />
    );

    const expectTransitions = () => {
      const { stateLayer, outline } = getCardLayers();

      expect(getAnimatedStyle(stateLayer)).toMatchObject({
        ...transition,
        transitionProperty: 'opacity',
      });
      expect(getAnimatedStyle(outline)).toMatchObject({
        ...transition,
        transitionProperty: ['borderColor', 'opacity'],
      });
    };

    expectTransitions();

    await rerender(
      <Card
        testID="card"
        variant="outlined"
        disabled
        onPress={() => {}}
        theme={theme}
      />
    );

    expectTransitions();
  });

  it('settles transitions immediately when reduced motion is enabled', async () => {
    await render(
      <ReduceMotionContext.Provider value>
        <Card testID="card" variant="outlined" onPress={() => {}} />
      </ReduceMotionContext.Provider>
    );

    await fireEvent(screen.getByTestId('card'), 'pressIn');
    await settle();

    const { stateLayer, outline } = getCardLayers();

    for (const layer of [stateLayer, outline]) {
      expect(getAnimatedStyle(layer)).toMatchObject({ transitionDuration: 0 });
    }
  });

  it('settles rapid changes at the latest complete visual state', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    const props = { variant: 'outlined' as const, onPress: () => {} };
    const { rerender } = await render(<Card testID="card" {...props} />);
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');
    await rerender(<Card testID="card" {...props} dragged />);
    await rerender(<Card testID="card" {...props} />);
    await fireEvent(target, 'pressOut');
    await fireEvent(target, 'blur');
    await fireEvent(target, 'hoverOut');
    await fireEvent(target, 'hoverIn');
    await settle();

    expect(getCardLayers().stateLayer).toHaveStyle({ opacity: 0.08 });
    expectCardState('outlined', { hovered: true });
  });

  it('does not rerender stable memoized slot content for transient feedback', async () => {
    const renderCount = jest.fn();
    const StableContent = React.memo(() => {
      renderCount();
      return <Text>Stable content</Text>;
    });
    await render(
      <Card testID="card" onPress={() => {}} content={<StableContent />} />
    );
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');
    await fireEvent(target, 'pressOut');
    await fireEvent(target, 'blur');
    await fireEvent(target, 'hoverOut');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(renderCount).toHaveBeenCalledTimes(1);
  });

  it('warns once when whole-Card interaction is combined with populated actions', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = await render(
      <Card testID="card" onPress={() => {}} actions={null} />
    );

    expect(warn).not.toHaveBeenCalled();

    await rerender(
      <Card
        testID="card"
        onPress={() => {}}
        actions={
          <Card.Actions>
            <Button onPress={() => {}}>Open</Button>
          </Card.Actions>
        }
      />
    );
    await rerender(
      <Card
        testID="card"
        onPress={() => {}}
        actions={
          <Card.Actions>
            <Button onPress={() => {}}>Open</Button>
          </Card.Actions>
        }
      />
    );

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      'An actionable Card cannot contain actions. Remove the Card interaction handlers or move the independent actions outside the Card.'
    );
  });

  it.each([
    ['an empty array', []],
    ['an array of empty values', [null, false, undefined]],
    ['nested empty arrays', [[], []]],
    ['true', true],
  ])(
    'does not warn when whole-Card interaction is combined with %s in actions',
    async (_, actions) => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

      await render(<Card testID="card" onPress={() => {}} actions={actions} />);

      expect(warn).not.toHaveBeenCalled();
    }
  );

  it('does not warn about Card actions in production', async () => {
    const environment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      await render(
        <Card
          testID="card"
          onPress={() => {}}
          actions={
            <Card.Actions>
              <Button onPress={() => {}}>Open</Button>
            </Card.Actions>
          }
        />
      );

      expect(warn).not.toHaveBeenCalled();
    } finally {
      process.env.NODE_ENV = environment;
    }
  });

  it('renders the convenience header inputs', async () => {
    await render(
      <Card
        testID="card"
        title="Card title"
        subtitle="Card subtitle"
        leading={({ size }) => <Text>Leading {size}</Text>}
        trailing={({ size }) => <Text>Trailing {size}</Text>}
      />
    );

    expect(screen.getByText('Card title')).toBeOnTheScreen();
    expect(screen.getByText('Card subtitle')).toBeOnTheScreen();
    expect(screen.getByText('Leading 40')).toBeOnTheScreen();
    expect(screen.getByText('Trailing 24')).toBeOnTheScreen();
  });

  it('renders with a content style', async () => {
    await render(
      <Card
        testID="card"
        content={<Text>Content</Text>}
        contentStyle={styles.contentStyle}
      />
    );

    expect(screen.getByText('Content').parent).toHaveStyle(styles.contentStyle);
  });

  it('exposes disabled semantics and suppresses every activation callback', async () => {
    const onAccessibilityAction = jest.fn();
    const callbacks = {
      onPress: jest.fn(),
      onLongPress: jest.fn(),
      onPressIn: jest.fn(),
      onPressOut: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      onHoverIn: jest.fn(),
      onHoverOut: jest.fn(),
      onAccessibilityEscape: jest.fn(),
      onAccessibilityTap: jest.fn(),
      onMagicTap: jest.fn(),
    };
    await render(
      <Card
        testID="card"
        {...callbacks}
        disabled
        accessibilityActions={[{ name: 'activate' }]}
        onAccessibilityAction={onAccessibilityAction}
        focusable
        tabIndex={0}
      />
    );

    const target = screen.getByTestId('card');

    expect(target).toBeDisabled();
    expect(target).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ disabled: true })
    );
    expect(target).not.toHaveProp('accessibilityActions');
    expect(target).toHaveProp('focusable', false);
    expect(target).toHaveProp('tabIndex', -1);

    await userEvent.press(target);
    await userEvent.longPress(target);
    await fireEvent(target, 'focus');
    await fireEvent(target, 'blur');
    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'hoverOut');
    await fireEvent(target, 'accessibilityAction', {
      nativeEvent: { actionName: 'activate' },
    });
    await fireEvent(target, 'accessibilityEscape');
    await fireEvent(target, 'accessibilityTap');
    await fireEvent(target, 'magicTap');

    Object.values(callbacks).forEach((callback) => {
      expect(callback).not.toHaveBeenCalled();
    });
    expect(onAccessibilityAction).not.toHaveBeenCalled();
  });

  it('uses a custom outline color in every state', async () => {
    const { rerender } = await render(
      <Card testID="card" variant="outlined" borderColor="red" />
    );

    expect(JSON.stringify(screen.toJSON())).toContain('"borderColor":"red"');

    await rerender(
      <Card testID="card" variant="outlined" borderColor="red" disabled />
    );

    expect(JSON.stringify(screen.toJSON())).toContain('"borderColor":"red"');
  });

  it('dims the slot content of a disabled Card', async () => {
    const { rerender } = await render(
      <Card testID="card" disabled content={<Text>Body</Text>} />
    );

    expect(screen.getByTestId('card')).toHaveStyle({ opacity: 0.38 });

    await rerender(<Card testID="card" content={<Text>Body</Text>} />);

    expect(screen.getByTestId('card')).toHaveStyle({ opacity: 1 });
  });

  it('exposes disabled state on an explicitly semantic neutral Card', async () => {
    await render(<Card testID="card" disabled accessible role="summary" />);

    expect(screen.getByRole('summary')).toBeDisabled();
  });

  it.each([
    { name: 'aria-disabled', props: { 'aria-disabled': true } },
    {
      name: 'accessibilityState.disabled',
      props: { accessibilityState: { disabled: true } },
    },
  ] as const)('honors $name as a disabled Card state', async ({ props }) => {
    const onPress = jest.fn();
    await render(<Card testID="card" {...props} onPress={onPress} />);

    const target = screen.getByTestId('card');

    expect(target).toBeDisabled();
    await userEvent.press(target);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Card types', () => {
  it('accepts documented examples and rejects removed or mixed forms', () => {
    const variant = 'filled' as 'filled' | 'elevated' | 'outlined';
    const typeCases = (
      <>
        <Card testID="card" />
        <Card
          testID="card"
          variant={variant}
          media={<Card.Cover source={{ uri: 'cover' }} />}
          actions={<View />}
        />
        <Card testID="card" variant={variant} title="Title" />
        <Card testID="card" variant={variant} header={<View />} />
        <Card
          testID="card"
          accessibilityLabel="Open trip details"
          onPress={() => {}}
          media={<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />}
          title="Weekend trip"
          subtitle="Actionable filled Card"
          content={
            <Card.Content>
              <Text>View the itinerary.</Text>
            </Card.Content>
          }
        />
        <Card
          testID="card"
          variant="elevated"
          title="Draft itinerary"
          content={
            <Card.Content>
              <Text>Review before saving.</Text>
            </Card.Content>
          }
          actions={
            <Card.Actions>
              <Button onPress={() => {}}>Discard</Button>
              <Button mode="filled" onPress={() => {}}>
                Save
              </Button>
            </Card.Actions>
          }
        />
        <Card
          testID="card"
          variant="outlined"
          header={<Card.Title title="Custom header" subtitle="Outlined Card" />}
          content={
            <Card.Content>
              <Text>Supply any React node as the header.</Text>
            </Card.Content>
          }
        />
        <Card
          testID="card"
          title="Title"
          subtitle="Subtitle"
          leading={({ size }) => <View accessibilityLabel={`${size}`} />}
          trailing={({ size }) => <View accessibilityLabel={`${size}`} />}
        />
        <Card testID="card" header={<View />} />
        <Card
          testID="card"
          content={<Text>Content</Text>}
          actions={[<View key="action" />]}
        />
        <Card testID="card" variant="filled" />
        <Card testID="card" variant="outlined" />
        <Card testID="card" variant="elevated" />
        <Card testID="card" variant="elevated" elevation={5} />
        <Card testID="card" variant="outlined" borderColor="red" />

        {/* @ts-expect-error: Arbitrary children composition was removed. */}
        <Card testID="card">
          <View />
        </Card>

        {/* @ts-expect-error: The old mode prop was removed. */}
        <Card testID="card" mode="contained" />

        {/* @ts-expect-error: Contained is not a Card variant. */}
        <Card testID="card" variant="contained" />

        {/* @ts-expect-error: The default filled Card cannot be elevated. */}
        <Card testID="card" elevation={1} />

        {/* @ts-expect-error: Filled Cards cannot be elevated. */}
        <Card testID="card" variant="filled" elevation={1} />

        {/* @ts-expect-error: Outlined Cards cannot be elevated. */}
        <Card testID="card" variant="outlined" elevation={1} />

        {/* @ts-expect-error: Only outlined Cards have an outline color. */}
        <Card testID="card" borderColor="red" />

        {/* @ts-expect-error: Only outlined Cards have an outline color. */}
        <Card testID="card" variant="elevated" borderColor="red" />

        {/* @ts-expect-error: Custom and convenience headers are mutually exclusive. */}
        <Card testID="card" header={<View />} title="Title" />

        {/* @ts-expect-error: Custom and convenience headers are mutually exclusive. */}
        <Card testID="card" header={<View />} leading={() => <View />} />

        {/* @ts-expect-error: Cover placement metadata is not public. */}
        <Card.Cover source={{ uri: 'cover' }} index={0} total={1} />
      </>
    );

    expect(typeCases).toBeDefined();
  });
});

describe('CardCover', () => {
  it('uses the documented full-width default size', async () => {
    await render(
      <Card.Cover
        source={{ uri: 'https://picsum.photos/700' }}
        testID="card-cover"
      />
    );

    expect(screen.getByTestId('card-cover')).toHaveStyle({
      width: '100%',
      height: 195,
    });
  });

  it('uses an aspect ratio instead of the default height', async () => {
    await render(
      <Card.Cover
        source={{ uri: 'https://picsum.photos/700' }}
        testID="responsive-cover"
        aspectRatio={16 / 9}
      />
    );

    const cover = screen.getByTestId('responsive-cover');

    // `height: 'auto'` overrides the intrinsic height React Native gives a
    // static `require()` source, which would otherwise win over the ratio.
    expect(cover).toHaveStyle({
      width: '100%',
      height: 'auto',
      aspectRatio: 16 / 9,
    });
  });

  it('exposes supplied semantics for an informative image', async () => {
    await render(
      <Card.Cover
        source={{ uri: 'https://picsum.photos/700' }}
        testID="informative-cover"
        accessible
        accessibilityRole="image"
        accessibilityLabel="Snow-covered mountains"
      />
    );

    expect(screen.getByRole('image')).toBe(
      screen.getByLabelText('Snow-covered mountains')
    );
  });

  it('preserves explicit decorative image semantics', async () => {
    await render(
      <Card.Cover
        source={{ uri: 'https://picsum.photos/700' }}
        testID="decorative-cover"
        accessible={false}
        aria-hidden
      />
    );

    const cover = screen.getByTestId('decorative-cover', {
      includeHiddenElements: true,
    });

    expect(cover).toHaveProp('accessible', false);
    expect(cover).toHaveProp('aria-hidden', true);
    expect(screen.queryByRole('image')).not.toBeOnTheScreen();
  });

  it('applies consumer image styles after the defaults', async () => {
    await render(
      <Card.Cover
        source={{ uri: 'https://picsum.photos/700' }}
        testID="styled-cover"
        style={[
          { width: 320, height: 180, opacity: 0.8 },
          { height: 200, borderRadius: 6 },
        ]}
      />
    );

    expect(screen.getByTestId('styled-cover')).toHaveStyle({
      width: 320,
      height: 200,
      opacity: 0.8,
      borderRadius: 6,
    });
  });

  it('uses the Card clipping shape for edge media without double rounding', async () => {
    await render(
      <Card
        testID="shaped-card"
        borderTopLeftRadius={4}
        borderTopRightRadius={8}
        borderBottomRightRadius={16}
        borderBottomLeftRadius={20}
        media={
          <Card.Cover
            source={{ uri: 'https://picsum.photos/700' }}
            testID="edge-cover"
          />
        }
      />
    );

    // The Card clips its media: the visual node around the slots carries
    // the shape and hides the overflow, so the cover needs no radius.
    expect(screen.getByTestId('edge-cover').parent?.parent).toHaveStyle({
      overflow: 'hidden',
      borderTopLeftRadius: 4,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 20,
    });
    expect(screen.getByTestId('edge-cover')).not.toHaveStyle({
      borderRadius: LightTheme.shapes.corner.medium,
    });
  });
});

describe('CardTitle', () => {
  // Card adds no padding around its slots, so the header pads itself like
  // `Card.Content` does.
  it('pads its own start edge and the end of its text', async () => {
    await render(
      <Card.Title testID="card-title" title="Title" subtitle="Subtitle" />
    );

    expect(screen.getByTestId('card-title')).toHaveStyle({
      paddingLeft: 16,
      minHeight: 72,
    });
    expect(screen.getByText('Title')).toHaveStyle({ paddingRight: 16 });
    expect(screen.getByText('Subtitle')).toHaveStyle({ paddingRight: 16 });
  });

  // A zero flex basis would collapse the titles in a row-laid-out Card on
  // iOS and Android, so they size from their text and grow into free space.
  it('sizes the titles from their text in a row-laid-out Card', async () => {
    await render(
      <Card
        contentStyle={{ flexDirection: 'row' }}
        media={<Card.Cover source={{ uri: 'cover' }} />}
        title="Title"
      />
    );

    const titles = screen.getByText('Title').parent;

    expect(titles).toHaveStyle({ flexGrow: 1, flexShrink: 1 });
    expect(titles).not.toHaveStyle({ flex: 1 });
  });
});

describe('CardContent', () => {
  it('uses fixed padding when rendered standalone', async () => {
    await render(
      <Card.Content testID="card-content">
        <Text>Content</Text>
      </Card.Content>
    );

    expect(screen.getByTestId('card-content')).toHaveStyle({
      paddingHorizontal: 16,
      paddingVertical: 16,
    });
  });

  it('uses fixed padding regardless of neighboring card elements', async () => {
    await render(
      <>
        <Card.Title title="Title" />
        <View>
          <Card.Content testID="card-content">
            <Text>Content</Text>
          </Card.Content>
        </View>
        <Card.Actions>
          <Button>Action</Button>
        </Card.Actions>
      </>
    );

    expect(screen.getByTestId('card-content')).toHaveStyle({
      paddingHorizontal: 16,
      paddingVertical: 16,
    });
  });

  it('lets consumer styles override the default padding', async () => {
    await render(
      <Card.Content
        testID="card-content"
        style={{ paddingHorizontal: 24, paddingVertical: 12 }}
      >
        <Text>Content</Text>
      </Card.Content>
    );

    expect(screen.getByTestId('card-content')).toHaveStyle({
      paddingHorizontal: 24,
      paddingVertical: 12,
    });
  });
});

describe('CardActions', () => {
  it('lays out heterogeneous nodes with container-owned spacing', async () => {
    await render(
      <Card.Actions testID="card-actions">
        <Button>Agree</Button>
        <View testID="custom-action" />
        <Text>Details</Text>
      </Card.Actions>
    );

    expect(screen.getByTestId('card-actions')).toHaveStyle({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 8,
    });
    expect(screen.getByTestId('custom-action')).toBeOnTheScreen();
    expect(screen.getByText('Details')).toBeOnTheScreen();
  });

  it('lets consumer styles override the default layout', async () => {
    await render(
      <Card.Actions
        testID="card-actions"
        style={{
          justifyContent: 'flex-start',
          paddingHorizontal: 4,
          paddingVertical: 4,
          gap: 12,
        }}
      >
        <Text>Action</Text>
      </Card.Actions>
    );

    expect(screen.getByTestId('card-actions')).toHaveStyle({
      justifyContent: 'flex-start',
      paddingHorizontal: 4,
      paddingVertical: 4,
      gap: 12,
    });
  });

  it('preserves consumer-configured child props', async () => {
    const Action = ({
      compact,
      mode,
      style,
    }: {
      compact?: boolean;
      mode?: string;
      style?: StyleProp<ViewStyle>;
    }) => (
      <View
        accessibilityLabel={`${mode ?? 'unset'}:${compact ?? 'unset'}`}
        style={style}
      />
    );

    await render(
      <Card.Actions testID="card-actions">
        <Action style={styles.customAction} />
        <Action mode="contained" compact style={styles.customAction} />
        <View testID="custom-action" style={styles.customAction} />
      </Card.Actions>
    );

    expect(screen.getByLabelText('unset:unset')).toHaveStyle(
      styles.customAction
    );
    expect(screen.getByLabelText('contained:true')).toHaveStyle(
      styles.customAction
    );
    expect(screen.getByLabelText('unset:unset')).not.toHaveStyle({
      marginLeft: 8,
    });
    expect(screen.getByTestId('custom-action')).not.toHaveStyle({
      marginLeft: 8,
    });
  });
});
