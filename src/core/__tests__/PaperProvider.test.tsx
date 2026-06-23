import { Appearance, AccessibilityInfo, Platform, View } from 'react-native';
import type { ColorSchemeName } from 'react-native';

import {
  beforeEach,
  describe,
  expect,
  it,
  jest as mockJest,
} from '@jest/globals';
import { act, render, screen } from '@testing-library/react-native';

import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { DarkTheme, DynamicLightTheme, LightTheme } from '../../theme/schemes';
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
  mockJest.mock('react-native/Libraries/Utilities/Appearance', () => {
    const realApp = mockJest.requireActual<
      typeof import('react-native/Libraries/Utilities/Appearance')
    >('react-native/Libraries/Utilities/Appearance');

    const listeners: Array<
      (options: { colorScheme: ColorSchemeName }) => void
    > = [];

    return {
      ...realApp,
      addChangeListener: mockJest.fn(
        (cb: (options: { colorScheme: ColorSchemeName }) => void) => {
          listeners.push(cb);
        }
      ),
      removeChangeListener: mockJest.fn(
        (cb: (options: { colorScheme: ColorSchemeName }) => void) => {
          listeners.push(cb);
        }
      ),
      getColorScheme: mockJest.fn(() => {
        return 'light';
      }),
      __internalListeners: listeners,
    };
  });
};

const mockAccessibilityInfo = () => {
  mockJest.mock(
    'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
    () => {
      const realApp = mockJest.requireActual<{
        default: typeof AccessibilityInfo;
      }>(
        'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo'
      );

      const listeners: Array<(enabled: boolean) => void> = [];
      return {
        __esModule: true,
        default: {
          realApp,
          addEventListener: mockJest.fn(
            (_event, cb: (enabled: boolean) => void) => {
              listeners.push(cb);
            }
          ),
          removeEventListener: mockJest.fn((cb: (enabled: boolean) => void) => {
            listeners.push(cb);
          }),
          isReduceMotionEnabled: mockJest.fn(() => Promise.resolve(undefined)),
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
    <PaperProvider theme={theme} reduceMotion="off">
      <FakeChild />
    </PaperProvider>
  );
};

const ExtendedLightTheme = { ...LightTheme } as ThemeProp;
const ExtendedDarkTheme = { ...DarkTheme } as ThemeProp;

const defaultPlatform = Platform.OS;

describe('PaperProvider', () => {
  beforeEach(() => {
    mockJest.resetModules();
    Platform.OS = defaultPlatform;
  });

  it('handles theme change', async () => {
    mockAppearance();
    await render(createProvider());
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
    await act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedDarkTheme
    );
  });

  it('subscribes to AccessibilityInfo and adapts theme.animation.scale when OS reduce-motion is enabled (auto mode)', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    await render(
      <PaperProvider reduceMotion="auto">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).toHaveBeenCalled();
    await act(() => AccessibilityInfo.__internalListeners[0](true));

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(0);
  });

  it('exposes the resolved reduce-motion boolean via useReduceMotion to children', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const Probe = () => {
      const reduceMotion = useReduceMotion();
      return <View testID="reduce-motion-probe" reduceMotion={reduceMotion} />;
    };

    const { rerender } = await render(
      <PaperProvider reduceMotion="on">
        <Probe />
      </PaperProvider>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('reduce-motion-probe').props.reduceMotion).toBe(
      true
    );

    await rerender(
      <PaperProvider reduceMotion="off">
        <Probe />
      </PaperProvider>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('reduce-motion-probe').props.reduceMotion).toBe(
      false
    );
  });

  it('removes the AccessibilityInfo listener when reduceMotion switches from "auto" to "off"', async () => {
    mockAppearance();
    mockAccessibilityInfo();

    const { rerender } = await render(
      <PaperProvider reduceMotion="auto">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).toHaveBeenCalledTimes(1);
    expect(AccessibilityInfo.removeEventListener).not.toHaveBeenCalled();

    await rerender(
      <PaperProvider reduceMotion="off">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('does not subscribe to AccessibilityInfo when reduceMotion is "off"', async () => {
    mockAppearance();
    mockAccessibilityInfo();
    await render(
      <PaperProvider theme={ExtendedDarkTheme} reduceMotion="off">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).not.toHaveBeenCalled();
    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(1);
  });

  it('forces animation.scale to 0 when reduceMotion is "on" without subscribing', async () => {
    mockAppearance();
    mockAccessibilityInfo();
    await render(
      <PaperProvider reduceMotion="on">
        <FakeChild />
      </PaperProvider>
    );

    expect(AccessibilityInfo.addEventListener).not.toHaveBeenCalled();
    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('provider-child-view').props.theme.animation.scale
    ).toStrictEqual(0);
  });

  it('DynamicLightTheme falls back to LightTheme on non-Android platforms', () => {
    Platform.OS = 'ios';
    expect(DynamicLightTheme.colors).toStrictEqual(LightTheme.colors);
  });

  it('should set Appearance listeners, if there is no theme', async () => {
    mockAppearance();
    await render(createProvider());

    expect(Appearance.addChangeListener).toHaveBeenCalled();
    await act(() => Appearance.__internalListeners[0]({ colorScheme: 'dark' }));
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedDarkTheme
    );
  });

  it('should not set Appearance listeners, if the theme is passed', async () => {
    mockAppearance();
    await render(createProvider(ExtendedLightTheme));

    expect(Appearance.addChangeListener).not.toHaveBeenCalled();
    expect(Appearance.removeChangeListener).not.toHaveBeenCalled();
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
  });

  it('uses default theme, if Appearance module is not defined', async () => {
    mockJest.mock('react-native/Libraries/Utilities/Appearance', () => {
      return null;
    });
    await render(createProvider());
    expect(Appearance).toEqual(null);
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('provider-child-view').props.theme).toStrictEqual(
      ExtendedLightTheme
    );
  });

  it.each([
    {
      label: 'default theme',
      theme: ExtendedLightTheme,
      colorScheme: 'light',
    },
    {
      label: 'dark theme',
      theme: ExtendedDarkTheme,
      colorScheme: 'dark',
    },
  ] satisfies Array<{
    label: string;
    theme: ThemeProp;
    colorScheme: ColorSchemeName;
  }>)(
    'provides $label for $colorScheme color scheme',
    async ({ theme, colorScheme }) => {
      mockAppearance();
      mockJest.mocked(Appearance.getColorScheme).mockReturnValue(colorScheme);
      await render(createProvider());
      expect(
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        screen.getByTestId('provider-child-view').props.theme
      ).toStrictEqual(theme);
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
    await render(createProvider(customTheme));
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('provider-child-view').props.theme).toStrictEqual(
      customTheme
    );
  });
});
