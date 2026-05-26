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

  it('supports children as an array of nodes', () => {
    const { getByText } = render(
      <TouchableRipple onPress={jest.fn()}>
        {[<Text key="a">Button A</Text>, <Text key="b">Button B</Text>]}
      </TouchableRipple>
    );

    expect(getByText('Button A')).toBeTruthy();
    expect(getByText('Button B')).toBeTruthy();
  });

  it('supports function children returning an array of nodes', () => {
    const children = ({ pressed }: { pressed: boolean }) => [
      <Text key="a">{pressed ? 'Pressed A' : 'Button A'}</Text>,
      <Text key="b">{pressed ? 'Pressed B' : 'Button B'}</Text>,
    ];

    const { getByText } = render(
      <TouchableRipple onPress={jest.fn()}>{children}</TouchableRipple>
    );

    expect(getByText('Button A')).toBeTruthy();
    expect(getByText('Button B')).toBeTruthy();
  });

  it('supports style as a function', () => {
    const style = jest.fn(() => ({ opacity: 0.5 }));

    render(
      <TouchableRipple onPress={jest.fn()} style={style as any}>
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
});
