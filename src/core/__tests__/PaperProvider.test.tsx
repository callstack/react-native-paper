import * as React from 'react';
import {
  Appearance,
  AccessibilityInfo,
  View,
  ColorSchemeName,
} from 'react-native';

import { render, act } from '@testing-library/react-native';
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock';

import {
  MD2LightTheme,
  MD2DarkTheme,
  MD3LightTheme,
  MD3DarkTheme,
} from '../../styles/themes';
import type { ThemeProp } from '../../types';
import PaperProvider from '../PaperProvider';
import { useTheme } from '../theming';

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext);

declare module 'react-native' {
  interface AccessibilityInfoStatic {
    removeEventListener(): void;
    __internalListeners: Array<
      (options: { reduceMotionEnabled: boolean }) => {}
    >;
  }

  namespace Appearance {
    //@ts-ignore
    // eslint-disable-next-line jest/no-export
    export type AppearancePreferences = {
      colorScheme: ColorSchemeName;
    };
    // eslint-disable-next-line jest/no-export
    export const __internalListeners: Array<
      (options: { colorScheme: 'dark' }) => {}
    >;

    // eslint-disable-next-line jest/no-export
    export function removeChangeListener(): void;
  }

  interface ViewProps {
    theme?: object;
  }
}

const mockAppearance = () => {
  jest.mock('react-native/Libraries/Utilities/Appearance', () => {
    const realApp = jest.requireActual(
      'react-native/Libraries/Utilities/Appearance'
    );
    const listeners: Function[] = [];
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

      const listeners: Function[] = [];
      return {
        __esModule: true,
        default: {
          realApp,
          addEventListener: jest.fn((_event, cb) => {
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

const createProvider = (theme?: ThemeProp) => {
  return (
    <PaperProvider theme={theme}>
      <FakeChild />
    </PaperProvider>
  );
};

const ExtendedLightTheme = { ...MD3LightTheme, isV3: true } as ThemeProp;
const ExtendedDarkTheme = { ...MD3DarkTheme, isV3: true } as ThemeProp;

describe('PaperProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles theme change', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider());
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
    act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedDarkTheme
    );
  });

  it('handles overriding animation with the custom one', () => {
    const { getByTestId } = render(
      createProvider({
        ...MD3LightTheme,
        animation: { defaultAnimationDuration: 250 },
      })
    );

    expect(getByTestId('provider-child-view').props.theme).toStrictEqual({
      ...MD3LightTheme,
      animation: { scale: 1, defaultAnimationDuration: 250 },
    });
  });

  it('should set AccessibilityInfo listeners, if there is no theme', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const { rerender, getByTestId } = render(createProvider());

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
    const { getByTestId } = render(createProvider() as React.ReactElement);

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
    const { getByTestId } = render(createProvider());
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
      (Appearance.getColorScheme as jest.Mock).mockReturnValue(colorScheme);
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
    } as ThemeProp;
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
      (Appearance.getColorScheme as jest.Mock).mockReturnValue(colorScheme);
      const { getByTestId } = render(createProvider({ version }));

      expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
        expectedTheme
      );
    }
  );
});
