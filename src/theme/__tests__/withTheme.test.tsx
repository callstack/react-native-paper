import * as React from 'react';
import { PlatformColor } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { useTheme, withTheme } from '../provider';
import { DarkTheme } from '../schemes';
import type { Theme } from '../types';

type ThemeReaderProps = {
  onTheme: (theme: Theme) => void;
  theme: Theme;
};

const ThemeReader = ({ onTheme, theme }: ThemeReaderProps) => {
  onTheme(theme);
  return null;
};

const ThemedReader = withTheme(ThemeReader);

const ContextReader = ({ onTheme }: Pick<ThemeReaderProps, 'onTheme'>) => {
  onTheme(useTheme());
  return null;
};

const createOnTheme = () => jest.fn<(theme: Theme) => void>();

describe('withTheme', () => {
  it('passes the theme above it on as it is without a theme', async () => {
    const onContextTheme = createOnTheme();
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={DarkTheme} reduceMotion="off">
        <ContextReader onTheme={onContextTheme} />
        <ThemedReader onTheme={onTheme} />
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0]).toBe(onContextTheme.mock.lastCall?.[0]);
  });

  it('merges its theme prop onto the theme above it', async () => {
    const onTheme = createOnTheme();

    await render(
      <PaperProvider theme={DarkTheme} reduceMotion="off">
        <ThemedReader
          onTheme={onTheme}
          theme={{ colors: { primary: 'red' } }}
        />
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0].colors).toStrictEqual({
      ...DarkTheme.colors,
      primary: 'red',
    });
  });

  it('replaces an array from its theme prop instead of joining it', async () => {
    const standard = [0.2, 0, 0, 1] as const;
    const onTheme = createOnTheme();

    await render(
      <PaperProvider reduceMotion="off">
        <ThemedReader
          onTheme={onTheme}
          theme={{ motion: { easing: { standard } } }}
        />
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0].motion.easing.standard).toEqual(standard);
  });

  it('keeps platform colors from its theme prop as they are', async () => {
    const primary = PlatformColor('label');
    const onTheme = createOnTheme();

    await render(
      <PaperProvider reduceMotion="off">
        <ThemedReader onTheme={onTheme} theme={{ colors: { primary } }} />
      </PaperProvider>
    );

    expect(onTheme.mock.lastCall?.[0].colors.primary).toBe(primary);
  });

  it('keeps the statics of the component and names it after it', () => {
    class Reader extends React.Component<{ theme: Theme }> {
      static screenName = 'reader';

      render() {
        return null;
      }
    }
    const ThemedClassReader = withTheme(Reader);

    expect(ThemedClassReader.screenName).toBe('reader');
    expect(ThemedClassReader.displayName).toBe('withTheme(Reader)');
  });
});
