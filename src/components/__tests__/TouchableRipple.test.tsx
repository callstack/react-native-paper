import { Platform, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

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

    it('takes the shape of the touchable so it does not square off the corners', async () => {
      const { toJSON } = await render(
        <TouchableRipple testOnly_pressed borderRadius={4}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(toJSON()).toMatchSnapshot();
    });

    it('takes per-corner radii too', async () => {
      const { toJSON } = await render(
        <TouchableRipple
          testOnly_pressed
          borderTopLeftRadius={8}
          borderBottomRightRadius={2}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(toJSON()).toMatchSnapshot();
    });
  });

  describe('hitSlop', () => {
    // hitSlop has no user-visible effect here, the renderer does not lay views
    // out or hit-test them. This only stops the prop being dropped.
    /* eslint-disable no-restricted-syntax */
    const hitSlopOf = () => screen.getByTestId('touchable').props.hitSlop;
    /* eslint-enable no-restricted-syntax */

    it('is not enforced or defaulted: the primitive does not measure', async () => {
      await render(
        <TouchableRipple testID="touchable" onPress={() => {}}>
          <Text>Button</Text>
        </TouchableRipple>
      );

      expect(hitSlopOf()).toBeUndefined();
    });

    it('passes a caller-supplied hitSlop straight through', async () => {
      await render(
        <TouchableRipple
          testID="touchable"
          onPress={() => {}}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text>Button</Text>
        </TouchableRipple>
      );

      expect(hitSlopOf()).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
    });

    it('still calls a caller-supplied onLayout', async () => {
      const onLayout = jest.fn();
      await render(
        <TouchableRipple
          testID="touchable"
          onPress={() => {}}
          onLayout={onLayout}
        >
          <Text>Button</Text>
        </TouchableRipple>
      );

      await act(async () => {
        await fireEvent(screen.getByTestId('touchable'), 'layout', {
          nativeEvent: { layout: { width: 32, height: 32, x: 0, y: 0 } },
        });
      });

      expect(onLayout).toHaveBeenCalledTimes(1);
    });
  });
});
