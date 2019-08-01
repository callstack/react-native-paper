import * as React from 'react';
import renderer from 'react-test-renderer';
import Chip from '../Chip.tsx';

it('renders chip with onPress', () => {
  const tree = renderer
    .create(<Chip onPress={() => {}}>Example Chip</Chip>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with icon', () => {
  const tree = renderer
    .create(<Chip icon="information">Example Chip</Chip>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with close button', () => {
  const tree = renderer
    .create(
      <Chip icon="information" onClose={() => {}}>
        Example Chip
      </Chip>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined disabled chip', () => {
  const tree = renderer
    .create(
      <Chip mode="outlined" disabled>
        Example Chip
      </Chip>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders selected chip', () => {
  const tree = renderer.create(<Chip selected>Example Chip</Chip>).toJSON();

  expect(tree).toMatchSnapshot();
});
