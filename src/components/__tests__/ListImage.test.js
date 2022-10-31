import * as React from 'react';
import { StyleSheet } from 'react-native';

import { render } from '@testing-library/react-native';

import ListImage from '../List/ListImage';

const styles = StyleSheet.create({
  image: {
    width: 56,
    height: 56,
  },
  video: {
    width: 114,
    height: 64,
    marginLeft: 0,
  },
  container: {
    width: 30,
    height: 56,
  },
});

const testID = 'list-image';

it('renders ListImage with default variant', () => {
  const tree = render(
    <ListImage
      source={require('../../../example/assets/images/strawberries.jpg')}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders ListImage with default variant & styles', () => {
  const tree = render(
    <ListImage
      source={require('../../../example/assets/images/strawberries.jpg')}
      style={styles.container}
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders ListImage with `image` variant', () => {
  const tree = render(
    <ListImage
      variant="image"
      source={{ uri: 'https://www.someurl.com/apple' }}
    />
  );

  expect(tree.container.props['variant']).toBe('image');
  expect(tree.getByTestId(testID)).toHaveStyle(styles.image);
});

it('renders ListImage with `video` variant', () => {
  const tree = render(
    <ListImage
      variant="video"
      source={{ uri: 'https://www.someurl.com/apple' }}
    />
  );

  expect(tree.container.props['variant']).toBe('video');
  expect(tree.getByTestId(testID)).toHaveStyle(styles.video);
});
