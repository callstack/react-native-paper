import * as React from 'react';
import renderer from 'react-test-renderer';
import AnimatedFAB from '../FAB/AnimatedFAB';

it('renders animated fab', () => {
  const tree = renderer
    .create(<AnimatedFAB onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
