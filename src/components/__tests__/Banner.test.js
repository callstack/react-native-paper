/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import { Image } from 'react-native';
import Banner from '../Banner';

jest.useFakeTimers();

it('renders hidden banner, without action buttons and without image', () => {
  const tree = renderer
    .create(
      <Banner visible={false} actions={[]}>
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and without image', () => {
  const tree = renderer
    .create(
      <Banner visible actions={[]}>
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and without image', () => {
  const tree = renderer
    .create(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {} },
          { label: 'second', onPress: () => {} },
        ]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and with image', () => {
  const tree = renderer
    .create(
      <Banner
        visible
        image={({ size }) => (
          <Image
            source={{ uri: 'https://callstack.com/images/team/Satya.png' }}
            style={{ width: size, height: size }}
          />
        )}
        actions={[]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and with image', () => {
  const tree = renderer
    .create(
      <Banner
        visible
        image={({ size }) => (
          <Image
            source={{ uri: 'https://callstack.com/images/team/Satya.png' }}
            style={{ width: size, height: size }}
          />
        )}
        actions={[{ label: 'first', onPress: () => {} }]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
