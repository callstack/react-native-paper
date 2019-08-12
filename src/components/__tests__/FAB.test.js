import * as React from 'react';
import renderer from 'react-test-renderer';
import FAB from '../FAB/FAB.tsx';

it('renders normal FAB', () => {
  const tree = renderer.create(<FAB onPress={() => {}} icon="plus" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders small FAB', () => {
  const tree = renderer
    .create(<FAB small onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extended FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" label="Add items" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
