import { Platform } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { getAnimatedStyle } from 'react-native-reanimated';

import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
} from '../../../../src/test-utils';
import CardRenderCountExample from '../CardRenderCountExample';

jest.mock('react', () => jest.requireActual('../../../../node_modules/react'));
jest.mock('react-native-reanimated', () =>
  jest.requireActual('../../../../node_modules/react-native-reanimated')
);
jest.mock('react-native-paper', () =>
  jest.requireActual('../../../../src/index')
);

describe('CardRenderCountExample', () => {
  it('keeps stable content at one render through feedback and a parent rerender', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const user = userEvent.setup();
    await render(<CardRenderCountExample />);

    const firstCard = screen.getByTestId('card-benchmark-item-1');

    await fireEvent(firstCard, 'hoverIn');
    await act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      getAnimatedStyle(screen.getByTestId('card-benchmark-item-1-state-layer'))
    ).toEqual(expect.objectContaining({ opacity: 0.08 }));

    await fireEvent(firstCard, 'focus', {
      currentTarget: { matches: () => true },
    });
    await act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      getAnimatedStyle(
        screen.getByTestId('card-benchmark-item-1-focus-indicator')
      )
    ).toEqual(expect.objectContaining({ opacity: 1 }));

    await fireEvent(firstCard, 'pressIn');
    await act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(
      getAnimatedStyle(screen.getByTestId('card-benchmark-item-1-state-layer'))
    ).toEqual(expect.objectContaining({ opacity: 0.1 }));

    await fireEvent(firstCard, 'pressOut');
    await fireEvent(firstCard, 'blur');
    await fireEvent(firstCard, 'hoverOut');

    expect(
      screen.getByTestId('card-benchmark-render-count-1')
    ).toHaveTextContent('Stable content renders: 1');

    await user.press(screen.getByTestId('card-benchmark-rerender'));

    expect(screen.getByTestId('card-benchmark-parent-count')).toHaveTextContent(
      'Parent render passes: 2'
    );
    expect(
      screen.getByTestId('card-benchmark-render-count-1')
    ).toHaveTextContent('Stable content renders: 1');
  });
});
