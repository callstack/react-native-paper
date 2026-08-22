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

import Text from '../../components/Typography/Text';
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

  describe('partial theme merging', () => {
    // A v2-shaped `fonts` object, as produced by `configureFonts` before v5.13
    // and still widely copy-pasted. It shares no keys with the MD3 typescale.
    const legacyFonts = {
      regular: { fontFamily: 'CustomSans-Regular', fontWeight: '400' },
      medium: { fontFamily: 'CustomSans-Medium', fontWeight: '500' },
      light: { fontFamily: 'CustomSans-Light', fontWeight: '300' },
      thin: { fontFamily: 'CustomSans-Thin', fontWeight: '100' },
    } as const;

    it('keeps the base typescale when only part of theme.fonts is provided', async () => {
      mockAppearance();
      await render(createProvider({ fonts: legacyFonts } as ThemeProp));

      const theme =
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        screen.getByTestId('provider-child-view').props.theme;

      // The MD3 variants the user did not mention must survive...
      expect(theme.fonts.titleLarge).toStrictEqual(LightTheme.fonts.titleLarge);
      expect(theme.fonts.bodyMedium).toStrictEqual(LightTheme.fonts.bodyMedium);
      // ...alongside the keys the user did provide.
      expect(theme.fonts.regular).toStrictEqual(legacyFonts.regular);
    });

    it('renders <Text variant> instead of throwing when theme.fonts is partial', async () => {
      mockAppearance();
      // Reproduces #4589: `<Text variant>` threw
      // "Variant titleLarge was not provided properly. Valid variants are
      // regular, medium, light, thin." because the provider dropped the typescale.
      await render(
        <PaperProvider theme={{ fonts: legacyFonts } as ThemeProp}>
          <Text variant="titleLarge">Merged typescale</Text>
        </PaperProvider>
      );

      expect(screen.getByText('Merged typescale')).toBeOnTheScreen();
    });

    it('still merges theme.colors with the base palette', async () => {
      mockAppearance();
      await render(createProvider({ colors: { primary: 'tomato' } }));

      const theme =
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        screen.getByTestId('provider-child-view').props.theme;

      expect(theme.colors.primary).toBe('tomato');
      expect(theme.colors.onSurface).toBe(LightTheme.colors.onSurface);
      expect(Object.keys(theme.colors)).toStrictEqual(
        Object.keys(LightTheme.colors)
      );
    });

    it('keeps sibling tokens when a nested shape token is overridden', async () => {
      mockAppearance();
      await render(createProvider({ shapes: { corner: { small: 2 } } }));

      const theme =
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        screen.getByTestId('provider-child-view').props.theme;

      expect(theme.shapes.corner.small).toBe(2);
      expect(theme.shapes.corner.large).toBe(LightTheme.shapes.corner.large);
    });

    it('keeps the defaults when the theme owns a custom property named `dynamic`', async () => {
      mockAppearance();
      // `dynamic`, `semantic` and `resource_paths` are the keys that mark a
      // native platform color. A user theme is allowed to own them as ordinary
      // custom properties (docs: "Extending the theme"), and doing so must not
      // make the whole theme look like a leaf value.
      await render(
        createProvider({
          dynamic: true,
          colors: { primary: 'tomato' },
        } as ThemeProp)
      );

      const theme =
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        screen.getByTestId('provider-child-view').props.theme;

      expect(theme.dynamic).toBe(true);
      expect(theme.colors.primary).toBe('tomato');
      expect(theme.colors.onSurface).toBe(LightTheme.colors.onSurface);
      expect(theme.fonts.titleLarge).toStrictEqual(LightTheme.fonts.titleLarge);
      expect(theme.shapes.corner.large).toBe(LightTheme.shapes.corner.large);
    });

    it('renders <Text variant> when the theme owns a custom `dynamic` property', async () => {
      mockAppearance();
      await render(
        <PaperProvider theme={{ dynamic: true } as ThemeProp}>
          <Text variant="titleLarge">Custom dynamic property</Text>
        </PaperProvider>
      );

      expect(screen.getByText('Custom dynamic property')).toBeOnTheScreen();
    });

    it('lets a complete fonts object override every default variant', async () => {
      mockAppearance();
      // Shaped like the output of `configureFonts`: every variant present, with
      // the same properties as the defaults, so nothing can be inherited.
      const completeFonts = Object.fromEntries(
        Object.entries(LightTheme.fonts).map(([variant, style]) => [
          variant,
          { ...style, fontFamily: 'Overridden' },
        ])
      );
      await render(createProvider({ fonts: completeFonts } as ThemeProp));

      const theme =
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        screen.getByTestId('provider-child-view').props.theme;

      expect(theme.fonts).toStrictEqual(completeFonts);
    });
  });
});
