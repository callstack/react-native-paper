import { Platform, Pressable } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { getAnimatedStyle } from 'react-native-reanimated';
import type { JsonElement, JsonNode } from 'test-renderer';

import { fireEvent, render, screen, userEvent } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import { webNoOutlineStyle } from '../../utils/useFocusRing';
import Switch from '../Switch/Switch';

const { colors } = LightTheme;
const { focusIndicator } = tokens.md.sys.state;

const element = (node: JsonNode | null | undefined): JsonElement => {
  if (typeof node !== 'object' || node === null) {
    throw new Error('Expected a rendered view');
  }

  return node;
};

// The state layer and handle are decorative views with no role or test ID.
// They render after the control in this order, and the handle fill is the
// last view inside the handle.
const getLayers = () => {
  const { children } = element(screen.toJSON());
  const handle = element(children[2]);
  const { children: handleChildren } = handle;

  return {
    stateLayer: getAnimatedStyle(element(children[1])),
    handle: getAnimatedStyle(handle),
    handleFill: getAnimatedStyle(element(handleChildren.at(-1))),
  };
};

// The focus ring is drawn on the track, the first child of the control. On
// native it is an outline style that is set while the switch has keyboard
// focus. On web the browser draws it with CSS on `:focus-visible`, so a test
// can only check that the track carries the ring attribute.
const expectFocusRing = (shown: boolean) => {
  const track = screen.getByRole('switch').children[0];
  if (typeof track !== 'object') {
    throw new Error('Expected the track view');
  }

  if (Platform.OS === 'web') {
    const ring = { focusRingDescendant: 'outward' };
    if (shown) {
      expect(track).toHaveProp('dataSet', ring);
    } else {
      expect(track).not.toHaveProp('dataSet', ring);
    }
    return;
  }

  const outline = { outlineWidth: focusIndicator.thickness };
  if (shown) {
    expect(track).toHaveStyle(outline);
  } else {
    expect(track).not.toHaveStyle(outline);
  }
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Switch render', () => {
  it('renders on', async () => {
    expect(
      (
        await render(<Switch value onValueChange={jest.fn()} testID="switch" />)
      ).toJSON()
    ).toMatchSnapshot();
  });

  it('renders off', async () => {
    expect(
      (
        await render(<Switch value={false} onValueChange={jest.fn()} />)
      ).toJSON()
    ).toMatchSnapshot();
  });

  it('renders disabled on', async () => {
    expect(
      (await render(<Switch disabled value />)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders disabled off', async () => {
    expect(
      (await render(<Switch disabled value={false} />)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders with checked icon', async () => {
    expect(
      (
        await render(
          <Switch value checkedIcon="check" onValueChange={jest.fn()} />
        )
      ).toJSON()
    ).toMatchSnapshot();
  });

  it('renders with per-state icons', async () => {
    expect(
      (
        await render(
          <Switch
            value
            checkedIcon="check"
            uncheckedIcon="close"
            onValueChange={jest.fn()}
          />
        )
      ).toJSON()
    ).toMatchSnapshot();
  });
});

describe('Switch accessibility', () => {
  it('has switch role', async () => {
    await render(<Switch value={false} onValueChange={jest.fn()} />);

    expect(screen.getByRole('switch')).toBeOnTheScreen();
  });

  it('exposes a touch target meeting the 48dp minimum', async () => {
    await render(<Switch value={false} onValueChange={jest.fn()} />);

    expect(screen.getByRole('switch')).toHaveStyle({ width: 52, height: 48 });
  });
});

describe('Switch focus state', () => {
  it.each([
    {
      value: false,
      focusedHandle: colors.onSurfaceVariant,
      restingHandle: colors.outline,
    },
    {
      value: true,
      focusedHandle: colors.primaryContainer,
      restingHandle: colors.onPrimary,
    },
  ])(
    'renders keyboard focus feedback when value is $value and clears it on blur',
    async ({ value, focusedHandle, restingHandle }) => {
      await render(<Switch value={value} onValueChange={jest.fn()} />);

      await fireEvent(screen.getByRole('switch'), 'focus');
      await jest.runAllTimersAsync();

      expectFocusRing(true);
      expect(getLayers().stateLayer).toMatchObject({ opacity: 0.1 });
      expect(getLayers().handleFill).toMatchObject({
        backgroundColor: focusedHandle,
      });

      await fireEvent(screen.getByRole('switch'), 'blur');
      await jest.runAllTimersAsync();

      expectFocusRing(false);
      expect(getLayers().stateLayer).toMatchObject({ opacity: 0 });
      expect(getLayers().handleFill).toMatchObject({
        backgroundColor: restingHandle,
      });
    }
  );

  it('only shows focus feedback for keyboard focus on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<Switch value onValueChange={jest.fn()} />);

    await fireEvent(screen.getByRole('switch'), 'focus', {
      currentTarget: { matches: () => false },
    });
    await jest.runAllTimersAsync();
    expect(getLayers().stateLayer).toMatchObject({ opacity: 0 });

    await fireEvent(screen.getByRole('switch'), 'focus', {
      currentTarget: { matches: () => true },
    });
    await jest.runAllTimersAsync();
    expect(getLayers().stateLayer).toMatchObject({ opacity: 0.1 });
  });

  it('paints no focus feedback when a read-only switch receives focus on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<Switch value readOnly />);

    await fireEvent(screen.getByRole('switch'), 'focus', {
      currentTarget: { matches: () => true },
    });
    await jest.runAllTimersAsync();

    expectFocusRing(false);
    expect(getLayers().stateLayer).toMatchObject({ opacity: 0 });
    expect(getLayers().handleFill).toMatchObject({
      backgroundColor: colors.onPrimary,
    });
  });

  // On web the switch keeps DOM focus while it is not interactive, because
  // React Native Web only changes its `tabIndex` and ARIA state.
  it.each(['disabled', 'readOnly'] as const)(
    'shows focus feedback again on web when a focused switch stops being %s',
    async (prop) => {
      jest.replaceProperty(Platform, 'OS', 'web');
      const onValueChange = jest.fn();
      const view = await render(<Switch value onValueChange={onValueChange} />);

      await fireEvent(screen.getByRole('switch'), 'focus');
      await view.rerender(
        <Switch value onValueChange={onValueChange} {...{ [prop]: true }} />
      );
      await jest.runAllTimersAsync();
      expectFocusRing(false);
      expect(getLayers().stateLayer).toMatchObject({ opacity: 0 });

      await view.rerender(<Switch value onValueChange={onValueChange} />);
      await jest.runAllTimersAsync();

      expectFocusRing(true);
      expect(getLayers().stateLayer).toMatchObject({ opacity: 0.1 });
      expect(getLayers().handleFill).toMatchObject({
        backgroundColor: colors.primaryContainer,
      });
    }
  );

  it('keeps focus feedback hidden on web when the switch lost focus while read-only', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onValueChange = jest.fn();
    const view = await render(<Switch value onValueChange={onValueChange} />);

    await fireEvent(screen.getByRole('switch'), 'focus');
    await view.rerender(
      <Switch value onValueChange={onValueChange} readOnly />
    );
    await fireEvent(screen.getByRole('switch'), 'blur');
    await view.rerender(<Switch value onValueChange={onValueChange} />);
    await jest.runAllTimersAsync();

    expect(getLayers().stateLayer).toMatchObject({ opacity: 0 });
  });

  it('shows focus feedback on web once a switch focused while read-only becomes operable', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onValueChange = jest.fn();
    const view = await render(
      <Switch value onValueChange={onValueChange} readOnly />
    );

    await fireEvent(screen.getByRole('switch'), 'focus', {
      currentTarget: { matches: () => true },
    });
    await view.rerender(<Switch value onValueChange={onValueChange} />);
    await jest.runAllTimersAsync();

    expectFocusRing(true);
    expect(getLayers().stateLayer).toMatchObject({ opacity: 0.1 });
  });

  it.each(['disabled', 'readOnly'] as const)(
    'clears hover and press feedback when the switch becomes %s',
    async (prop) => {
      const onValueChange = jest.fn();
      const view = await render(<Switch value onValueChange={onValueChange} />);

      await fireEvent(screen.getByRole('switch'), 'hoverIn');
      await fireEvent(screen.getByRole('switch'), 'pressIn');
      await jest.runAllTimersAsync();
      expect(getLayers().handle).toMatchObject({ width: 28, height: 28 });

      await view.rerender(
        <Switch value onValueChange={onValueChange} {...{ [prop]: true }} />
      );
      await jest.runAllTimersAsync();
      await view.rerender(<Switch value onValueChange={onValueChange} />);
      await jest.runAllTimersAsync();

      expect(getLayers().stateLayer).toMatchObject({ opacity: 0 });
      expect(getLayers().handle).toMatchObject({ width: 24, height: 24 });
      expect(getLayers().handleFill).toMatchObject({
        backgroundColor: colors.onPrimary,
      });
    }
  );
});

