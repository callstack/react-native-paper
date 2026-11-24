import * as React from 'react';
import { PlatformColor } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import Button from '../../components/Button/Button';
import Text from '../../components/Typography/Text';
import PaperProvider from '../../core/PaperProvider';
import type { ThemeProp as PackageThemeProp } from '../../index';
import { ThemeProvider, useTheme } from '../provider';
import { DarkTheme, LightTheme } from '../schemes';
import type { Theme, ThemeProp } from '../types';

type ThemeReaderProps = {
  onTheme: (theme: Theme) => void;
};

const ThemeReader = ({ onTheme }: ThemeReaderProps) => {
  onTheme(useTheme());
  return null;
};

const MemoThemeReader = React.memo(ThemeReader);

const createOnTheme = () => jest.fn<(theme: Theme) => void>();

describe('ThemeProvider', () => {
  it('renders a partial theme and keeps the other keys of the theme above it', async () => {
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={DarkTheme} reduceMotion="off">
        <ThemeProvider theme={{ colors: { primary: 'red' } }}>
          <Button>Press me</Button>
          <ThemeReader onTheme={onTheme} />
        </ThemeProvider>
      </PaperProvider>
    );

    expect(screen.getByText('Press me')).toBeOnTheScreen();
    expect(onTheme.mock.lastCall?.[0]).toStrictEqual({
      ...DarkTheme,
      colors: { ...DarkTheme.colors, primary: 'red' },
    });
  });

  it('applies a partial theme typed with the ThemeProp the package exports', async () => {
    const theme: PackageThemeProp = {
      colors: { primary: 'tomato' },
      fonts: { bodyLarge: { fontSize: 18 } },
    };
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={LightTheme} reduceMotion="off">
        <ThemeProvider theme={theme}>
          <ThemeReader onTheme={onTheme} />
        </ThemeProvider>
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0]).toStrictEqual({
      ...LightTheme,
      colors: { ...LightTheme.colors, primary: 'tomato' },
      fonts: {
        ...LightTheme.fonts,
        bodyLarge: { ...LightTheme.fonts.bodyLarge, fontSize: 18 },
      },
    });
  });

  it('merges nested themes in order', async () => {
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={LightTheme} reduceMotion="off">
        <ThemeProvider
          theme={{ colors: { primary: 'red', secondary: 'green' } }}
        >
          <ThemeProvider theme={{ colors: { secondary: 'blue' } }}>
            <ThemeReader onTheme={onTheme} />
          </ThemeProvider>
        </ThemeProvider>
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0]).toStrictEqual({
      ...LightTheme,
      colors: { ...LightTheme.colors, primary: 'red', secondary: 'blue' },
    });
  });

  it.each([
    { label: 'DarkTheme', parent: LightTheme, theme: DarkTheme },
    { label: 'LightTheme', parent: DarkTheme, theme: LightTheme },
    {
      label: 'a theme with custom keys',
      parent: DarkTheme,
      theme: {
        ...LightTheme,
        custom: 'property',
        colors: { ...LightTheme.colors, brandPrimary: '#fefefe' },
      },
    },
  ])(
    'gives the components the values of a full theme: $label',
    async ({ parent, theme }) => {
      const onTheme = createOnTheme();

      await render(
        <PaperProvider theme={parent} reduceMotion="off">
          <ThemeProvider theme={theme}>
            <ThemeReader onTheme={onTheme} />
          </ThemeProvider>
        </PaperProvider>
      );

      expect(onTheme.mock.lastCall?.[0]).toStrictEqual(theme);
    }
  );

  it('drops prototype keys from a theme parsed from JSON', async () => {
    const theme: ThemeProp = JSON.parse(
      '{"__proto__": {"polluted": "yes"}, "constructor": {"polluted": "yes"}, "colors": {"__proto__": {"polluted": "yes"}, "constructor": {"polluted": "yes"}, "primary": "red"}}'
    );
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={LightTheme} reduceMotion="off">
        <ThemeProvider theme={theme}>
          <ThemeReader onTheme={onTheme} />
        </ThemeProvider>
      </PaperProvider>
    );

    expect(onTheme).toHaveBeenCalled();
    const [received] = onTheme.mock.calls[0];
    for (const value of [received, received.colors]) {
      expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
      for (const key of ['__proto__', 'constructor']) {
        expect(Object.prototype.hasOwnProperty.call(value, key)).toBe(false);
      }
      expect(value).not.toHaveProperty('polluted');
    }
    expect(received.colors.primary).toBe('red');
    expect(received.colors.secondary).toBe(LightTheme.colors.secondary);
    expect({}).not.toHaveProperty('polluted');
  });

  it('keeps platform colors as they are', async () => {
    const primary = PlatformColor('label');
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={LightTheme} reduceMotion="off">
        <ThemeProvider theme={{ colors: { primary } }}>
          <ThemeReader onTheme={onTheme} />
        </ThemeProvider>
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0].colors.primary).toBe(primary);
  });

  it('passes the theme above it on as it is without a theme', async () => {
    const onParentTheme = createOnTheme();
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={DarkTheme} reduceMotion="off">
        <ThemeReader onTheme={onParentTheme} />
        <ThemeProvider>
          <ThemeReader onTheme={onTheme} />
        </ThemeProvider>
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0]).toBe(onParentTheme.mock.lastCall?.[0]);
  });

  it('does not re-render its children for an equal theme', async () => {
    const onTheme = createOnTheme();
    const renderTree = (primary: string) => (
      <PaperProvider theme={LightTheme} reduceMotion="off">
        <ThemeProvider theme={{ colors: { primary } }}>
          <MemoThemeReader onTheme={onTheme} />
        </ThemeProvider>
      </PaperProvider>
    );

    const { rerender } = await render(renderTree('red'));
    await rerender(renderTree('red'));

    expect(onTheme).toHaveBeenCalledTimes(1);

    await rerender(renderTree('blue'));

    expect(onTheme).toHaveBeenCalledTimes(2);
    expect(onTheme.mock.lastCall?.[0].colors.primary).toBe('blue');
  });

  it('takes a partial theme, and TypeScript reports anything else', async () => {
    // `yarn typecheck` fails if one of these stops being a type error.
    await render(
      <PaperProvider theme={LightTheme} reduceMotion="off">
        <ThemeProvider theme={{ colors: { primary: 'red' } }}>
          <Text>Partial theme</Text>
        </ThemeProvider>
        {/* @ts-expect-error: `roundness` was removed from the theme */}
        <ThemeProvider theme={{ roundness: 2 }}>
          <Text>Removed key</Text>
        </ThemeProvider>
        {/* @ts-expect-error: a number isn't a theme */}
        <ThemeProvider theme={42}>{null}</ThemeProvider>
      </PaperProvider>
    );

    expect(screen.getByText('Partial theme')).toBeOnTheScreen();
    expect(screen.getByText('Removed key')).toBeOnTheScreen();
  });
});
