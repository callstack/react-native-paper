import React from 'react';
import { Text } from 'react-native';

import { fireEvent, screen } from '@testing-library/react-native';
import { measurePerformance } from 'reassure';

import Button from '../../Button/Button';
import theme from '../utils';

const TEST_ID = 'button-perf-test';

function renderButton(props = {}) {
  return (
    <Button {...props} testID={TEST_ID}>
      <Text>Label</Text>
    </Button>
  );
}

describe('Button perf', () => {
  test('Base', async () => {
    await measurePerformance(renderButton());
  });

  test('onPress', async () => {
    const scenario = async () => {
      for (let i = 0; i < 5; i++) {
        fireEvent.press(screen.getByTestId(TEST_ID));
      }
    };

    await measurePerformance(renderButton(), { scenario });
  });

  test('to dark mode', async () => {
    const scenario = () => {
      screen.rerender(renderButton({ dark: true, mode: 'elevated' }));
    };

    await measurePerformance(renderButton({ dark: false, mode: 'elevated' }), {
      scenario,
    });
  });

  it.each`
    mode
    ${'text'}
    ${'outlined'}
    ${'contained'}
    ${'elevated'}
    ${'contained-tonal'}
  `('to $mode mode', async ({ mode }) => {
    await measurePerformance(renderButton({ mode: mode }));
  });

  test('to compact look', async () => {
    const scenario = () => {
      screen.rerender(renderButton({ compact: true, mode: 'text' }));
    };

    await measurePerformance(renderButton({ compact: false, mode: 'text' }), {
      scenario,
    });
  });

  test('override theme', async () => {
    await measurePerformance(renderButton({ theme }));
  });
});
