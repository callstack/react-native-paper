import * as React from 'react';
import { View } from 'react-native';
import { act } from '@testing-library/react-native';
import renderer from 'react-test-renderer';
import ProgressBar from '../ProgressBar.tsx';

const layoutEvent = {
  nativeEvent: {
    layout: {
      width: 100,
    },
  },
};

it('renders progress bar with specific progress', () => {
  const tree = renderer.create(<ProgressBar progress={0.2} />);
  act(() => {
    tree.root.findByType(View).props.onLayout(layoutEvent);
  });

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders hidden progress bar', () => {
  const tree = renderer.create(<ProgressBar progress={0.2} visible={false} />);
  act(() => {
    tree.root.findByType(View).props.onLayout(layoutEvent);
  });

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders colored progress bar', () => {
  const tree = renderer.create(<ProgressBar progress={0.2} color="red" />);
  act(() => {
    tree.root.findByType(View).props.onLayout(layoutEvent);
  });

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders indeterminate progress bar', () => {
  const tree = renderer.create(<ProgressBar indeterminate />);
  act(() => {
    tree.root.findByType(View).props.onLayout(layoutEvent);
  });
  expect(tree.toJSON()).toMatchSnapshot();
});
