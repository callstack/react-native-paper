import { Platform, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

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

  it('is not exposed as a control when no touch handler is passed', async () => {
    await render(
      <TouchableRipple testID="plain">
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    const plain = screen.getByTestId('plain');

    expect(plain).not.toBeDisabled();
    // no Pressable underneath, so nothing claims the touch. A responder here
    // would swallow taps meant for whatever wraps this, e.g. TextInput's
    // press to focus.
    expect(plain).not.toHaveProp('onStartShouldSetResponder');
    expect(plain).toHaveProp('focusable', false);
  });

  it('stays a disabled control when the disabled prop is passed', async () => {
    await render(
      <TouchableRipple testID="off" disabled onPress={() => {}}>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    const off = screen.getByTestId('off');

    expect(off).toBeDisabled();
    expect(off).toHaveProp('focusable', true);
    expect(off).toHaveProp('onStartShouldSetResponder');
  });

  it('does not show press feedback when no touch handler is passed', async () => {
    await render(
      <TouchableRipple testOnly_pressed>
        <Text>Not a button</Text>
      </TouchableRipple>
    );

    expect(
      screen.queryByTestId('touchable-ripple-underlay')
    ).not.toBeOnTheScreen();
  });

  it('does not show press feedback on a disabled control', async () => {
    // this one reaches the underlay branch, unlike the handler-less case above
    // which returns a plain View before that subtree is ever built
    await render(
      <TouchableRipple testOnly_pressed disabled onPress={() => {}}>
        <Text>Disabled</Text>
      </TouchableRipple>
    );

    expect(
      screen.queryByTestId('touchable-ripple-underlay')
    ).not.toBeOnTheScreen();
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
        <TouchableRipple testOnly_pressed>
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
