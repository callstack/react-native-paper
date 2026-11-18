import { View } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render } from '../../../test-utils';
import DrawerSection from '../../Drawer/DrawerSection';

describe('DrawerSection', () => {
  it('renders properly', async () => {
    const tree = (
      await render(
        <DrawerSection>
          <View />
        </DrawerSection>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
