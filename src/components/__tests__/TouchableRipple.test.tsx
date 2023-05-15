import React from 'react';
import { Platform, Text } from 'react-native';

import { render } from '@testing-library/react-native';

import TouchableRipple from '../TouchableRipple/TouchableRipple';

describe('TouchableRipple', () => {
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
