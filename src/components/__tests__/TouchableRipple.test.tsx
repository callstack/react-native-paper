import React from 'react';
import { Platform, Text } from 'react-native';

import { render, fireEvent } from '@testing-library/react-native';

import TouchableRipple from '../TouchableRipple/TouchableRipple.native';

describe('TouchableRipple', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <TouchableRipple>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(getByText('Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TouchableRipple onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    fireEvent.press(getByText('Button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TouchableRipple disabled onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    fireEvent.press(getByText('Button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('supports children as a function', () => {
    const children = ({ pressed }: { pressed: boolean }) => (
      <Text>{pressed ? 'Pressed' : 'Button'}</Text>
    );

    const { getByText } = render(
      <TouchableRipple onPress={jest.fn()}>{children}</TouchableRipple>
    );

    expect(getByText('Button')).toBeTruthy();
  });

  it('supports style as a function', () => {
    const style = jest.fn(() => ({ opacity: 0.5 }));

    render(
      <TouchableRipple onPress={jest.fn()} style={style}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(style).toHaveBeenCalled();
  });

  describe('on iOS', () => {
    Platform.OS = 'ios';

    it('displays the underlay when pressed', () => {
      const { getByTestId } = render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = getByTestId('touchable-ripple-underlay');
      expect(underlay).toBeDefined();
    });

    it('renders custom underlay color', () => {
      const { getByTestId } = render(
        <TouchableRipple testOnly_pressed underlayColor="purple">
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = getByTestId('touchable-ripple-underlay');
      expect(underlay).toHaveStyle({ backgroundColor: 'purple' });
    });
  });

  describe('supported', () => {
    it.each([
      { os: 'android', version: 28, expected: true },
      { os: 'android', version: 20, expected: false },
      { os: 'ios', version: '17.0', expected: false },
    ])('is $expected on $os $version', ({ os, version, expected }) => {
      jest.isolateModules(() => {
        const { Platform: IsolatedPlatform } = require('react-native');
        IsolatedPlatform.OS = os;
        jest.spyOn(IsolatedPlatform, 'Version', 'get').mockReturnValue(version);

        const {
          default: NativeTouchableRipple,
        } = require('../TouchableRipple/TouchableRipple.native');

        expect(NativeTouchableRipple.supported).toBe(expected);
      });
    });

    it('is true on the web', () => {
      const {
        default: WebTouchableRipple,
      } = require('../TouchableRipple/TouchableRipple.tsx');

      expect(WebTouchableRipple.supported).toBe(true);
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

    it('draws the highlight underlay only without the native ripple', () => {
      const { queryByTestId } = render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(Boolean(queryByTestId('touchable-ripple-underlay'))).toBe(
        !supported
      );
    });

    it('supports children as a render function', () => {
      const { getByText } = render(
        <TouchableRipple>
          {({ pressed }) => <Text>{pressed ? 'pressed' : 'idle'}</Text>}
        </TouchableRipple>
      );

      expect(getByText('idle')).toBeTruthy();
    });

    it('passes the pressed state to the children render function', () => {
      const { getByText } = render(
        <TouchableRipple testOnly_pressed>
          {({ pressed }) => <Text>{pressed ? 'pressed' : 'idle'}</Text>}
        </TouchableRipple>
      );

      expect(getByText('pressed')).toBeTruthy();
    });

    it('applies the style returned by a style function', () => {
      const { getByTestId } = render(
        <TouchableRipple
          testID="touchable-ripple"
          testOnly_pressed
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(getByTestId('touchable-ripple')).toHaveStyle({ opacity: 0.5 });
    });

    it('keeps rendering element children with a style object', () => {
      const style = { opacity: 0.5 };
      const { getByText, getByTestId } = render(
        <TouchableRipple testID="touchable-ripple" style={style}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(getByText('Press me!')).toBeTruthy();
      expect(getByTestId('touchable-ripple')).toHaveStyle({ opacity: 0.5 });
    });

    it('passes a style function to Pressable only when style is one', () => {
      const style = { opacity: 0.5 };
      const { UNSAFE_getByProps } = render(
        <TouchableRipple style={style}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      // Without `onPress`, `Pressable` is the only element given `disabled`.
      const pressable = UNSAFE_getByProps({ disabled: true });

      expect(typeof pressable.props.style).not.toBe('function');
    });

    it('accepts a single child only, also from a render function', () => {
      const consoleError = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <TouchableRipple>
            {[<Text key="a">A</Text>, <Text key="b">B</Text>]}
          </TouchableRipple>
        )
      ).toThrow('React.Children.only');
      expect(() =>
        render(
          <TouchableRipple>
            {() => [<Text key="a">A</Text>, <Text key="b">B</Text>]}
          </TouchableRipple>
        )
      ).toThrow('React.Children.only');

      consoleError.mockRestore();
    });
  });
});
