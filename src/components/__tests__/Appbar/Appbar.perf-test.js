import React from 'react';
import { Text } from 'react-native';

import { fireEvent, screen } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';
import { measurePerformance } from 'reassure';

import Appbar from '../../Appbar';
import theme from '../utils';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

const TEST_ID = 'appbar-perf-test';

function renderAppbar(props = {}) {
  return (
    <Appbar {...props} testID={TEST_ID}>
      {props.children}
    </Appbar>
  );
}

describe('Appbar perf', () => {
  test('Base', async () => {
    await measurePerformance(renderAppbar());
  });

  test('onPress backAction', async () => {
    const scenario = async () => {
      for (let i = 0; i < 5; i++) {
        fireEvent.press(screen.getByTestId('back-icon'));
      }
    };

    await measurePerformance(
      <Appbar testID={TEST_ID}>
        <Appbar.BackAction testID="back-icon" onPress={() => {}} />
        <Appbar.Content title="Examples" />
      </Appbar>,
      { scenario }
    );
  });

  test('onPress multiple actions', async () => {
    const scenario = async () => {
      for (let i = 0; i < 5; i++) {
        fireEvent.press(screen.getByTestId('back-icon'));
      }
      for (let i = 0; i < 5; i++) {
        fireEvent.press(screen.getByTestId('magnify-icon'));
      }
      for (let i = 0; i < 5; i++) {
        fireEvent.press(screen.getByTestId('menu-icon'));
      }
    };

    await measurePerformance(
      <Appbar testID={TEST_ID}>
        <Appbar.BackAction testID="back-icon" onPress={() => {}} key={0} />
        <Appbar.Content title="Examples" key={1} />
        <Appbar.Action
          testID="magnify-icon"
          icon="magnify"
          onPress={() => {}}
          key={2}
        />
        ,
        <Appbar.Action
          testID="menu-icon"
          icon="menu"
          onPress={() => {}}
          key={3}
        />
      </Appbar>,
      { scenario }
    );
  });

  test('with Header', async () => {
    const scenario = async () => {
      for (let i = 0; i < 5; i++) {
        fireEvent.press(screen.getByTestId('appbar-content'));
      }
    };

    await measurePerformance(
      <mockSafeAreaContext.SafeAreaProvider>
        <Appbar testID={TEST_ID}>
          <Appbar.Header>
            <Appbar.Content title="Accessible test" onPress={() => {}} />
          </Appbar.Header>
        </Appbar>
      </mockSafeAreaContext.SafeAreaProvider>,
      { scenario }
    );
  });
});
