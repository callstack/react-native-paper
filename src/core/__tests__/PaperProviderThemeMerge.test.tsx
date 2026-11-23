import { PlatformColor, Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';

import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox';
import Chip from '../../components/Chip/Chip';
import FAB from '../../components/FAB';
import Surface from '../../components/Surface';
import Switch from '../../components/Switch/Switch';
import { LightTheme } from '../../theme/schemes';
import type { Theme, ThemeProp } from '../../theme/types';
import PaperProvider from '../PaperProvider';
import { useTheme } from '../theming';

const ThemeReader = ({ onTheme }: { onTheme: (theme: Theme) => void }) => {
  onTheme(useTheme());
  return null;
};

const getProvidedTheme = async (theme: ThemeProp) => {
  const onTheme = jest.fn<(theme: Theme) => void>();

  await render(
    <PaperProvider theme={theme}>
      <ThemeReader onTheme={onTheme} />
    </PaperProvider>
  );

  return onTheme.mock.lastCall?.[0];
};

describe('PaperProvider theme merge', () => {
  it('renders components when the theme overrides a single motion token', async () => {
    await render(
      <PaperProvider theme={{ motion: { duration: { short3: 300 } } }}>
        <Surface elevation={1}>
          <Text>Surface</Text>
        </Surface>
        <Chip onPress={() => {}}>Chip</Chip>
        <Button onPress={() => {}}>Button</Button>
        <Switch value onValueChange={() => {}} />
        <Checkbox status="checked" onPress={() => {}} />
        <FAB icon="plus" aria-label="Add" onPress={() => {}} />
      </PaperProvider>
    );

    expect(screen.getByText('Surface')).toBeOnTheScreen();
    expect(screen.getByText('Button')).toBeOnTheScreen();
  });

  it('keeps the motion tokens a partial motion override leaves out', async () => {
    const theme = await getProvidedTheme({
      motion: { duration: { short3: 300 } },
    });

    expect(theme?.motion).toStrictEqual({
      ...LightTheme.motion,
      duration: { ...LightTheme.motion.duration, short3: 300 },
    });
  });

  it('keeps the corner roles a partial shapes override leaves out', async () => {
    const theme = await getProvidedTheme({
      shapes: { corner: { medium: 6 } },
    });

    expect(theme?.shapes).toStrictEqual({
      ...LightTheme.shapes,
      corner: { ...LightTheme.shapes.corner, medium: 6 },
    });
  });

  it('keeps the elevation colors a partial colors override leaves out', async () => {
    const theme = await getProvidedTheme({
      colors: { primary: 'tomato', elevation: { level1: 'red' } },
    });

    expect(theme?.colors).toStrictEqual({
      ...LightTheme.colors,
      primary: 'tomato',
      elevation: { ...LightTheme.colors.elevation, level1: 'red' },
    });
  });

  it('keeps the font properties and variants a partial fonts override leaves out', async () => {
    const theme = await getProvidedTheme({
      fonts: { bodyLarge: { fontSize: 18 } },
    });

    expect(theme?.fonts).toStrictEqual({
      ...LightTheme.fonts,
      bodyLarge: { ...LightTheme.fonts.bodyLarge, fontSize: 18 },
    });
  });

  it('replaces an easing curve as a whole', async () => {
    const theme = await getProvidedTheme({
      motion: { easing: { emphasized: [0.1, 0, 0, 1] } },
    });

    expect(theme?.motion.easing.emphasized).toStrictEqual([0.1, 0, 0, 1]);
    expect(theme?.motion.easing.standard).toStrictEqual(
      LightTheme.motion.easing.standard
    );
  });

  it('keeps a platform color as a single value', async () => {
    const primary = PlatformColor('systemBlue');
    const theme = await getProvidedTheme({ colors: { primary } });

    expect(theme?.colors.primary).toStrictEqual(primary);
    expect(theme?.colors.secondary).toBe(LightTheme.colors.secondary);
  });
});
