import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import Menu from '../Menu/Menu';
import { getMenuItemColor } from '../Menu/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('Menu Item', () => {
  it('renders menu item', async () => {
    const tree = (
      await render(
        <>
          <Menu.Item leadingIcon="redo" onPress={() => {}} title="Redo" />
          <Menu.Item leadingIcon="undo" onPress={() => {}} title="Undo" />
          <Menu.Item
            leadingIcon="content-cut"
            onPress={() => {}}
            title="Cut"
            disabled
          />
          <Menu.Item
            leadingIcon="content-copy"
            onPress={() => {}}
            title="Copy"
            disabled
          />
          <Menu.Item onPress={() => {}} title="Paste" />
        </>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should have titleMaxFontSizeMultiplier passed to title', async () => {
    const labelMaxFontSizeMultiplier = 2;

    await render(
      <Menu.Item
        testID="menu-item"
        titleMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        leadingIcon="content-cut"
        onPress={() => {}}
        title="Cut"
      />
    );

    expect(screen.getByText('Cut')).toHaveProp(
      'maxFontSizeMultiplier',
      labelMaxFontSizeMultiplier
    );
  });

  it('accepts aria-checked prop', async () => {
    await render(<Menu.Item aria-checked={true} title="Option 1" />);

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
  });
});

describe('getMenuItemColor - title color', () => {
  it('should return disabled color if disabled, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: LightTheme,
        disabled: true,
      })
    ).toMatchObject({
      titleColor: LightTheme.colors.onSurface,
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: LightTheme,
      })
    ).toMatchObject({
      titleColor: LightTheme.colors.onSurface,
    });
  });
});

describe('getMenuItemColor - icon color', () => {
  it('should return disabled color if disabled, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: LightTheme,
        disabled: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurfaceVariant,
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: LightTheme,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurfaceVariant,
    });
  });
});
