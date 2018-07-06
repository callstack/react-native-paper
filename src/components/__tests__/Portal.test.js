/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import Portal from '../Portal/Portal';

it('renders portal with siblings', () => {
  const tree = renderer
    .create(
      <Portal.Host>
        <Text>Outside content</Text>
        <Portal>
          <Text>Portal content</Text>
        </Portal>
      </Portal.Host>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
