import * as React from 'react';
import { Image } from 'react-native';

import renderer from 'react-test-renderer';

import Banner from '../Banner.tsx';

it('renders hidden banner, without action buttons and without image', () => {
  const tree = renderer
    .create(
      <Banner visible={false}>
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
      <Banner visible>
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
            accessibilityIgnoresInvertColors
          />
        )}
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
            accessibilityIgnoresInvertColors
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

it('render visible banner, with custom theme', () => {
  const tree = renderer
    .create(
      <Banner
        visible
        theme={{
          colors: {
            text: '#00f',
            surface: '#ccc',
            primary: '#043',
          },
        }}
        actions={[{ label: 'first', onPress: () => {} }]}
      >
        Custom theme
      </Banner>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
