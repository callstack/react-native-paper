import { describe, expect, it } from '@jest/globals';

import { render, screen, userEvent, waitFor } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import Menu from '../Menu/Menu';
import { MenuTokens } from '../Menu/tokens';
import {
  getMenuContainerBorderRadius,
  getMenuContainerColor,
  getMenuItemBorderRadius,
  getMenuItemColor,
  getMenuItemMorphRadii,
} from '../Menu/utils';
import Portal from '../Portal/Portal';

const stateOpacity = tokens.md.sys.state.opacity;

// The row that carries content opacity wraps the title's text column.
const contentRow = (title: string) => {
  const row = screen.getByText(title).parent?.parent;
  if (!row) {
    throw new Error(`No content row found for "${title}"`);
  }
  return row;
};

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
    await render(
      <Menu.Item aria-checked={true} onPress={() => {}} title="Option 1" />
    );

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
  });

  it('uses labelLarge for the title', async () => {
    await render(<Menu.Item title="Paste" />);

    expect(screen.getByText('Paste')).toHaveStyle(LightTheme.fonts.labelLarge);
  });

  it('renders supporting and trailing supporting text', async () => {
    const theme = LightTheme;
    await render(
      <Menu.Item
        title="Share"
        supportingText="Send a link"
        trailingSupportingText="⌘S"
        testID="menu-item"
        aria-label="Share, send a link, keyboard shortcut Command S"
        onPress={() => {}}
      />
    );

    expect(screen.getByText('Send a link')).toBeOnTheScreen();
    expect(screen.getByText('⌘S')).toBeOnTheScreen();
    // two-line anatomy must not use fixed 48 height (would clip supporting)
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      minHeight: 48,
      paddingVertical: 8,
    });
    // B2: supporting uses bodySmall + onSurfaceVariant
    expect(screen.getByText('Send a link')).toHaveStyle({
      ...theme.fonts.bodySmall,
      color: theme.colors.onSurfaceVariant,
    });
    // B3: trailing supporting uses labelLarge
    expect(screen.getByText('⌘S')).toHaveStyle({
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
    });
    // explicit aria-label stays on the menuitem
    expect(
      screen.getByRole('menuitem', {
        name: 'Share, send a link, keyboard shortcut Command S',
      })
    ).toBeOnTheScreen();
  });

  it('keeps fixed height for single-line items', async () => {
    await render(<Menu.Item title="Paste" testID="menu-item" />);
    expect(screen.getByTestId('menu-item')).toHaveStyle({ height: 48 });
  });

  it('uses dense item height of 32 when dense', async () => {
    await render(<Menu.Item title="Share" dense testID="menu-item" />);
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      height: MenuTokens.sizes.denseItemHeight,
      minHeight: MenuTokens.sizes.denseItemHeight,
    });
    expect(MenuTokens.sizes.denseItemHeight).toBe(32);
  });

  it('applies selected colors and aria-selected', async () => {
    const theme = LightTheme;
    await render(
      <Menu.Item title="Paste" selected testID="menu-item" onPress={() => {}} />
    );

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: true })
    );
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      backgroundColor: theme.colors.tertiaryContainer,
    });
    expect(screen.getByText('Paste')).toHaveStyle({
      color: theme.colors.onTertiaryContainer,
    });
  });

  it('disabled wins over selected for content opacity', async () => {
    await render(
      <Menu.Item
        title="Paste"
        selected
        disabled
        testID="menu-item"
        onPress={() => {}}
      />
    );

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ disabled: true })
    );
    // selected container is suppressed when disabled
    expect(screen.getByTestId('menu-item')).not.toHaveStyle({
      backgroundColor: LightTheme.colors.tertiaryContainer,
    });
    // I3: rendered content row must apply disabled opacity from the real path
    expect(contentRow('Paste')).toHaveStyle({
      opacity: stateOpacity.disabled,
    });
  });

  it('applies rendered disabled opacity on the content row', async () => {
    await render(<Menu.Item title="Cut" disabled />);
    expect(contentRow('Cut')).toHaveStyle({
      opacity: stateOpacity.disabled,
    });
  });

  it('applies full corner.medium radii on the morph shell when selected', async () => {
    const theme = LightTheme;
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);

    await render(
      <Menu.Item
        title="Paste"
        selected
        roundedTop
        roundedBottom={false}
        testID="menu-item"
      />
    );

    // Initial targets are full medium for selected (morph shell carries animated radii)
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
    });
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

  it('returns selected tertiary roles when selected', () => {
    const theme = LightTheme;
    expect(
      getMenuItemColor({
        theme,
        selected: true,
      })
    ).toMatchObject({
      titleColor: theme.colors.onTertiaryContainer,
      iconColor: theme.colors.onTertiaryContainer,
      containerColor: theme.colors.tertiaryContainer,
      contentOpacity: stateOpacity.enabled,
    });
  });

  it('ignores selected colors when disabled', () => {
    const theme = LightTheme;
    expect(
      getMenuItemColor({
        theme,
        selected: true,
        disabled: true,
      })
    ).toMatchObject({
      titleColor: theme.colors.onSurface,
      containerColor: undefined,
      contentOpacity: stateOpacity.disabled,
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

describe('Menu shape tokens', () => {
  it('resolves container border radius to corner.large', () => {
    const theme = LightTheme;
    expect(getMenuContainerBorderRadius(theme)).toBe(
      resolveCornerRadius(theme, MenuTokens.shapes.container)
    );
    expect(getMenuContainerBorderRadius(theme)).toBe(theme.shapes.corner.large);
  });

  it('resolves standard container fill to surfaceContainerLow (C1)', () => {
    const theme = LightTheme;
    expect(getMenuContainerColor({ theme, elevation: 2 })).toBe(
      theme.colors.surfaceContainerLow
    );
    expect(getMenuContainerColor({ theme, elevation: 2 })).not.toBe(
      theme.colors.elevation.level2
    );
    expect(MenuTokens.standardColors.container).toBe('surfaceContainerLow');
  });

  it('applies corner.medium on selected items', () => {
    const theme = LightTheme;
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);
    expect(getMenuItemBorderRadius({ theme, selected: true })).toMatchObject({
      borderRadius: radius,
    });
  });

  it('applies top/bottom corner.medium for first/last items', () => {
    const theme = LightTheme;
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);
    expect(getMenuItemBorderRadius({ theme, roundedTop: true })).toMatchObject({
      borderTopLeftRadius: radius,
      borderTopRightRadius: radius,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    });
    expect(
      getMenuItemBorderRadius({ theme, roundedBottom: true })
    ).toMatchObject({
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
    });
  });

  it('uses full corner.medium when morph/selected (shape morph target)', () => {
    const theme = LightTheme;
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);
    expect(
      getMenuItemMorphRadii({
        theme,
        morphActive: true,
        roundedTop: true,
        roundedBottom: false,
      })
    ).toMatchObject({
      topLeft: radius,
      topRight: radius,
      bottomLeft: radius,
      bottomRight: radius,
      medium: radius,
    });
    expect(
      getMenuItemBorderRadius({
        theme,
        selected: true,
        roundedTop: true,
        roundedBottom: false,
      })
    ).toMatchObject({ borderRadius: radius });
  });
});

describe('Menu.Item badge and submenu', () => {
  it('renders a numeric badge on the real Menu.Item', async () => {
    await render(<Menu.Item title="Inbox" badge={3} />);
    expect(screen.getByTestId('menu-item-badge')).toBeOnTheScreen();
    expect(screen.getByText('3')).toBeOnTheScreen();
  });

  it('renders a dot badge when badge is true', async () => {
    await render(<Menu.Item title="Alerts" badge />);
    expect(screen.getByTestId('menu-item-badge')).toBeOnTheScreen();
  });

  it('opens submenu content when pressed', async () => {
    const user = userEvent.setup();
    await render(
      <Portal.Host>
        <Menu.Item
          title="More"
          testID="parent-item"
          submenu={<Menu.Item title="Nested" testID="nested-item" />}
        />
      </Portal.Host>
    );

    await user.press(screen.getByRole('menuitem'));

    await waitFor(() => {
      expect(screen.getByTestId('nested-item')).toBeOnTheScreen();
    });
  });
});