describe('Switch operability', () => {
  it('warns when it is given no way to be operated', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(<Switch value />);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('onValueChange')
    );
  });

  it.each(['readOnly', 'disabled'] as const)(
    'does not warn when %s is set without onValueChange',
    async (prop) => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      await render(<Switch value {...{ [prop]: true }} />);

      expect(console.warn).not.toHaveBeenCalledWith(
        expect.stringContaining('Switch:')
      );
    }
  );

  it('is not focusable when it has no way to be operated', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(<Switch value />);

    expect(screen.getByRole('switch')).toHaveProp('tabIndex', -1);
  });

  describe.each(['ios', 'android', 'web'] as const)('%s', (platform) => {
    it.each([
      { value: false, restingHandle: colors.outline },
      { value: true, restingHandle: colors.onPrimary },
    ])(
      'exposes a read-only switch with value $value as non-operable',
      async ({ value, restingHandle }) => {
        jest.replaceProperty(Platform, 'OS', platform);
        const view = await render(
          <Switch value={value} onValueChange={jest.fn()} />
        );
        await view.rerender(
          <Switch
            value={value}
            readOnly
            disabled={false}
            aria-label="Dark theme"
          />
        );
        await jest.runAllTimersAsync();

        const control = screen.getByRole('switch', {
          name: 'Dark theme',
          checked: value,
          disabled: platform !== 'web',
        });
        expect(control).toHaveProp('tabIndex', -1);
        expect(getLayers().handleFill).toMatchObject({
          backgroundColor: restingHandle,
          opacity: 1,
        });
        expect(control).toBeOnTheScreen();
      }
    );

    it('marks a missing-handler fallback as non-operable', async () => {
      jest.replaceProperty(Platform, 'OS', platform);
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      await render(<Switch value disabled={false} />);
      const control = screen.getByRole('switch', {
        checked: true,
        disabled: platform !== 'web',
      });

      expect(control).toHaveProp('tabIndex', -1);
      expect(control).toBeOnTheScreen();
    });

    it('passes a press on a read-only switch to the row that owns it', async () => {
      jest.replaceProperty(Platform, 'OS', platform);
      const user = userEvent.setup();
      const onRowPress = jest.fn();
      await render(
        <Pressable onPress={onRowPress}>
          <Switch value readOnly />
        </Pressable>
      );

      await user.press(screen.getByRole('switch'));

      expect(onRowPress).toHaveBeenCalledTimes(1);
    });

    it('keeps disabled semantics when read-only is also set', async () => {
      jest.replaceProperty(Platform, 'OS', platform);
      await render(<Switch value disabled readOnly />);

      expect(screen.getByRole('switch')).toBeDisabled();
      expect(screen.getByRole('switch')).not.toHaveProp('aria-readonly');
    });
  });

  it('toggles an operable switch inside a pressable row on web without pressing the row', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const onRowPress = jest.fn();
    await render(
      <Pressable onPress={onRowPress}>
        <Switch value onValueChange={onValueChange} />
      </Pressable>
    );

    await user.press(screen.getByRole('switch'));

    expect(onValueChange).toHaveBeenCalledWith(false);
    expect(onRowPress).not.toHaveBeenCalled();
  });

  it('exposes the read-only state on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<Switch value readOnly />);

    expect(screen.getByRole('switch')).toHaveProp('aria-readonly', true);
    expect(screen.getByRole('switch')).toBeEnabled();
  });

  it('does not expose aria-readonly on an operable switch on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<Switch value onValueChange={() => {}} />);

    expect(screen.getByRole('switch')).not.toHaveProp('aria-readonly');
  });

  it('hides the browser focus outline on a read-only switch on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(<Switch value readOnly />);

    expect(screen.getByRole('switch')).toHaveStyle(webNoOutlineStyle);
  });

  it('exposes a missing-handler fallback as read-only on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(<Switch value />);

    expect(screen.getByRole('switch')).toHaveProp('aria-readonly', true);
  });

  it('allows activation after read-only is turned off', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const view = await render(
      <Switch value readOnly onValueChange={onValueChange} />
    );

    await user.press(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();

    await view.rerender(
      <Switch value readOnly={false} onValueChange={onValueChange} />
    );

    expect(screen.getByRole('switch')).toBeEnabled();
    expect(screen.getByRole('switch')).toHaveProp('tabIndex', 0);
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  describe.each(['ios', 'android', 'web'] as const)(
    'hidden on %s',
    (platform) => {
      it.each(['readOnly', 'disabled'] as const)(
        'renders a %s switch with aria-hidden with no role or tabIndex',
        async (prop) => {
          jest.replaceProperty(Platform, 'OS', platform);
          await render(
            <Switch value {...{ [prop]: true }} aria-hidden testID="switch" />
          );

          const wrapper = screen.getByTestId('switch', {
            includeHiddenElements: true,
          });
          expect(wrapper).toHaveProp('aria-hidden', true);
          expect(
            screen.queryByRole('switch', { includeHiddenElements: true })
          ).toBeNull();
          expect(wrapper).not.toHaveProp('tabIndex');
        }
      );

      it('passes a press on a hidden switch to the row that owns it', async () => {
        jest.replaceProperty(Platform, 'OS', platform);
        const user = userEvent.setup();
        const onRowPress = jest.fn();
        await render(
          <Pressable onPress={onRowPress} role="switch" aria-checked>
            <Switch value readOnly aria-hidden />
          </Pressable>
        );

        await user.press(screen.getByRole('switch'));

        expect(onRowPress).toHaveBeenCalledTimes(1);
        expect(screen.getAllByRole('switch')).toHaveLength(1);
      });
    }
  );

  it('ignores aria-hidden on an interactive switch', async () => {
    await render(<Switch value onValueChange={jest.fn()} aria-hidden />);

    expect(screen.getByRole('switch')).toHaveProp('tabIndex', 0);
  });

  it('keeps an interactive switch focusable', async () => {
    await render(<Switch value onValueChange={jest.fn()} />);

    expect(screen.getByRole('switch')).toHaveProp('tabIndex', 0);
  });
});

