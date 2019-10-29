import * as React from 'react';
import renderer from 'react-test-renderer';
import * as Avatar from '../Avatar/Avatar.tsx';

it('renders avatar with text', () => {
  const tree = renderer.create(<Avatar.Text label="XD" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom size', () => {
  const tree = renderer.create(<Avatar.Text size={96} label="XD" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom background color', () => {
  const tree = renderer
    .create(<Avatar.Text style={{ backgroundColor: '#FF0000' }} label="XD" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom colors', () => {
  const tree = renderer
    .create(<Avatar.Text color="#FFFFFF" label="XD" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon', () => {
  const tree = renderer.create(<Avatar.Icon icon="information" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon and custom background color', () => {
  const tree = renderer
    .create(
      <Avatar.Icon style={{ backgroundColor: '#FF0000' }} icon="information" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with image', () => {
  const tree = renderer
    .create(<Avatar.Image source={{ src: 'avatar.png' }} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
