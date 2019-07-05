import React from 'react';
import { shallow, render, fireEvent } from 'react-native-testing-library';
import { View } from 'react-native';
import Tooltip from '../Tooltip';
import Provider from '../../core/Provider';

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

  it('raises an error when tooltip does not wrap a child', () => {
    expect(() => {
      shallow(<Tooltip title="Tooltip View" />);
    }).toThrow(/expected to receive a single React element child/);
  });
});
