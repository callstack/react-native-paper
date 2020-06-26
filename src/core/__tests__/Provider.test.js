import * as React from 'react';
import { Appearance, View } from 'react-native';
import { render } from 'react-native-testing-library';
import Provider from '../Provider';
import { useTheme } from '../theming';
import DarkTheme from '../../styles/DarkTheme';
import DefaultTheme from '../../styles/DefaultTheme';

const mockAppearance = () => {
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
      getColorScheme: jest.fn(() => {
        return 'light';
      }),
      __internalListeners: listeners,
    };
  });
};

const FakeChild = () => {
  const theme = useTheme();
  return <View testID="provider-child-view" theme={theme} />;
};

const createProvider = theme => {
  return (
    <Provider theme={theme}>
      <FakeChild />
    </Provider>
  );
};

describe('Provider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles theme change', () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(null));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DefaultTheme
    );
    Appearance.__internalListeners[0]({ colorScheme: 'dark' });
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DarkTheme
    );
  });

  it('uses default theme, if Appearance module is not defined', () => {
    jest.mock('react-native/Libraries/Utilities/Appearance', () => {
      return null;
    });
    const { getByTestId } = render(createProvider(null));
    expect(Appearance).toEqual(null);
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DefaultTheme
    );
  });

  it.each`
    label              | theme           | colorScheme
    ${'default theme'} | ${DefaultTheme} | ${'light'}
    ${'dark theme'}    | ${DarkTheme}    | ${'dark'}
  `(
    'provides $label for $colorScheme color scheme',
    ({ theme, colorScheme }) => {
      mockAppearance();
      Appearance.getColorScheme.mockReturnValue(colorScheme);
      const { getByTestId } = render(createProvider());
      expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
        theme
      );
    }
  );

  it('uses provided custom theme', () => {
    mockAppearance();
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
});
