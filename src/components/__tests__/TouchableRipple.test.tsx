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
      await render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = screen.getByTestId('touchable-ripple-underlay');
      expect(underlay).toBeOnTheScreen();
    });

    it('renders custom underlay color', async () => {
      await render(
        <TouchableRipple testOnly_pressed underlayColor="purple">
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = screen.getByTestId('touchable-ripple-underlay');
      expect(underlay).toHaveStyle({ backgroundColor: 'purple' });
    });

    it('takes the shape of the touchable so it does not square off the corners', async () => {
      await render(
        <TouchableRipple testOnly_pressed style={{ borderRadius: 4 }}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('touchable-ripple-underlay')).toHaveStyle({
        borderRadius: 4,
      });
    });

    it('takes per-corner radii too', async () => {
      await render(
        <TouchableRipple
          testOnly_pressed
          style={[{ borderTopLeftRadius: 8 }, { borderBottomRightRadius: 2 }]}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('touchable-ripple-underlay')).toHaveStyle({
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 2,
      });
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

describe('TouchableRipple focus ring', () => {
  const focus = async () => {
    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'focus');
    });
  };

  it('rings on keyboard focus and clears on blur', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(screen.getByTestId('ripple')).toHaveStyle({
      outlineWidth: 3,
      outlineOffset: 2,
    });

    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'blur');
    });
    expect(screen.getByTestId('ripple')).not.toHaveStyle({ outlineWidth: 3 });
  });

  // Inward is opt-in, for controls a clipping ancestor would trim.
  it('draws the ring inward only when asked', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} focusRing="inward">
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(screen.getByTestId('ripple')).toHaveStyle({
      outlineWidth: 3,
      outlineOffset: -3,
    });
  });

  // The non-interactive case is covered in useFocusRing's own tests. It cannot
  // be asserted here: RNTL will not dispatch to a disabled element, so a
  // touchable with no press handler passes for free.
  it('does not ring when the ring is turned off', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} focusRing="none">
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(screen.getByTestId('ripple')).not.toHaveStyle({ outlineWidth: 3 });
  });

  it('still calls a caller onFocus', async () => {
    const onFocus = jest.fn();
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} onFocus={onFocus}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(onFocus).toHaveBeenCalled();
  });
});
