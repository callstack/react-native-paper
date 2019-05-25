import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { View } from 'react-native';
import Tooltip from '../Tooltip';
import Provider from '../../core/Provider';

jest.mock('react-native/Libraries/ReactNative/UIManager', () => ({
  measure: () => {},
}));

jest.useFakeTimers();

describe('Tooltip', () => {
  it('renders properly', () => {
    const tree = render(
      <Tooltip title="Tooltip View">
        <View />
      </Tooltip>
    );

    expect(tree).toMatchSnapshot();
  });

  it('shows a tooltip when child element is longPressed', () => {
    const { getByTestId, toJSON } = render(
      <Provider>
        <Tooltip title="Tooltip View">
          <View testID="TooltipChild" />
        </Tooltip>
      </Provider>
    );

    fireEvent(getByTestId('TooltipChild'), 'touchStart');
    jest.runAllTimers();

    expect(toJSON()).toMatchSnapshot();
  });
});
