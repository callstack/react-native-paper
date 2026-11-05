import { StyleSheet } from 'react-native';

import { expect, it } from '@jest/globals';

import { render } from '../../test-utils';
import ListImage from '../List/ListImage';

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 56,
  },
});

it('renders ListImage with default variant', async () => {
  const tree = (
    await render(
      <ListImage
        source={require('../../../example/assets/images/strawberries.jpg')}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders ListImage with default variant & styles', async () => {
  const tree = (
    await render(
      <ListImage
        source={require('../../../example/assets/images/strawberries.jpg')}
        style={styles.container}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders ListImage with `image` variant', async () => {
  const tree = (
    await render(
      <ListImage
        variant="image"
        source={{ uri: 'https://www.someurl.com/apple' }}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders ListImage with `video` variant', async () => {
  const tree = (
    await render(
      <ListImage
        variant="video"
        source={{ uri: 'https://www.someurl.com/apple' }}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});
