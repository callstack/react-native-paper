import * as React from 'react';
import renderer from 'react-test-renderer';
import ToggleButton from '../ToggleButton/ToggleButton.tsx';

it('renders toggle button', () => {
  const tree = renderer
    .create(<ToggleButton status="checked" onPress={() => {}} icon="heart" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled toggle button', () => {
  const tree = renderer
    .create(
      <ToggleButton
        disabled
        value="toggle"
        status="checked"
        onValueChange={() => {}}
        icon="heart"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked toggle button', () => {
  const tree = renderer
    .create(
      <ToggleButton
        disabled
        status="unchecked"
        onValueChange={() => {}}
        icon="heart"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
