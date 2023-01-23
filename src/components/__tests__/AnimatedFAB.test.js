import * as React from 'react';
import { StyleSheet } from 'react-native';

import { render } from '@testing-library/react-native';
import renderer from 'react-test-renderer';

import { MD3Colors } from '../../styles/themes/v3/tokens';
import AnimatedFAB from '../FAB/AnimatedFAB';

const styles = StyleSheet.create({
  background: {
    backgroundColor: MD3Colors.tertiary50,
  },
});

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

it('renders animated fab with only transparent container', () => {
  const { getByTestId } = render(
    <AnimatedFAB
      label="text"
      animateFrom="left"
      onPress={() => {}}
      icon="plus"
      testID="animated-fab"
      style={styles.background}
    />
  );
  expect(getByTestId('animated-fab-container')).toHaveStyle({
    backgroundColor: 'transparent',
  });
});
