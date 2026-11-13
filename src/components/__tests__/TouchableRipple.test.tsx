import { Platform, Pressable, Text } from 'react-native';
import type { GestureResponderEvent, Role } from 'react-native';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
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

  // `imagebutton` is missing here because it is native only, absent from the
  // web `Role` union, so it arrives via `accessibilityRole` instead
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

  it('drops a native imagebutton accessibilityRole when no touch handler is passed', async () => {
    await render(
      <TouchableRipple accessibilityRole="imagebutton">
        <Text>Not a control</Text>
      </TouchableRipple>
    );

    expect(screen.queryByRole('imagebutton')).not.toBeOnTheScreen();
  });

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
