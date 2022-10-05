import React from 'react';
import { View } from 'react-native';

import renderer from 'react-test-renderer';

import DrawerSection from '../../Drawer/DrawerSection.tsx';

describe('DrawerSection', () => {
  it('renders properly', () => {
    const tree = renderer
      .create(
        <DrawerSection>
          <View />
        </DrawerSection>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
