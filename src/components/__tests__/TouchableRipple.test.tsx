import { Platform, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
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
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();
    const { getByText } = render(
      <TouchableRipple onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    fireEvent.press(getByText('Button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();
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
