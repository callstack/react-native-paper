import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react-native';

import { fireEvent, render, screen, userEvent } from '../../../test-utils';
import { ReduceMotionContext } from '../../../theme/accessibility/ReduceMotionContext';
import { DarkTheme, LightTheme } from '../../../theme/schemes';
import Button from '../../Button/Button';
import Card from '../../Card/Card';
import type { Props as CardProps } from '../../Card/Card';

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
    return <Card {...props} variant="elevated" />;
  }
  if (variant === 'outlined') {
    return <Card {...props} variant="outlined" />;
  }
  return <Card {...props} variant="filled" />;
};

// The Card shell, clipped visual region, background, state layer, outline,
// and focus indicator are internal nodes with no public testID. Their
// styles are guarded with a snapshot of the rendered tree instead.
const expectVisualSnapshot = () => {
  expect(screen.toJSON()).toMatchSnapshot();
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Card', () => {
  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders the enabled %s appearance in light and dark themes',
    async (variant) => {
      for (const isDark of [false, true] as const) {
        const theme = isDark ? DarkTheme : LightTheme;
        const card = getVariantCard(variant, { theme });
        const { unmount } = await render(card);

        expectVisualSnapshot();

        await unmount();
      }
    }
  );

  it('renders the enabled outlined role in light and dark themes', async () => {
    for (const isDark of [false, true] as const) {
      const theme = isDark ? DarkTheme : LightTheme;
      const { unmount } = await render(
        <Card variant="outlined" theme={theme} />
      );

      expectVisualSnapshot();

      await unmount();
    }
  });

  it.each(['filled', 'elevated'] as const)(
    'does not render an outline for the %s variant',
    async (variant) => {
      const card = getVariantCard(variant);

      await render(card);

      expectVisualSnapshot();
    }
  );

  it('uses filled as the default and resolves deeply merged custom colors', async () => {
    await render(
      <Card
        theme={{
          colors: {
            surfaceContainerHighest: '#111111',
            onSurface: '#222222',
          },
        }}
      />
    );

    expectVisualSnapshot();
  });

  it('uses custom theme roles for elevated and outlined variants', async () => {
    const { unmount } = await render(
      <Card
        variant="elevated"
        theme={{ colors: { surfaceContainerLow: '#123456' } }}
      />
    );

    expectVisualSnapshot();
    await unmount();

    await render(
      <Card
        variant="outlined"
        theme={{
          colors: { surface: '#abcdef', outlineVariant: '#654321' },
        }}
      />
    );

    expectVisualSnapshot();
  });

  it('lets only elevated Cards customize their resting elevation', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(<Card variant="elevated" elevation={5} />);

    expectVisualSnapshot();
  });

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders the enabled %s elevation',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      const card = getVariantCard(variant);

      await render(card);

      expectVisualSnapshot();
    }
  );

  it('applies the medium shape and asymmetric overrides across the shell', async () => {
    await render(
      <Card
        variant="outlined"
        borderTopLeftRadius={4}
        borderTopRightRadius={8}
        borderBottomRightRadius={16}
        borderBottomLeftRadius={20}
      />
    );

    expectVisualSnapshot();
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
    await render(<Card />);

    expectVisualSnapshot();
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
    expectVisualSnapshot();

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

    expect(interaction).toHaveStyle(shape);
    // The clipped visual region and focus indicator are internal nodes with
    // no public testID; the snapshot captures their shape, position, and the
    // interaction node's place within the visual region.
    expectVisualSnapshot();
    await unmount();

    // `ref` forwards to a Reanimated Animated.View, which the test renderer
    // cannot serialize once populated, so its behavior is verified in a
    // separate, unsnapshotted render.
    const shellRef = React.createRef<React.ElementRef<typeof View>>();
    const touchableRef = React.createRef<React.ElementRef<typeof View>>();
    await render(
      <Card
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
      expect.hasAssertions();
      jest.replaceProperty(Platform, 'OS', 'android');
      const card = getVariantCard(variant, { onPress: () => {} });
      await render(card);

      const target = screen.getByTestId('card');

      await fireEvent(target, 'hoverIn');
      await act(() => {
        jest.runOnlyPendingTimers();
      });

      expectVisualSnapshot();

      await fireEvent(target, 'hoverOut');

      expectVisualSnapshot();
    }
  );

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'shows and clears the %s pressed feedback',
    async (variant) => {
      expect.hasAssertions();
      jest.replaceProperty(Platform, 'OS', 'android');
      const card = getVariantCard(variant, { onPress: () => {} });
      await render(card);

      const target = screen.getByTestId('card');

      await fireEvent(target, 'pressIn');
      await act(() => {
        jest.runOnlyPendingTimers();
      });

      expectVisualSnapshot();

      await fireEvent(target, 'pressOut');
      await act(() => {
        jest.runOnlyPendingTimers();
      });

      expectVisualSnapshot();
    }
  );

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders the consumer-controlled %s dragged presentation',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      const theme = LightTheme;
      const card = getVariantCard(variant, { dragged: true, theme });

      await render(card);

      expectVisualSnapshot();
    }
  );

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders the Material disabled treatment for %s Cards',
    async (variant) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      const theme = LightTheme;
      const card = getVariantCard(variant, {
        disabled: true,
        onPress: () => {},
        theme,
      });

      await render(card);

      expectVisualSnapshot();
    }
  );

  it('resolves disabled and dragged before pressed, focused, and hovered visuals', async () => {
    expect.hasAssertions();
    jest.replaceProperty(Platform, 'OS', 'android');
    const theme = LightTheme;
    const { rerender } = await render(
      <Card variant="outlined" dragged onPress={() => {}} theme={theme} />
    );
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();

    await rerender(
      <Card
        variant="outlined"
        dragged
        disabled
        onPress={() => {}}
        theme={theme}
      />
    );
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();
  });

  it('updates the controlled dragged presentation in both directions', async () => {
    expect.hasAssertions();
    jest.replaceProperty(Platform, 'OS', 'android');
    const theme = LightTheme;
    const props = {
      variant: 'outlined' as const,
      onPress: () => {},
      theme,
    };
    const { rerender } = await render(<Card {...props} />);

    await rerender(<Card {...props} dragged />);
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();

    await rerender(<Card {...props} dragged={false} />);
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();
  });

  it.each(['filled', 'elevated', 'outlined'] as const)(
    'renders keyboard focus feedback for the %s variant',
    async (variant) => {
      expect.hasAssertions();
      jest.replaceProperty(Platform, 'OS', 'web');
      const card = getVariantCard(variant, { onPress: () => {} });
      await render(card);

      await fireEvent(screen.getByTestId('card'), 'focus', {
        currentTarget: { matches: () => true },
      });
      await act(() => {
        jest.runOnlyPendingTimers();
      });

      expectVisualSnapshot();
    }
  );

  it('shows focus feedback only for keyboard-visible focus and clears it on blur', async () => {
    expect.hasAssertions();
    jest.replaceProperty(Platform, 'OS', 'web');
    const theme = LightTheme;
    await render(<Card variant="outlined" onPress={() => {}} theme={theme} />);
    const target = screen.getByTestId('card');
    const pointerTarget = { matches: () => false };
    const keyboardTarget = { matches: () => true };

    await fireEvent(target, 'focus', { currentTarget: pointerTarget });
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();

    await fireEvent(target, 'focus', { currentTarget: keyboardTarget });
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();

    await fireEvent(target, 'blur');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();
  });

  it('uses pressed, focused, then hovered precedence and settles at the latest state', async () => {
    expect.hasAssertions();
    const theme = LightTheme;
    await render(<Card variant="outlined" onPress={() => {}} theme={theme} />);
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');
    await fireEvent(target, 'pressOut');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();

    await fireEvent(target, 'blur');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();

    await fireEvent(target, 'hoverOut');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();
  });

  it('uses scaled theme motion duration and easing for visual transitions', async () => {
    expect.hasAssertions();
    const easing = [0.1, 0.2, 0.3, 0.4] as const;
    const theme = {
      animation: { scale: 0.5 },
      motion: {
        duration: { short3: 320 },
        easing: { standard: easing },
      },
    };
    const { rerender } = await render(
      <Card onPress={() => {}} theme={theme} />
    );

    // The scaled duration and easing are set on the state layer and shell,
    // both internal nodes with no public testID.
    expectVisualSnapshot();

    await rerender(<Card disabled onPress={() => {}} theme={theme} />);

    expectVisualSnapshot();
  });

  it('settles transitions immediately when reduced motion is enabled', async () => {
    expect.hasAssertions();
    await render(
      <ReduceMotionContext.Provider value>
        <Card variant="outlined" onPress={() => {}} />
      </ReduceMotionContext.Provider>
    );

    await fireEvent(screen.getByTestId('card'), 'pressIn');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();
  });

  it('settles rapid changes at the latest complete visual state', async () => {
    expect.hasAssertions();
    jest.replaceProperty(Platform, 'OS', 'android');
    const theme = LightTheme;
    const props = {
      variant: 'outlined' as const,
      onPress: () => {},
      theme,
    };
    const { rerender } = await render(<Card {...props} />);
    const target = screen.getByTestId('card');

    await fireEvent(target, 'hoverIn');
    await fireEvent(target, 'focus');
    await fireEvent(target, 'pressIn');
    await rerender(<Card {...props} dragged />);
    await rerender(<Card {...props} />);
    await fireEvent(target, 'pressOut');
    await fireEvent(target, 'blur');
    await fireEvent(target, 'hoverOut');
    await fireEvent(target, 'hoverIn');
    await act(() => {
      jest.runOnlyPendingTimers();
    });

    expectVisualSnapshot();
  });

  it('does not rerender stable memoized slot content for transient feedback', async () => {
    const renderCount = jest.fn();
    const StableContent = React.memo(() => {
      renderCount();
      return <Text>Stable content</Text>;
    });
    await render(<Card onPress={() => {}} content={<StableContent />} />);
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
      <Card onPress={() => {}} actions={null} />
    );

    expect(warn).not.toHaveBeenCalled();

    await rerender(
      <Card
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

  it('does not warn about Card actions in production', async () => {
    const environment = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      await render(
        <Card
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
      <Card content={<Text>Content</Text>} contentStyle={styles.contentStyle} />
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

  it('exposes disabled state on an explicitly semantic neutral Card', async () => {
    await render(<Card disabled accessible role="summary" />);

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
    await render(<Card {...props} onPress={onPress} />);

    const target = screen.getByTestId('card');

    expect(target).toBeDisabled();
    await userEvent.press(target);
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('Card types', () => {
  it('accepts documented examples and rejects removed or mixed forms', () => {
    const typeCases = (
      <>
        <Card />
        <Card
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
              <Button mode="contained" onPress={() => {}}>
                Save
              </Button>
            </Card.Actions>
          }
        />
        <Card
          variant="outlined"
          header={<Card.Title title="Custom header" subtitle="Outlined Card" />}
          content={
            <Card.Content>
              <Text>Supply any React node as the header.</Text>
            </Card.Content>
          }
        />
        <Card
          title="Title"
          subtitle="Subtitle"
          leading={({ size }) => <View accessibilityLabel={`${size}`} />}
          trailing={({ size }) => <View accessibilityLabel={`${size}`} />}
        />
        <Card header={<View />} />
        <Card
          content={<Text>Content</Text>}
          actions={[<View key="action" />]}
        />
        <Card variant="filled" />
        <Card variant="outlined" />
        <Card variant="elevated" />
        <Card variant="elevated" elevation={5} />

        {/* @ts-expect-error: Arbitrary children composition was removed. */}
        <Card>
          <View />
        </Card>

        {/* @ts-expect-error: The old mode prop was removed. */}
        <Card mode="contained" />

        {/* @ts-expect-error: Contained is not a Card variant. */}
        <Card variant="contained" />

        {/* @ts-expect-error: The default filled Card cannot be elevated. */}
        <Card elevation={1} />

        {/* @ts-expect-error: Filled Cards cannot be elevated. */}
        <Card variant="filled" elevation={1} />

        {/* @ts-expect-error: Outlined Cards cannot be elevated. */}
        <Card variant="outlined" elevation={1} />

        {/* @ts-expect-error: Custom and convenience headers are mutually exclusive. */}
        <Card header={<View />} title="Title" />

        {/* @ts-expect-error: Custom and convenience headers are mutually exclusive. */}
        <Card header={<View />} leading={() => <View />} />

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
        style={{ aspectRatio: 16 / 9 }}
      />
    );

    const cover = screen.getByTestId('responsive-cover');

    expect(cover).toHaveStyle({ width: '100%', aspectRatio: 16 / 9 });
    expect(cover).not.toHaveStyle({ height: 195 });
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

    // The clipped visual region is an internal node with no public testID.
    expectVisualSnapshot();
    expect(screen.getByTestId('edge-cover')).not.toHaveStyle({
      borderRadius: LightTheme.shapes.corner.medium,
    });
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
      padding: 8,
      gap: 8,
    });
    expect(screen.getByTestId('custom-action')).toBeOnTheScreen();
    expect(screen.getByText('Details')).toBeOnTheScreen();
  });

  it('lets consumer styles override the default layout', async () => {
    await render(
      <Card.Actions
        testID="card-actions"
        style={{ justifyContent: 'flex-start', padding: 4, gap: 12 }}
      >
        <Text>Action</Text>
      </Card.Actions>
    );

    expect(screen.getByTestId('card-actions')).toHaveStyle({
      justifyContent: 'flex-start',
      padding: 4,
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
