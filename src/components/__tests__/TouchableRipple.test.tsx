import { Platform, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { act, fireEvent, render, screen } from '../../test-utils';
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

  const createResponderEvent = () => ({
    persist: () => {},
    nativeEvent: { timestamp: Date.now() },
    currentTarget: {
      measure: (callback: any) => {
        callback(0, 0, 100, 100, 0, 0);
      },
    },
  });

  it('suppresses onPressIn when touch is terminated before unstable_pressDelay', async () => {
    const onPressIn = jest.fn();
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();

    await render(
      <TouchableRipple
        testID="delay-ripple"
        unstable_pressDelay={100}
        onPressIn={onPressIn}
        onPress={onPress}
      >
        <Text>Button</Text>
      </TouchableRipple>
    );

    const button = screen.getByTestId('delay-ripple');

    await fireEvent(button, 'responderGrant', createResponderEvent());
    await act(() => {
      jest.advanceTimersByTime(50);
    });
    await fireEvent(button, 'responderTerminate', createResponderEvent());
    await act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(onPressIn).not.toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('triggers onPressIn after unstable_pressDelay when touch is not terminated', async () => {
    const onPressIn = jest.fn();
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();

    await render(
      <TouchableRipple
        testID="delay-ripple"
        unstable_pressDelay={100}
        onPressIn={onPressIn}
        onPress={onPress}
      >
        <Text>Button</Text>
      </TouchableRipple>
    );

    const button = screen.getByTestId('delay-ripple');

    await fireEvent(button, 'responderGrant', createResponderEvent());
    expect(onPressIn).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(onPressIn).toHaveBeenCalledTimes(1);

    await fireEvent(button, 'responderRelease', createResponderEvent());
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe('on iOS', () => {
    Platform.OS = 'ios';

    it('displays the underlay when pressed', async () => {
      const { toJSON } = await render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('renders custom underlay color', async () => {
      const { toJSON } = await render(
        <TouchableRipple testOnly_pressed underlayColor="purple">
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });
});
