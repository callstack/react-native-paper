import * as React from 'react';
import { Animated } from 'react-native';

import { render } from '@testing-library/react-native';

import ProgressBar from '../ProgressBar.tsx';

const layoutEvent = {
  nativeEvent: {
    layout: {
      width: 100,
    },
  },
};

const a11Role = 'progressbar';

class ClassProgressBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <ProgressBar {...this.props} />;
  }
}

const AnimatedProgressBar = Animated.createAnimatedComponent(ClassProgressBar);

it('renders progress bar with animated value', () => {
  const tree = render(<AnimatedProgressBar animatedValue={0.2} />);

  const props = tree.getByRole(a11Role).props;
  props.onLayout(layoutEvent);

  tree.update(<AnimatedProgressBar animatedValue={0.4} />);

  expect(tree.container.props['animatedValue']).toBe(0.4);
});

it('renders progress bar with specific progress', () => {
  const tree = render(<ProgressBar progress={0.2} />);
  tree.getByRole(a11Role).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders hidden progress bar', () => {
  const tree = render(<ProgressBar progress={0.2} visible={false} />);
  tree.getByRole(a11Role).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders colored progress bar', () => {
  const tree = render(<ProgressBar progress={0.2} color="red" />);
  tree.getByRole(a11Role).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('renders indeterminate progress bar', () => {
  const tree = render(<ProgressBar indeterminate />);
  tree.getByRole(a11Role).props.onLayout(layoutEvent);

  expect(tree.toJSON()).toMatchSnapshot();
});
