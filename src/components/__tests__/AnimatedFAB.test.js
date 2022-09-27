import * as React from 'react';

import renderer from 'react-test-renderer';

import AnimatedFAB from '../FAB/AnimatedFAB';

it('renders animated fab', () => {
  const tree = renderer
    .create(<AnimatedFAB onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated fab with label on the right by default', () => {
  const tree = renderer
    .create(
      <AnimatedFAB label="text" extended onPress={() => {}} icon="plus" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders animated fab with label on the left', () => {
  const tree = renderer
    .create(
      <AnimatedFAB
        label="text"
        extended
        animateFrom="left"
        onPress={() => {}}
        icon="plus"
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
