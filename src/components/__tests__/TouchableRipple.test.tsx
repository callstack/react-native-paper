import React from 'react';
import { Platform, Text } from 'react-native';

import { fireEvent } from '@testing-library/react-native';

import { render } from '../../test-utils';
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

    it('applies the pressed state-layer opacity to the underlay by default', () => {
      const { getByTestId } = render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = getByTestId('touchable-ripple-underlay');
      expect(underlay).toHaveStyle({ opacity: 0.1 });
    });
  });

  describe('on Android', () => {
    // Force the ripple branch: `supported` lives on the inner render function
    // (`React.forwardRef`'s `.render`) and is computed from Platform at import.
    beforeAll(() => {
      Platform.OS = 'android';
      Platform.Version = 30;
      (TouchableRipple as any).render.supported = true;
    });

    afterAll(() => {
      Platform.OS = 'ios';
      (TouchableRipple as any).render.supported = false;
    });

    const getAndroidRipple = (element: React.ReactElement) => {
      const { container } = render(element);
      return container.findAll((node) => node.props.android_ripple != null)[0]
        .props.android_ripple;
    };

    it('builds the ripple config with the pressed state-layer opacity', () => {
      const ripple = getAndroidRipple(
        <TouchableRipple onPress={() => {}} rippleColor="red">
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toMatchObject({
        color: 'red',
        borderless: false,
        alpha: 0.1,
      });
    });

    it('fills the pressed opacity into a custom background that has no alpha', () => {
      const ripple = getAndroidRipple(
        <TouchableRipple onPress={() => {}} background={{ color: 'red' }}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toEqual({ color: 'red', alpha: 0.1 });
    });

    it('lets a custom background keep its own alpha', () => {
      const ripple = getAndroidRipple(
        <TouchableRipple
          onPress={() => {}}
          background={{ color: 'red', alpha: 0.5 }}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(ripple).toEqual({ color: 'red', alpha: 0.5 });
    });
  });
});
