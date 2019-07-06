import * as React from 'react';
import renderer from 'react-test-renderer';
import Switch from '../Switch.tsx';
import { pink500 } from '../../styles/colors.tsx';

it('renders on switch', () => {
  const tree = renderer.create(<Switch value />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders off switch', () => {
  const tree = renderer.create(<Switch value={false} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled switch', () => {
  const tree = renderer.create(<Switch disabled value />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders switch with color', () => {
  const tree = renderer.create(<Switch value color={pink500} />).toJSON();

  expect(tree).toMatchSnapshot();
});
