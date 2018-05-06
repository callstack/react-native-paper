/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import Snackbar from '../Snackbar';
import PortalHost from '../Portal/PortalHost';

jest.useFakeTimers();

it('renders snackbar with content', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <Snackbar visible onDismiss={jest.fn()}>
          Snackbar content
        </Snackbar>
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible snackbar with content', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <Snackbar visible={false} onDismiss={jest.fn()}>
          Snackbar content
        </Snackbar>
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with Text as a child', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <Snackbar visible onDismiss={jest.fn()}>
          <Text>Snackbar content</Text>
        </Snackbar>
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders snackbar with action button', () => {
  const tree = renderer
    .create(
      <PortalHost>
        <Snackbar
          visible
          onDismiss={() => {}}
          action={{ label: 'Undo', onPress: jest.fn() }}
        >
          Snackbar content
        </Snackbar>
      </PortalHost>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
