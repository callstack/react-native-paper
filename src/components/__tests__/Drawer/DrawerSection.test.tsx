import React from 'react';
import { View } from 'react-native';

import { render } from '@testing-library/react-native';

import DrawerSection from '../../Drawer/DrawerSection';

describe('DrawerSection', () => {
  it('renders properly', () => {
    const tree = render(
      <DrawerSection>
        <View />
      </DrawerSection>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
