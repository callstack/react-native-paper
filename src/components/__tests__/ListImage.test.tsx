import { StyleSheet } from 'react-native';

import { expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
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
  await render(
    <ListImage
      variant="image"
      source={{ uri: 'https://www.someurl.com/apple' }}
    />
  );

  expect(screen.getByTestId(testID)).toHaveStyle(styles.image);
});

it('renders ListImage with `video` variant', async () => {
  await render(
    <ListImage
      variant="video"
      source={{ uri: 'https://www.someurl.com/apple' }}
    />
  );

  expect(screen.getByTestId(testID)).toHaveStyle(styles.video);
});
