import * as React from 'react';
import { Animated } from 'react-native';

import { render, waitFor } from '@testing-library/react-native';

import ProgressBar from '../ProgressBar.tsx';

const layoutEvent = {
  nativeEvent: {
    layout: {
      width: 100,
    },
  },
};

const a11yRole = 'progressbar';

class ClassProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProgressBar {...this.props} />;
  }
}

const AnimatedProgressBar = Animated.createAnimatedComponent(ClassProgressBar);

it('renders progress bar with animated value', async () => {
  const tree = render(<AnimatedProgressBar animatedValue={0.2} />);
  await waitFor(() => tree.getByRole(a11yRole).props.onLayout(layoutEvent));

  tree.update(<AnimatedProgressBar animatedValue={0.4} />);

  expect(tree.container.props['animatedValue']).toBe(0.4);
});

it('renders progress bar with specific progress', async () => {
  const tree = render(<ProgressBar progress={0.2} />);
  await waitFor(() => tree.getByRole(a11yRole).props.onLayout(layoutEvent));

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders hidden progress bar', async () => {
  const tree = render(<ProgressBar progress={0.2} visible={false} />);
  await waitFor(() => tree.getByRole(a11yRole).props.onLayout(layoutEvent));

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders colored progress bar', async () => {
  const tree = render(<ProgressBar progress={0.2} color="red" />);
  await waitFor(() => tree.getByRole(a11yRole).props.onLayout(layoutEvent));

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders indeterminate progress bar', async () => {
  const tree = render(<ProgressBar indeterminate />);
  await waitFor(() => tree.getByRole(a11yRole).props.onLayout(layoutEvent));

  expect(tree.toJSON()).toMatchSnapshot();
});
