import * as React from 'react';
import {
  Appearance,
  AccessibilityInfo,
  View,
  ColorSchemeName,
} from 'react-native';

import { render, act } from '@testing-library/react-native';

import { LightTheme, DarkTheme } from '../../styles/themes';
import type { ThemeProp } from '../../types';
import PaperProvider from '../PaperProvider';
import { useTheme } from '../theming';

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

describe('PaperProvider', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('handles theme change', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider());
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      LightTheme
    );
    act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DarkTheme
    );
  });

  it('handles overriding animation with the custom one', () => {
    const { getByTestId } = render(
      createProvider({
        ...LightTheme,
        animation: { defaultAnimationDuration: 250 },
      })
    );

    expect(getByTestId('provider-child-view').props.theme).toStrictEqual({
      ...LightTheme,
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

    rerender(createProvider(LightTheme));
    expect(AccessibilityInfo.removeEventListener).toHaveBeenCalled();
  });

  it('should not set AccessibilityInfo listeners, if there is a theme', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(DarkTheme));

    expect(AccessibilityInfo.addEventListener).not.toHaveBeenCalled();
    expect(AccessibilityInfo.removeEventListener).not.toHaveBeenCalled();
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DarkTheme
    );
  });

  it('should set Appearance listeners, if there is no theme', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider());

    expect(Appearance.addChangeListener).toHaveBeenCalled();
    act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      DarkTheme
    );
  });

  it('should not set Appearance listeners, if the theme is passed', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider(LightTheme));

    expect(Appearance.addChangeListener).not.toHaveBeenCalled();
    expect(Appearance.removeChangeListener).not.toHaveBeenCalled();
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      LightTheme
    );
  });

  it('uses default theme, if Appearance module is not defined', async () => {
    jest.mock('react-native/Libraries/Utilities/Appearance', () => {
      return null;
    });
    const { getByTestId } = render(createProvider());
    expect(Appearance).toEqual(null);
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      LightTheme
    );
  });

  it.each`
    label              | theme         | colorScheme
    ${'default theme'} | ${LightTheme} | ${'light'}
    ${'dark theme'}    | ${DarkTheme}  | ${'dark'}
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
      ...LightTheme,
      colors: {
        ...LightTheme.colors,
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
    colorScheme | expectedTheme
    ${'light'}  | ${LightTheme}
    ${'dark'}   | ${DarkTheme}
  `(
    'uses correct theme, $colorScheme mode, version $version',
    async ({ colorScheme, expectedTheme }) => {
      mockAppearance();
      (Appearance.getColorScheme as jest.Mock).mockReturnValue(colorScheme);
      const { getByTestId } = render(createProvider());

      expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
        expectedTheme
      );
    }
  );
});
