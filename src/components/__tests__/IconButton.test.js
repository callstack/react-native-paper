import * as React from 'react';
import renderer from 'react-test-renderer';
import IconButton from '../IconButton.tsx';
import { pink500 } from '../../styles/colors.tsx';

it('renders icon button by default', () => {
  const tree = renderer.create(<IconButton icon="camera" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with color', () => {
  const tree = renderer
    .create(<IconButton icon="camera" color={pink500} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with size', () => {
  const tree = renderer.create(<IconButton icon="camera" size={30} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled icon button', () => {
  const tree = renderer.create(<IconButton icon="camera" disabled />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon change animated', () => {
  const tree = renderer.create(<IconButton icon="camera" animated />).toJSON();

  expect(tree).toMatchSnapshot();
});
