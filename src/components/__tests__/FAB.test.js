/* @flow */

import * as React from 'react';
import renderer from 'react-test-renderer';
import FAB from '../FAB/FAB';

it('renders normal FAB', () => {
  const tree = renderer.create(<FAB onPress={() => {}} icon="star" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders small FAB', () => {
  const tree = renderer
    .create(<FAB small onPress={() => {}} icon="star" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extended FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="star" label="Add items" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
