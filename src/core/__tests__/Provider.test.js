import * as React from 'react';
import { Appearance, AccessibilityInfo, View } from 'react-native';

import { render, act } from '@testing-library/react-native';

import {
  MD2LightTheme,
  MD2DarkTheme,
  MD3LightTheme,
  MD3DarkTheme,
} from '../../styles/themes';
import Provider from '../Provider';
import { useTheme } from '../theming';

const mockAppearance = () => {
  jest.mock('react-native/Libraries/Utilities/Appearance', () => {
    const realApp = jest.requireActual(
      'react-native/Libraries/Utilities/Appearance'
    );
    const listeners = [];
    return {
      ...realApp,
      addChangeListener: jest.fn((cb) => {
        listeners.push(cb);
      }),
      removeChangeListener: jest.fn((cb) => {
        listeners.push(cb);
      }),
      getColorScheme: jest.fn(() => {
        return 'light';
      }),
      __internalListeners: listeners,
    };
  });
};

const mockAccessibilityInfo = () => {
  jest.mock(
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
    () => {
      const realApp = jest.requireActual(
        'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo'
      );

      const listeners = [];
      return {
        __esModule: true,
        default: {
          realApp,
          addEventListener: jest.fn((event, cb) => {
            listeners.push(cb);
          }),
          removeEventListener: jest.fn((cb) => {
            listeners.push(cb);
          }),
          __internalListeners: listeners,
        },
      };
    }
  );
};

const FakeChild = () => {
  const theme = useTheme();
  return <View testID="provider-child-view" theme={theme} />;
};

const createProvider = (theme) => {
  return (
    <Provider theme={theme}>
      <FakeChild />
    </Provider>
  );
};

const ExtendedLightTheme = { ...MD3LightTheme, isV3: true };
const ExtendedDarkTheme = { ...MD3DarkTheme, isV3: true };

describe('Provider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles theme change', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(null));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
    act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedDarkTheme
    );
  });

  it('should set AccessibilityInfo listeners, if there is no theme', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const { rerender, getByTestId } = render(createProvider(null));

    expect(AccessibilityInfo.addEventListener).toHaveBeenCalled();
    act(() =>
      AccessibilityInfo.__internalListeners[0]({
        reduceMotionEnabled: true,
      })
    );

    expect(
      getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(0);

    rerender(createProvider(ExtendedLightTheme));
    expect(AccessibilityInfo.removeEventListener).toHaveBeenCalled();
  });

  it('should not set AccessibilityInfo listeners, if there is a theme', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(ExtendedDarkTheme));

    expect(AccessibilityInfo.addEventListener).not.toHaveBeenCalled();
    expect(AccessibilityInfo.removeEventListener).not.toHaveBeenCalled();
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedDarkTheme
    );
  });

  it('should set Appearance listeners, if there is no theme', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(null));

    expect(Appearance.addChangeListener).toHaveBeenCalled();
    act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedDarkTheme
    );
  });

  it('should not set Appearance listeners, if the theme is passed', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(ExtendedLightTheme));

    expect(Appearance.addChangeListener).not.toHaveBeenCalled();
    expect(Appearance.removeChangeListener).not.toHaveBeenCalled();
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
  });

  it('uses default theme, if Appearance module is not defined', async () => {
    jest.mock('react-native/Libraries/Utilities/Appearance', () => {
      return null;
    });
    const { getByTestId } = render(createProvider(null));
    expect(Appearance).toEqual(null);
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
  });

  it.each`
    label              | theme                 | colorScheme
    ${'default theme'} | ${ExtendedLightTheme} | ${'light'}
    ${'dark theme'}    | ${ExtendedDarkTheme}  | ${'dark'}
  `(
    'provides $label for $colorScheme color scheme',
    async ({ theme, colorScheme }) => {
      mockAppearance();
      Appearance.getColorScheme.mockReturnValue(colorScheme);
      const { getByTestId } = render(createProvider());
      expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
        theme
      );
    }
  );

  it('uses provided custom theme', async () => {
    mockAppearance();
    const customTheme = {
      ...ExtendedLightTheme,
      colors: {
        ...ExtendedLightTheme.colors,
        primary: 'tomato',
        accent: 'yellow',
      },
    };
    const { getByTestId } = render(createProvider(customTheme));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      customTheme
    );
  });

  it.each`
    version | colorScheme | expectedTheme
    ${2}    | ${'light'}  | ${MD2LightTheme}
    ${2}    | ${'dark'}   | ${MD2DarkTheme}
    ${3}    | ${'light'}  | ${MD3LightTheme}
    ${3}    | ${'dark'}   | ${MD3DarkTheme}
  `(
    'uses correct theme, $colorScheme mode, version $version',
    async ({ version, colorScheme, expectedTheme }) => {
      mockAppearance();
      Appearance.getColorScheme.mockReturnValue(colorScheme);
      const { getByTestId } = render(createProvider({ version }));

      expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
        expectedTheme
      );
    }
  );
});
