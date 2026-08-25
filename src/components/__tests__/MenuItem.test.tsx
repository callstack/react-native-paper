import { Animated } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import Menu from '../Menu/Menu';
import { runMenuCloseMotion, runMenuOpenMotion } from '../Menu/motion';
import { MenuTokens } from '../Menu/tokens';
import {
  getMenuContainerBorderRadius,
  getMenuContainerColor,
  getMenuItemBorderRadius,
  getMenuItemColor,
} from '../Menu/utils';

const stateOpacity = tokens.md.sys.state.opacity;

/** Read an Animated.Value without reaching into its internals. */
const currentValue = (node: Animated.Value) => {
  let value = NaN;
  node.stopAnimation((v) => {
    value = v;
  });
  return value;
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
    const theme = getTheme();
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
    // B2: supporting uses bodySmall + onSurfaceVariant
    expect(screen.getByTestId('menu-item-supporting')).toHaveStyle({
      ...theme.fonts.bodySmall,
      color: theme.colors.onSurfaceVariant,
    });
    // B3: trailing supporting uses labelLarge
    expect(screen.getByTestId('menu-item-trailing-supporting')).toHaveStyle({
      ...theme.fonts.labelLarge,
      color: theme.colors.onSurfaceVariant,
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

  it('renders numeric supporting text values like 0', async () => {
    await render(
      <Menu.Item title="Unread" supportingText={0} trailingSupportingText={0} />
    );

    expect(screen.getByTestId('menu-item-supporting')).toHaveTextContent('0');
    expect(
      screen.getByTestId('menu-item-trailing-supporting')
    ).toHaveTextContent('0');
  });

  it('ignores boolean placeholders for supporting text', async () => {
    await render(
      <Menu.Item
        title="Paste"
        supportingText={false}
        trailingSupportingText={false}
      />
    );

    expect(screen.queryByTestId('menu-item-supporting')).toBeNull();
    expect(screen.queryByTestId('menu-item-trailing-supporting')).toBeNull();
  });

  it('grows for a trailing-only row so large font scales are not clipped', async () => {
    await render(<Menu.Item title="Share" trailingSupportingText="⌘S" />);

    expect(screen.getByTestId('menu-item')).toHaveStyle({
      minHeight: MenuTokens.sizes.itemHeight,
      paddingVertical: 8,
    });
    expect(screen.getByTestId('menu-item')).not.toHaveStyle({
      height: MenuTokens.sizes.itemHeight,
    });
  });

  it('caps supporting text font scaling like the title', async () => {
    await render(
      <Menu.Item
        title="Share"
        supportingText="Send a link"
        trailingSupportingText="⌘S"
        supportingTextMaxFontSizeMultiplier={2}
        trailingSupportingTextMaxFontSizeMultiplier={3}
      />
    );

    expect(screen.getByTestId('menu-item-supporting')).toHaveProp(
      'maxFontSizeMultiplier',
      2
    );
    expect(screen.getByTestId('menu-item-trailing-supporting')).toHaveProp(
      'maxFontSizeMultiplier',
      3
    );
  });

  it('defaults supporting text scaling to the title cap', async () => {
    await render(
      <Menu.Item
        title="Share"
        supportingText="Send a link"
        trailingSupportingText="⌘S"
      />
    );

    expect(screen.getByTestId('menu-item-supporting')).toHaveProp(
      'maxFontSizeMultiplier',
      1.5
    );
    expect(screen.getByTestId('menu-item-trailing-supporting')).toHaveProp(
      'maxFontSizeMultiplier',
      1.5
    );
  });

  it('pins trailing supporting text to the trailing edge', async () => {
    await render(<Menu.Item title="Copy" trailingSupportingText="⌘C" />);

    // row stretches so the auto margin has space to push against
    expect(screen.getByTestId('menu-item-content')).toHaveStyle({
      alignSelf: 'stretch',
    });
    expect(screen.getByTestId('menu-item-trailing-supporting')).toHaveStyle({
      marginLeft: 'auto',
    });
  });

  it('keeps fixed height for single-line items', async () => {
    await render(<Menu.Item title="Paste" />);
    expect(screen.getByTestId('menu-item')).toHaveStyle({ height: 48 });
  });

  it('uses dense item height of 32 when dense', async () => {
    await render(<Menu.Item title="Share" dense />);
    expect(screen.getByTestId('menu-item')).toHaveStyle({
      height: MenuTokens.sizes.denseItemHeight,
      minHeight: MenuTokens.sizes.denseItemHeight,
    });
    expect(MenuTokens.sizes.denseItemHeight).toBe(32);
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
    // I3: rendered content row must apply disabled opacity from the real path
    expect(screen.getByTestId('menu-item-content')).toHaveStyle({
      opacity: stateOpacity.disabled,
    });
  });

  it('applies rendered disabled opacity on the content row', async () => {
    await render(<Menu.Item title="Cut" disabled />);
    expect(screen.getByTestId('menu-item-content')).toHaveStyle({
      opacity: stateOpacity.disabled,
    });
  });

  it('applies corner.medium on all sides when selected', async () => {
    const theme = getTheme();
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);

    await render(
      <Menu.Item title="Paste" selected roundedTop roundedBottom={false} />
    );

    expect(screen.getByTestId('menu-item')).toHaveStyle({
      borderRadius: radius,
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

  it('resolves standard container fill to surfaceContainerLow (C1)', () => {
    const theme = getTheme();
    expect(getMenuContainerColor({ theme, elevation: 2 })).toBe(
      theme.colors.surfaceContainerLow
    );
    expect(getMenuContainerColor({ theme, elevation: 2 })).not.toBe(
      theme.colors.elevation.level2
    );
    expect(MenuTokens.standardColors.container).toBe('surfaceContainerLow');
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

  it('uses full corner.medium when selected even if only roundedTop was set', () => {
    const theme = getTheme();
    const radius = resolveCornerRadius(theme, MenuTokens.shapes.item);
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

describe('Menu open/close motion (I6 / D2)', () => {
  it('snaps scale and opacity when reduce-motion is enabled', () => {
    const theme = getTheme();
    const scale = new Animated.ValueXY({ x: 0, y: 0 });
    const opacity = new Animated.Value(0);
    const springSpy = jest.spyOn(Animated, 'spring');
    const finish = jest.fn();

    const path = runMenuOpenMotion({
      reduceMotion: true,
      scaleAnimation: scale,
      opacityAnimation: opacity,
      menuWidth: 200,
      menuHeight: 100,
      theme,
      onFinish: finish,
    });

    expect(path).toBe('snap');
    expect(springSpy).not.toHaveBeenCalled();
    expect(finish).toHaveBeenCalled();
    // Concrete snap values on the real Animated drivers Menu uses

    expect(currentValue(opacity)).toBe(1);

    expect(currentValue(scale.x)).toBe(200);

    expect(currentValue(scale.y)).toBe(100);

    springSpy.mockRestore();
  });

  it('uses spring when reduce-motion is off', () => {
    const theme = getTheme();
    const scale = new Animated.ValueXY({ x: 0, y: 0 });
    const opacity = new Animated.Value(0);
    const springSpy = jest.spyOn(Animated, 'spring');
    const finish = jest.fn();

    const path = runMenuOpenMotion({
      reduceMotion: false,
      scaleAnimation: scale,
      opacityAnimation: opacity,
      menuWidth: 200,
      menuHeight: 100,
      theme,
      onFinish: finish,
    });

    expect(path).toBe('spring');
    expect(springSpy).toHaveBeenCalled();
    springSpy.mockRestore();
  });

  it('snaps opacity to 0 on close when reduce-motion is enabled', () => {
    const theme = getTheme();
    const opacity = new Animated.Value(1);
    const springSpy = jest.spyOn(Animated, 'spring');
    const finish = jest.fn();

    const path = runMenuCloseMotion({
      reduceMotion: true,
      opacityAnimation: opacity,
      theme,
      onFinish: finish,
    });

    expect(path).toBe('snap');
    expect(springSpy).not.toHaveBeenCalled();
    expect(finish).toHaveBeenCalled();

    expect(currentValue(opacity)).toBe(0);
    springSpy.mockRestore();
  });
});
