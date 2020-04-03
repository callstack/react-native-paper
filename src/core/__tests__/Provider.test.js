import * as React from 'react';
import { Appearance, ColorSchemeName, View, EventEmitter } from 'react-native';
import { render } from 'react-native-testing-library';
import Provider from '../Provider';
import { useTheme } from '../theming';
import DarkTheme from '../../styles/DarkTheme';
import DefaultTheme from '../../styles/DefaultTheme';
import { Theme } from '../../index';

jest.mock('react-native/Libraries/Utilities/Appearance', () => {
  const realApp = jest.requireActual(
    'react-native/Libraries/Utilities/Appearance'
  );
  const listeners = [];
  return {
    ...realApp,
    addChangeListener: jest.fn(cb => {
      listeners.push(cb);
    }),
    getColorScheme: jest.fn(() => 'light'),
    __internalListeners: listeners,
  };
});

const FakeChild = () => {
  const theme = useTheme();
  return <View testID="provider-child-view" theme={theme} />;
};

const createProvider = (theme: ?Theme = null) => {
  return (
    <Provider theme={theme}>
      <FakeChild />
    </Provider>
  );
};

describe('Provider', () => {
  it.each`
    label              | theme           | colorScheme
    ${'default theme'} | ${DefaultTheme} | ${'light'}
    ${'dark theme'}    | ${DarkTheme}    | ${'dark'}
  `(
    'provides $label for $colorScheme color scheme',
    ({ theme, colorScheme }) => {
      Appearance.getColorScheme.mockReturnValue(colorScheme);
      const { getByTestId } = render(createProvider());
      expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
        theme
      );
    }
  );

  it('uses provided custom theme', () => {
    const customTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: 'tomato',
        accent: 'yellow',
      },
    };
    const { getByTestId } = render(createProvider(customTheme));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      customTheme
    );
  });

  it('handles theme change', () => {
    const { getByTestId } = render(createProvider());
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DefaultTheme
    );
    Appearance.__internalListeners[0]({ colorScheme: 'dark' });
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DarkTheme
    );
  });
});
