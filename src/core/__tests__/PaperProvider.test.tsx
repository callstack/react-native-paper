import * as React from 'react';
import {
  Appearance,
  AccessibilityInfo,
  View,
  ColorSchemeName,
} from 'react-native';

import { render, act } from '@testing-library/react-native';

import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { LightTheme, DarkTheme } from '../../theme/schemes';
import type { ThemeProp } from '../../types';
import PaperProvider from '../PaperProvider';
import { useTheme } from '../theming';

declare module 'react-native' {
  interface AccessibilityInfoStatic {
    removeEventListener(): void;
    __internalListeners: Array<(enabled: boolean) => void>;
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
    reduceMotion?: boolean;
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
          isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
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

const ExtendedLightTheme = { ...LightTheme } as ThemeProp;
const ExtendedDarkTheme = { ...DarkTheme } as ThemeProp;

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

  it('subscribes to AccessibilityInfo and adapts theme.animation.scale when OS reduce-motion is enabled (auto mode)', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const { getByTestId } = render(createProvider());

    expect(AccessibilityInfo.addEventListener).toHaveBeenCalled();
    act(() => AccessibilityInfo.__internalListeners[0](true));

    expect(
      getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(0);
  });

  it('exposes the resolved reduce-motion boolean via useReduceMotion to children', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const Probe = () => {
      const reduceMotion = useReduceMotion();
      return <View testID="reduce-motion-probe" reduceMotion={reduceMotion} />;
    };

    const { getByTestId, rerender } = render(
      <PaperProvider reduceMotion="on">
        <Probe />
      </PaperProvider>
    );
    expect(getByTestId('reduce-motion-probe').props.reduceMotion).toBe(true);

    rerender(
      <PaperProvider reduceMotion="off">
        <Probe />
      </PaperProvider>
    );
    expect(getByTestId('reduce-motion-probe').props.reduceMotion).toBe(false);
  });

  it('removes the AccessibilityInfo listener when reduceMotion switches from "auto" to "off"', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const { rerender } = render(
      <PaperProvider reduceMotion="auto">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).toHaveBeenCalledTimes(1);
    expect(AccessibilityInfo.removeEventListener).not.toHaveBeenCalled();

    rerender(
      <PaperProvider reduceMotion="off">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('does not subscribe to AccessibilityInfo when reduceMotion is "off"', async () => {
    mockAppearance();
    mockAccessibilityInfo();
    const { getByTestId } = render(
      <PaperProvider theme={ExtendedDarkTheme} reduceMotion="off">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).not.toHaveBeenCalled();
    expect(
      getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(1);
  });

  it('forces animation.scale to 0 when reduceMotion is "on" without subscribing', async () => {
    mockAppearance();
    mockAccessibilityInfo();
    const { getByTestId } = render(
      <PaperProvider reduceMotion="on">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).not.toHaveBeenCalled();
    expect(
      getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(0);
  });

  it('leaves theme.colors unchanged when dynamicColor is true on an unsupported platform', async () => {
    mockAppearance();
    const { getByTestId } = render(
      <PaperProvider dynamicColor>
        <FakeChild />
      </PaperProvider>
    );
    // `isDynamicColorSupported` is false on the test platform → no color override.
    expect(getByTestId('provider-child-view').props.theme.colors.primary).toBe(
      LightTheme.colors.primary
    );
  });

  it('should set Appearance listeners, if there is no theme', async () => {
    mockAppearance();
    const { getByTestId } = render(createProvider());

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
      },
    } as ThemeProp;
    const { getByTestId } = render(createProvider(customTheme));
    expect(getByTestId('provider-child-view').props.theme).toStrictEqual(
      customTheme
    );
  });
});
