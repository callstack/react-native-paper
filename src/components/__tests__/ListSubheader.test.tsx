import { StyleSheet } from 'react-native';

import { expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import { green500, red500 } from '../../theme/colors';
import { LightTheme } from '../../theme/schemes';
import ListSubheader from '../List/ListSubheader';

const styles = StyleSheet.create({
  customStyle: {
    color: red500,
    paddingHorizontal: 24,
    fontSize: 18,
  },
});

it('renders children and text content correctly', async () => {
  await render(<ListSubheader>Favorite Items</ListSubheader>);

  expect(screen.getByText('Favorite Items')).toBeOnTheScreen();
});

it('applies correct MD3 typography tokens for list subheaders', async () => {
  await render(<ListSubheader>MD3 Subheader</ListSubheader>);

  const subheaderText = screen.getByText('MD3 Subheader');

  expect(subheaderText).toHaveStyle({
    fontSize: LightTheme.fonts.titleSmall.fontSize,
    fontWeight: LightTheme.fonts.titleSmall.fontWeight,
    lineHeight: LightTheme.fonts.titleSmall.lineHeight,
    letterSpacing: LightTheme.fonts.titleSmall.letterSpacing,
  });
});

it('applies correct MD3 text color token', async () => {
  await render(<ListSubheader>Color Test</ListSubheader>);

  const subheaderText = screen.getByText('Color Test');

  expect(subheaderText).toHaveStyle({
    color: LightTheme.colors.onSurfaceVariant,
  });
});

it('applies correct default horizontal and vertical padding', async () => {
  await render(<ListSubheader>Spacing Test</ListSubheader>);

  const subheaderText = screen.getByText('Spacing Test');

  expect(subheaderText).toHaveStyle({
    paddingHorizontal: 16,
    paddingVertical: 13,
  });
});

it('respects single-line constraint by default', async () => {
  await render(<ListSubheader>Single Line Test</ListSubheader>);

  const subheaderText = screen.getByText('Single Line Test');

  expect(subheaderText).toHaveProp('numberOfLines', 1);
});

it('forwards maxFontSizeMultiplier to the underlying text element', async () => {
  await render(
    <ListSubheader maxFontSizeMultiplier={2.5}>Scale Test</ListSubheader>
  );

  const subheaderText = screen.getByText('Scale Test');

  expect(subheaderText).toHaveProp('maxFontSizeMultiplier', 2.5);
});

it('supports custom theme overrides for color and typography', async () => {
  const customTheme = {
    colors: {
      onSurfaceVariant: green500,
    },
    fonts: {
      titleSmall: {
        fontFamily: 'CustomFont-Medium',
        fontSize: 15,
        fontWeight: '600' as const,
        letterSpacing: 0.2,
        lineHeight: 22,
      },
    },
  };

  await render(
    <ListSubheader theme={customTheme}>Overridden Theme</ListSubheader>
  );

  const subheaderText = screen.getByText('Overridden Theme');

  expect(subheaderText).toHaveStyle({
    color: green500,
    fontFamily: 'CustomFont-Medium',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 22,
  });
});

it('supports custom style overrides over default styling', async () => {
  await render(
    <ListSubheader style={styles.customStyle}>Custom Style</ListSubheader>
  );

  const subheaderText = screen.getByText('Custom Style');

  expect(subheaderText).toHaveStyle({
    color: red500,
    paddingHorizontal: 24,
    fontSize: 18,
  });
});

it('maintains compatibility with legacy or partial theme objects', async () => {
  const legacyTheme = {
    dark: false,
    colors: {
      primary: 'blue',
    },
  };

  await render(<ListSubheader theme={legacyTheme}>Legacy Theme</ListSubheader>);

  const subheaderText = screen.getByText('Legacy Theme');

  expect(subheaderText).toBeOnTheScreen();
  expect(subheaderText).toHaveStyle({
    fontSize: LightTheme.fonts.titleSmall.fontSize,
    fontWeight: LightTheme.fonts.titleSmall.fontWeight,
    color: LightTheme.colors.onSurfaceVariant,
  });
});
