import { AccessibilityInfo, Text } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, render, screen } from '@testing-library/react-native';

import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import PaperProvider from '../PaperProvider';

let mockReducedMotionAtLaunch = false;

jest.mock('react-native-reanimated', () => ({
  ...jest.requireActual<object>('react-native-reanimated'),
  useReducedMotion: () => mockReducedMotionAtLaunch,
}));

const ReduceMotionProbe = () => {
  const reduceMotion = useReduceMotion();
  return <Text>{`reduceMotion: ${reduceMotion}`}</Text>;
};

describe('reduce motion on the first render', () => {
  let answer: (enabled: boolean) => void;

  beforeEach(() => {
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockReturnValue(new Promise<boolean>((resolve) => (answer = resolve)));
  });

  afterEach(() => {
    mockReducedMotionAtLaunch = false;
    jest.restoreAllMocks();
  });

  it('reduces motion from the first render when the device setting was on at launch', async () => {
    mockReducedMotionAtLaunch = true;

    await render(
      <PaperProvider>
        <ReduceMotionProbe />
      </PaperProvider>
    );

    expect(screen.getByText('reduceMotion: true')).toBeOnTheScreen();
  });

  it('follows the asynchronous answer when it differs from the setting at launch', async () => {
    mockReducedMotionAtLaunch = true;

    await render(
      <PaperProvider>
        <ReduceMotionProbe />
      </PaperProvider>
    );
    await act(() => answer(false));

    expect(screen.getByText('reduceMotion: false')).toBeOnTheScreen();
  });

  it('ignores the setting at launch when reduceMotion is "off"', async () => {
    mockReducedMotionAtLaunch = true;

    await render(
      <PaperProvider reduceMotion="off">
        <ReduceMotionProbe />
      </PaperProvider>
    );

    expect(screen.getByText('reduceMotion: false')).toBeOnTheScreen();
  });
});
