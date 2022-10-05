import * as React from 'react';

import renderer from 'react-test-renderer';

import Checkbox from '../../Checkbox';

it('renders checked Checkbox with onPress', () => {
  const tree = renderer
    .create(<Checkbox status="checked" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with onPress', () => {
  const tree = renderer
    .create(<Checkbox status="unchecked" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox', () => {
  const tree = renderer
    .create(<Checkbox status="indeterminate" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked Checkbox with color', () => {
  const tree = renderer
    .create(<Checkbox status="checked" color="red" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with color', () => {
  const tree = renderer
    .create(<Checkbox status="checked" color="red" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox with color', () => {
  const tree = renderer
    .create(<Checkbox status="indeterminate" color="red" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders Checkbox with custom testID', () => {
  const tree = renderer
    .create(<Checkbox status="checked" testID={'custom:testID'} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
