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

  it('debounces onPress when debounce prop is provided', () => {
    jest.useFakeTimers();
    const onPress = jest.fn();
    const { getByText } = render(
      <TouchableRipple onPress={onPress} debounce={300}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    const button = getByText('Button');
    
    // Press multiple times rapidly
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    // Should only be called once due to debouncing
    expect(onPress).toHaveBeenCalledTimes(1);

    // Fast forward time past debounce window
    jest.advanceTimersByTime(400);

    // Now pressing should work again
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(2);

    jest.useRealTimers();
  });

  it('does not debounce when debounce is not provided', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <TouchableRipple onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    const button = getByText('Button');
    
    // Press multiple times rapidly
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);

    // Should be called for each press
    expect(onPress).toHaveBeenCalledTimes(3);
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
