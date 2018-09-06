/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import * as Avatar from '../Avatar/Avatar';

it('renders avatar with text', () => {
  const tree = renderer.create(<Avatar.Text label="JD" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom size', () => {
  const tree = renderer.create(<Avatar.Text size={96} label="JD" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom background color', () => {
  const tree = renderer
    .create(<Avatar.Text backgroundColor="#FF0000" label="JD" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with text and custom colors', () => {
  const tree = renderer
    .create(
      <Avatar.Text backgroundColor="#FF0000" color="#FFFFFF" label="JD" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with icon', () => {
  const tree = renderer.create(<Avatar.Icon icon="info" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders avatar with image', () => {
  const tree = renderer
    .create(<Avatar.Image source={{ src: 'avatar.png' }} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
