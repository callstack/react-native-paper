import { Platform, PlatformColor, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { Palette } from '../../theme/tokens';
import type { PressableProps } from '../TouchableRipple/Pressable';
import TouchableRipple from '../TouchableRipple/TouchableRipple.native';

const mockPressable = {
  currentProps: null as PressableProps | null,
  getCurrentProps(): PressableProps | null {
    return this.currentProps;
  },
};

jest.mock('../TouchableRipple/Pressable', () => {
  const React = require('react');
  const actual = jest.requireActual<
    typeof import('../TouchableRipple/Pressable')
  >('../TouchableRipple/Pressable');
  const ActualPressable = actual.Pressable;
  const MockPressable = React.forwardRef(
    (props: PressableProps, ref: React.ForwardedRef<unknown>) => {
      mockPressable.currentProps = props;
      return React.createElement(ActualPressable, { ...props, ref });
    }
  );
  return {
    ...actual,
    Pressable: MockPressable,
  };
});

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

    it('applies the pressed state-layer opacity to the underlay by default', async () => {
      await render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = screen.getByTestId('touchable-ripple-underlay');
      expect(underlay).toHaveStyle({ opacity: 0.1 });
    });

    it('does not apply the pressed state-layer opacity when explicit underlayColor is provided', async () => {
      await render(
        <TouchableRipple testOnly_pressed underlayColor="purple">
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = screen.getByTestId('touchable-ripple-underlay');
      expect(underlay).toHaveStyle({ backgroundColor: 'purple' });
      expect(underlay).not.toHaveStyle({ opacity: 0.1 });
    });
  });

  describe('on Android', () => {
    const originalOS = Platform.OS;
    const originalSupported = TouchableRipple.supported;

    beforeAll(() => {
      Platform.OS = 'android';
      TouchableRipple.supported = true;
    });

    afterAll(() => {
      Platform.OS = originalOS;
      TouchableRipple.supported = originalSupported;
    });

    const getAndroidRipple = async (element: React.ReactElement) => {
      mockPressable.currentProps = null;
      await render(element);
      return mockPressable.getCurrentProps()?.android_ripple;
    };

    it('builds the ripple config with the pressed state-layer opacity', async () => {
      const ripple = await getAndroidRipple(
        <TouchableRipple
          testID="ripple-touchable"
          onPress={() => {}}
          rippleColor="red"
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toMatchObject({
        color: 'red',
        borderless: false,
        alpha: 0.1,
      });
    });

    it('fills the pressed opacity into a custom background that has no alpha', async () => {
      const ripple = await getAndroidRipple(
        <TouchableRipple
          testID="ripple-touchable"
          onPress={() => {}}
          background={{ color: 'red' }}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toEqual({ color: 'red', alpha: 0.1 });
    });

    it('lets a custom background keep its own alpha', async () => {
      const ripple = await getAndroidRipple(
        <TouchableRipple
          testID="ripple-touchable"
          onPress={() => {}}
          background={{ color: 'red', alpha: 0.5 }}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toEqual({ color: 'red', alpha: 0.5 });
    });

    it('falls back to reference neutral color when theme onSurface is a PlatformColor', async () => {
      const ripple = await getAndroidRipple(
        <TouchableRipple
          testID="ripple-touchable"
          onPress={() => {}}
          theme={{
            colors: {
              onSurface: PlatformColor(
                '@android:color/system_on_surface_light'
              ),
            },
          }}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toMatchObject({
        color: Palette.neutral10,
        alpha: 0.1,
      });
    });

    it('falls back to reference neutral color when custom background has a PlatformColor', async () => {
      const ripple = await getAndroidRipple(
        <TouchableRipple
          testID="ripple-touchable"
          onPress={() => {}}
          background={{
            color: PlatformColor('@android:color/system_on_surface_light'),
          }}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toEqual({
        color: Palette.neutral10,
        alpha: 0.1,
      });
    });
  });
});
