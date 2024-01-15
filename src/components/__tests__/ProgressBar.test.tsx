import * as React from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

import { render, waitFor } from '@testing-library/react-native';

import ProgressBar, { Props } from '../ProgressBar';

const layoutEvent = {
  nativeEvent: {
    layout: {
      width: 100,
    },
  },
};

const styles = StyleSheet.create({
  fill: {
    borderRadius: 4,
  },
});

const a11yRole = 'progressbar';

class ClassProgressBar extends React.Component<Props> {
  render() {
    return <ProgressBar {...this.props} />;
  }
}

const AnimatedProgressBar = Animated.createAnimatedComponent(ClassProgressBar);

afterEach(() => {
  Platform.OS = 'ios';
});

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

it('renders progress bar with full height on web', () => {
  Platform.OS = 'web';
  const tree = render(<ProgressBar progress={0.2} />);

  expect(tree.getByRole(a11yRole)).toHaveStyle({
    width: '100%',
    height: '100%',
  });
});

it('renders progress bar with custom style of filled part', async () => {
  const tree = render(
    <ProgressBar progress={0.2} fillStyle={styles.fill} testID="progress-bar" />
  );
  await waitFor(() => tree.getByRole(a11yRole).props.onLayout(layoutEvent));

  expect(tree.getByTestId('progress-bar-fill')).toHaveStyle({
    borderRadius: 4,
  });
});
