import * as React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import type { GestureResponderEvent, Role } from 'react-native';

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import TouchableRipple from '../TouchableRipple/TouchableRipple.native';

describe('TouchableRipple', () => {
  it('renders children correctly', async () => {
    await render(
      <TouchableRipple>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByText('Button')).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();
    await render(
      <TouchableRipple onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await userEvent.press(screen.getByText('Button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', async () => {
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();
    await render(
      <TouchableRipple disabled onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await userEvent.press(screen.getByText('Button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('lets a press reach the parent when no touch handler is passed', async () => {
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await render(
      <Pressable onPress={onPress}>
        <TouchableRipple>
          <Text>Icon</Text>
        </TouchableRipple>
      </Pressable>
    );

    await userEvent.press(screen.getByText('Icon'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is reported as enabled with a touch handler, even with aria-disabled', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} aria-disabled>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('ripple')).not.toBeDisabled();
  });

  it('is not reported as disabled when no touch handler is passed', async () => {
    await render(
      <TouchableRipple testID="plain">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('plain')).not.toBeDisabled();
  });

  it('drops a button role when no touch handler is passed', async () => {
    await render(
      <TouchableRipple role="button" aria-label="Add item">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();

    // hiding the element instead would silence the label, which for an icon
    // only control is all it has to announce
    expect(screen.getByLabelText('Add item')).toBeOnTheScreen();
  });

  // `imagebutton` and `togglebutton` are legacy `accessibilityRole` values, not
  // `Role` values, so they are covered by the next test
  const activatableRoles: Role[] = ['link', 'menuitem', 'tab'];

  it.each(activatableRoles)(
    'drops the %s role too when no touch handler is passed',
    async (role) => {
      await render(
        <TouchableRipple role={role}>
          <Text>Not a control</Text>
        </TouchableRipple>
      );

      expect(screen.queryByRole(role)).not.toBeOnTheScreen();
    }
  );

  it.each(['button', 'imagebutton', 'togglebutton'] as const)(
    'drops a legacy %s accessibilityRole when no touch handler is passed',
    async (accessibilityRole) => {
      await render(
        <TouchableRipple testID="ripple" accessibilityRole={accessibilityRole}>
          <Text>Not a control</Text>
        </TouchableRipple>
      );

      expect(screen.queryByRole(accessibilityRole)).not.toBeOnTheScreen();
      // iOS reads role 'none' as no role and falls back to accessibilityRole,
      // so the legacy prop itself has to go
      expect(screen.getByTestId('ripple')).not.toHaveProp('accessibilityRole');
    }
  );

  it('resolves role ahead of accessibilityRole, as every platform does', async () => {
    await render(
      <TouchableRipple accessibilityRole="button" role="checkbox">
        <Text>Read only</Text>
      </TouchableRipple>
    );

    expect(screen.getByRole('checkbox')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('keeps a non button role when no touch handler is passed', async () => {
    await render(
      <TouchableRipple role="checkbox" aria-checked>
        <Text>Read only</Text>
      </TouchableRipple>
    );

    // reachable by role, so the element was kept, not hidden
    expect(screen.getByRole('checkbox', { checked: true })).toBeOnTheScreen();
  });

  // A toggle reports a state of its own, so the role reporting it stays even with
  // no handler: `Button` passes `aria-checked` for its `selected` prop. Reporting
  // it unchecked says "off", which is still saying "toggle".
  it.each([
    { state: 'aria-checked', prop: 'aria-checked', value: true },
    { state: 'aria-checked', prop: 'aria-checked', value: false },
    { state: 'aria-pressed', prop: 'aria-pressed', value: true },
    { state: 'aria-pressed', prop: 'aria-pressed', value: false },
    {
      state: 'a checked accessibilityState',
      prop: 'accessibilityState',
      value: { checked: true },
    },
  ])(
    'keeps a button role carrying $state when no touch handler is passed',
    async ({ prop, value }) => {
      await render(
        <TouchableRipple role="button" {...{ [prop]: value }}>
          <Text>Toggle</Text>
        </TouchableRipple>
      );

      expect(screen.getByRole('button')).toHaveProp(prop, value);
    }
  );

  // A selection is not a toggle state, so it doesn't keep the role. iOS and
  // Android still report a selection whatever the role, so it stays there.
  it.each([true, false])(
    'drops a button role carrying aria-selected of %s but keeps the flag when no touch handler is passed',
    async (value) => {
      await render(
        <TouchableRipple testID="plain" role="button" aria-selected={value}>
          <Text>Not a button</Text>
        </TouchableRipple>
      );

      expect(screen.queryByRole('button')).not.toBeOnTheScreen();
      expect(screen.getByTestId('plain')).toHaveProp('aria-selected', value);
    }
  );

  it('keeps the selection in an accessibilityState when it drops the role', async () => {
    await render(
      <TouchableRipple
        testID="plain"
        role="button"
        accessibilityState={{ selected: true, disabled: false }}
      >
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
    expect(screen.getByTestId('plain')).toBeSelected();
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    // `accessible` makes an Android view keyboard focusable, so a hardware
    // keyboard or D-pad would stop on something with nothing to activate
    it('is no keyboard stop but one screen reader element when no touch handler is passed', async () => {
      await render(
        <TouchableRipple testID="plain" aria-label="Info">
          <Text>Not a control</Text>
        </TouchableRipple>
      );

      const plain = screen.getByTestId('plain');

      expect(plain).toHaveProp('accessible', false);
      expect(plain).toHaveProp('screenReaderFocusable', true);
      // unlike `accessible`, screenReaderFocusable lets Fabric flatten the
      // children into the parent, which would split the element in two
      expect(plain).toHaveProp('collapsable', false);
    });

    it('is a keyboard stop when the consumer passes accessible', async () => {
      await render(
        <TouchableRipple testID="plain" accessible>
          <Text>Not a control</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('plain')).toHaveProp('accessible', true);
    });

    it('leaves the children to the screen reader when the consumer turns accessible off', async () => {
      await render(
        <TouchableRipple testID="plain" accessible={false}>
          <Text>Not a control</Text>
        </TouchableRipple>
      );

      const plain = screen.getByTestId('plain');

      expect(plain).toHaveProp('screenReaderFocusable', false);
      expect(plain).not.toHaveProp('collapsable');
    });
  });

  it('respects a focusable prop of its own', async () => {
    await render(
      <TouchableRipple testID="plain" role="button" focusable>
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId('plain')).toHaveProp('focusable', true);
  });

  it('keeps the button role on a disabled control', async () => {
    await render(
      <TouchableRipple role="button" disabled>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('stays a disabled control when the disabled prop is passed', async () => {
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await render(
      <TouchableRipple testID="off" disabled onPress={onPress}>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    const off = screen.getByTestId('off');

    expect(off).toBeDisabled();

    await userEvent.press(off);

    expect(onPress).not.toHaveBeenCalled();
  });

  it('keeps the element when toggling with disabled, and swaps it without a handler', async () => {
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    const { rerender } = await render(
      <TouchableRipple role="button" onPress={onPress}>
        <Text>Press me</Text>
      </TouchableRipple>
    );

    const enabled = screen.getByRole('button');

    // switching off with `disabled` keeps the same element, so a child that
    // holds focus or state is not remounted
    await rerender(
      <TouchableRipple role="button" disabled onPress={onPress}>
        <Text>Press me</Text>
      </TouchableRipple>
    );

    const off = screen.getByRole('button');

    expect(off).toBeDisabled();
    expect(off).toBe(enabled);

    // dropping the handler instead renders a plain view
    await rerender(
      <TouchableRipple role="button">
        <Text>Press me</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
    expect(screen.getByText('Press me')).not.toBeDisabled();
  });

  it('never reports a press when no touch handler is passed', async () => {
    // `testOnly_pressed` is what the platform reports for a press held down.
    // A handler-less ripple has nothing to press, so it keeps seeing idle.
    await render(
      <TouchableRipple testOnly_pressed>
        {({ pressed }) => <Text>{pressed ? 'pressed' : 'idle'}</Text>}
      </TouchableRipple>
    );

    expect(screen.getByText('idle')).toBeOnTheScreen();
  });

  it('does not show press feedback on a disabled control', async () => {
    // this one reaches the underlay branch, unlike the handler-less case above
    // which returns a plain View before that subtree is ever built
    const { toJSON } = await render(
      <TouchableRipple testOnly_pressed disabled onPress={() => {}}>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  describe('on iOS', () => {
    Platform.OS = 'ios';

    it('displays the underlay when pressed', async () => {
      const { toJSON } = await render(
        <TouchableRipple testOnly_pressed onPress={() => {}}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('renders custom underlay color', async () => {
      const { toJSON } = await render(
        <TouchableRipple
          testOnly_pressed
          underlayColor="purple"
          onPress={() => {}}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('hitSlop', () => {
    it('does not add its own hitSlop when none is supplied', async () => {
      const tree = (
        await render(
          <TouchableRipple onPress={() => {}}>
            <Text>Button</Text>
          </TouchableRipple>
        )
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    it('passes a caller-supplied hitSlop straight through', async () => {
      const tree = (
        await render(
          <TouchableRipple
            onPress={() => {}}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text>Button</Text>
          </TouchableRipple>
        )
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });

    // A touch in the slop goes to the view that owns it, so a slop on
    // something that can't be pressed takes touches from its neighbors
    it.each([
      { when: 'no touch handler is passed', props: {} },
      { when: 'it is disabled', props: { onPress: () => {}, disabled: true } },
    ])('takes no touches outside its bounds when $when', async ({ props }) => {
      await render(
        <TouchableRipple testID="ripple" hitSlop={16} {...props}>
          <Text>Not pressable</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('ripple')).not.toHaveProp('hitSlop');
    });
  });

  it('hands its ref to the view it renders when no touch handler is passed', async () => {
    const ref = React.createRef<React.ComponentRef<typeof View>>();
    await render(
      <TouchableRipple ref={ref}>
        <Text>Plain</Text>
      </TouchableRipple>
    );

    expect(ref.current).not.toBeNull();
  });

  // Both branches of the component need to behave the same, so the tests below
  // are run once with the native ripple effect enabled (Android >= Lollipop)
  // and once with the highlight fallback used everywhere else.
  describe.each([
    { supported: false, label: 'with the highlight fallback' },
    { supported: true, label: 'with the native ripple effect' },
  ])('$label', ({ supported }) => {
    const originalSupported = TouchableRipple.supported;

    beforeAll(() => {
      TouchableRipple.supported = supported;
    });

    afterAll(() => {
      TouchableRipple.supported = originalSupported;
    });

    it('renders more than one child, with and without a touch handler', async () => {
      const onPress = jest.fn<(e: GestureResponderEvent) => void>();
      const { rerender } = await render(
        <TouchableRipple>
          <Text>First</Text>
          <Text>Second</Text>
        </TouchableRipple>
      );

      expect(screen.getByText('First')).toBeOnTheScreen();
      expect(screen.getByText('Second')).toBeOnTheScreen();

      // the element a handler switches to has to keep the same children
      await rerender(
        <TouchableRipple onPress={onPress}>
          <Text>First</Text>
          <Text>Second</Text>
        </TouchableRipple>
      );

      expect(screen.getByText('First')).toBeOnTheScreen();
      expect(screen.getByText('Second')).toBeOnTheScreen();

      await userEvent.press(screen.getByText('Second'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('supports children as a render function', async () => {
      await render(
        <TouchableRipple>
          {({ pressed }) => <Text>{pressed ? 'pressed' : 'idle'}</Text>}
        </TouchableRipple>
      );

      expect(screen.getByText('idle')).toBeOnTheScreen();
    });

    it('passes the pressed state to the children render function', async () => {
      await render(
        <TouchableRipple testOnly_pressed onPress={() => {}}>
          {({ pressed }) => <Text>{pressed ? 'pressed' : 'idle'}</Text>}
        </TouchableRipple>
      );

      expect(screen.getByText('pressed')).toBeOnTheScreen();
    });

    it('applies the style returned by a style function', async () => {
      await render(
        <TouchableRipple
          testID="touchable-ripple"
          testOnly_pressed
          onPress={() => {}}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('touchable-ripple')).toHaveStyle({
        opacity: 0.5,
      });
    });

    it('keeps rendering element children with a style object', async () => {
      await render(
        <TouchableRipple testID="touchable-ripple" style={{ opacity: 0.5 }}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(screen.getByText('Press me!')).toBeOnTheScreen();
      expect(screen.getByTestId('touchable-ripple')).toHaveStyle({
        opacity: 0.5,
      });
    });
  });
});