describe('Switch press feedback', () => {
  it.each([
    { value: false, restingSize: 16 },
    { value: true, restingSize: 24 },
  ])(
    'grows immediately when value is $value and returns to rest on release',
    async ({ value, restingSize }) => {
      await render(<Switch value={value} onValueChange={jest.fn()} />);

      await fireEvent(screen.getByRole('switch'), 'pressIn');
      // Two frames, before the previous 100ms growth delay would elapse.
      jest.advanceTimersByTime(32);
      expect(getLayers().handle.width).toBeGreaterThan(restingSize);

      await jest.runAllTimersAsync();
      expect(getLayers().handle).toMatchObject({ width: 28, height: 28 });

      await fireEvent(screen.getByRole('switch'), 'pressOut');
      await jest.runAllTimersAsync();
      expect(getLayers().handle).toMatchObject({
        width: restingSize,
        height: restingSize,
      });
    }
  );
});

describe('Switch keyboard interaction on web', () => {
  it.each([false, true])(
    'toggles once on Space release when value is %s',
    async (value) => {
      jest.replaceProperty(Platform, 'OS', 'web');
      const onValueChange = jest.fn();
      const preventDefault = jest.fn();
      await render(<Switch value={value} onValueChange={onValueChange} />);
      const control = screen.getByRole('switch');

      await fireEvent(control, 'keyDown', {
        nativeEvent: { key: ' ' },
        preventDefault,
      });
      await fireEvent(control, 'keyDown', {
        nativeEvent: { key: ' ', repeat: true },
        preventDefault,
      });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalledTimes(2);

      await fireEvent(control, 'keyUp', {
        nativeEvent: { key: ' ' },
        preventDefault,
      });
      await fireEvent(control, 'keyUp', {
        nativeEvent: { key: ' ' },
        preventDefault,
      });
      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith(!value);
    }
  );

  it('cancels Space activation when focus leaves the switch', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onValueChange = jest.fn();
    const event = { nativeEvent: { key: ' ' }, preventDefault: jest.fn() };
    await render(<Switch value onValueChange={onValueChange} />);

    await fireEvent(screen.getByRole('switch'), 'keyDown', event);
    await fireEvent(screen.getByRole('switch'), 'blur');
    await fireEvent(screen.getByRole('switch'), 'keyUp', event);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each(['readOnly', 'disabled'] as const)(
    'cancels Space activation when the switch becomes %s',
    async (prop) => {
      jest.replaceProperty(Platform, 'OS', 'web');
      const onValueChange = jest.fn();
      const event = { nativeEvent: { key: ' ' }, preventDefault: jest.fn() };
      const view = await render(<Switch value onValueChange={onValueChange} />);

      await fireEvent(screen.getByRole('switch'), 'keyDown', event);
      await view.rerender(
        <Switch value onValueChange={onValueChange} {...{ [prop]: true }} />
      );
      await fireEvent(screen.getByRole('switch'), 'keyUp', event);
      await fireEvent(screen.getByRole('switch'), 'keyDown', event);
      await fireEvent(screen.getByRole('switch'), 'keyUp', event);
      expect(onValueChange).not.toHaveBeenCalled();

      await view.rerender(<Switch value onValueChange={onValueChange} />);
      await fireEvent(screen.getByRole('switch'), 'keyUp', event);
      expect(onValueChange).not.toHaveBeenCalled();
    }
  );
});

describe('Switch interaction', () => {
  it('toggles to true when off and pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(<Switch value={false} onValueChange={onValueChange} />);
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('toggles to false when on and pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(<Switch value onValueChange={onValueChange} />);
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('does not toggle a read-only switch that still has a handler', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    // The props type permits this pairing, so read-only has to win at runtime.
    await render(
      <Switch value={false} readOnly onValueChange={onValueChange} />
    );

    await user.press(screen.getByRole('switch'));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not fire onValueChange when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(
      <Switch value={false} disabled onValueChange={onValueChange} />
    );
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
