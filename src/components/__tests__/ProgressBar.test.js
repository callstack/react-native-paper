import * as React from 'react';
import { View } from 'react-native';
import renderer from 'react-test-renderer';
import ProgressBar from '../ProgressBar.tsx';

jest.useFakeTimers();

const layoutEvent = {
  nativeEvent: {
    layout: {
      width: 100,
    },
  },
};

it('renders progress bar with specific progress', () => {
  const tree = renderer.create(<ProgressBar progress={0.2} />);
  tree.root.findByType(View).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders hidden progress bar', () => {
  const tree = renderer.create(<ProgressBar progress={0.2} visible={false} />);
  tree.root.findByType(View).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders colored progress bar', () => {
  const tree = renderer.create(<ProgressBar progress={0.2} color="red" />);
  tree.root.findByType(View).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders indeterminate progress bar', () => {
  const tree = renderer.create(<ProgressBar indeterminate />);
  tree.root.findByType(View).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});
