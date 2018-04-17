/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import PortalHost from '../Portal/PortalHost';
import Portal from '../Portal/Portal';

it('renders portal with siblings', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <Text>Outside content</Text>
        <Portal>
          <Text>Portal content</Text>
        </Portal>
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
