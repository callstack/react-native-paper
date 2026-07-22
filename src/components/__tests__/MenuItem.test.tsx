import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import Menu from '../Menu/Menu';
import { MenuTokens } from '../Menu/tokens';
import {
  getMenuContainerBorderRadius,
  getMenuItemBorderRadius,
  getMenuItemColor,
} from '../Menu/utils';

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
        titleMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        leadingIcon="content-cut"
        onPress={() => {}}
        title="Cut"
      />
    );

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('menu-item-title').props.maxFontSizeMultiplier
    ).toBe(labelMaxFontSizeMultiplier);
  });

  it('accepts aria-checked prop', async () => {
    await render(<Menu.Item aria-checked={true} title="Option 1" />);

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
  });

  it('uses labelLarge for the title', async () => {
    await render(<Menu.Item title="Paste" />);

    expect(screen.getByTestId('menu-item-title')).toHaveStyle(
      getTheme().fonts.labelLarge
    );
  });

  it('renders supporting and trailing supporting text', async () => {
    await render(
      <Menu.Item
        title="Share"
        supportingText="Send a link"
        trailingSupportingText="⌘S"
        aria-label="Share, send a link, keyboard shortcut Command S"
      />
    );

    expect(screen.getByTestId('menu-item-supporting')).toHaveTextContent(
      'Send a link'
    );
    expect(
      screen.getByTestId('menu-item-trailing-supporting')
    ).toHaveTextContent('⌘S');
    // two-line anatomy must not use fixed 48 height (would clip supporting)
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      minHeight: 48,
      paddingVertical: 8,
    });
    // Supporting + trailing content is user-visible; explicit aria-label stays on the menuitem
    expect(screen.getByText('Send a link')).toBeOnTheScreen();
    expect(screen.getByText('⌘S')).toBeOnTheScreen();
    expect(
      screen.getByRole('menuitem', {
        name: 'Share, send a link, keyboard shortcut Command S',
      })
    ).toBeOnTheScreen();
  });

  it('keeps fixed height for single-line items', async () => {
    await render(<Menu.Item title="Paste" />);
    expect(screen.getByTestId('menu-item')).toHaveStyle({ height: 48 });
  });

  it('applies selected colors and aria-selected', async () => {
    const theme = getTheme();
    await render(<Menu.Item title="Paste" selected />);

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: true })
    );
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      backgroundColor: theme.colors.tertiaryContainer,
    });
    expect(screen.getByTestId('menu-item-title')).toHaveStyle({
      color: theme.colors.onTertiaryContainer,
    });
  });

  it('disabled wins over selected for content opacity', async () => {
    await render(<Menu.Item title="Paste" selected disabled />);

    expect(screen.getByRole('menuitem')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ disabled: true })
    );
    // selected container is suppressed when disabled
    expect(screen.getByTestId('menu-item')).not.toHaveStyle({
      backgroundColor: getTheme().colors.tertiaryContainer,
    });
  });
});

describe('getMenuItemColor - title color', () => {
  it('should return disabled color if disabled, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      titleColor: getTheme().colors.onSurface,
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      titleColor: getTheme().colors.onSurface,
    });
  });

  it('returns selected tertiary roles when selected', () => {
    const theme = getTheme();
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
    const theme = getTheme();
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
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });
});

describe('Menu shape tokens', () => {
  it('resolves container border radius to corner.large', () => {
    const theme = getTheme();
    expect(getMenuContainerBorderRadius(theme)).toBe(
      resolveCornerRadius(theme, MenuTokens.shapes.container)
    );
    expect(getMenuContainerBorderRadius(theme)).toBe(theme.shapes.corner.large);
  });

  it('applies corner.medium on selected items', () => {
    const theme = getTheme();
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);
    expect(getMenuItemBorderRadius({ theme, selected: true })).toMatchObject({
      borderRadius: radius,
    });
  });

  it('applies top/bottom corner.medium for first/last items', () => {
    const theme = getTheme();
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
});
