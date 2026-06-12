import * as React from 'react';

import { act } from '@testing-library/react-native';

import { render } from '../../../../test-utils';
import LinearWavyProgressIndicator from '../LinearWavyProgressIndicator';

const a11yRole = 'progressbar';

const layoutEvent = {
  nativeEvent: { layout: { width: 100 } },
};

const triggerLayout = async (
  tree: ReturnType<typeof render>
): Promise<void> => {
  await act(async () => {
    tree.getByRole(a11yRole).props.onLayout(layoutEvent);
  });
};

it('renders determinate progress', async () => {
  const tree = render(<LinearWavyProgressIndicator progress={0.3} />);
  await triggerLayout(tree);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('resolves active, track and stop colors', async () => {
  const tree = render(
    <LinearWavyProgressIndicator
      progress={0.3}
      color="red"
      trackColor="blue"
      testID="pi"
    />
  );
  await triggerLayout(tree);

  expect(tree.getByTestId('pi-active').props.stroke).toBe('red');
  expect(tree.getByTestId('pi-track').props.stroke).toBe('blue');
  expect(tree.getByTestId('pi-stop').props.fill).toBe('red');
});

it('renders the active and track strokes and no stop dot when indeterminate', async () => {
  const tree = render(
    <LinearWavyProgressIndicator indeterminate testID="pi" />
  );
  await triggerLayout(tree);

  expect(tree.getByTestId('pi-track')).toBeTruthy();
  expect(tree.getByTestId('pi-active')).toBeTruthy();
  expect(tree.queryByTestId('pi-stop')).toBeNull();
  expect(tree.getByRole(a11yRole).props.accessibilityValue).toEqual({});
});

it('reports the determinate value', async () => {
  const tree = render(<LinearWavyProgressIndicator progress={0.42} />);
  await triggerLayout(tree);

  expect(tree.getByRole(a11yRole).props.accessibilityValue).toEqual({
    min: 0,
    max: 100,
    now: 42,
  });
});

it('is busy below 100% and not busy at 100% (determinate)', async () => {
  const partial = render(<LinearWavyProgressIndicator progress={0.5} />);
  await triggerLayout(partial);
  expect(partial.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: true,
  });

  const complete = render(<LinearWavyProgressIndicator progress={1} />);
  await triggerLayout(complete);
  expect(complete.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: false,
  });
});

it('is busy when indeterminate', async () => {
  const tree = render(<LinearWavyProgressIndicator indeterminate />);
  await triggerLayout(tree);

  expect(tree.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: true,
  });
});

it('shows the stop dot again when toggling indeterminate -> determinate', async () => {
  const tree = render(
    <LinearWavyProgressIndicator indeterminate testID="pi" />
  );
  await triggerLayout(tree);
  expect(tree.queryByTestId('pi-stop')).toBeNull();

  tree.rerender(<LinearWavyProgressIndicator progress={0.3} testID="pi" />);
  await triggerLayout(tree);

  expect(tree.getByTestId('pi-stop')).toBeTruthy();
});
