import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
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

  it('accepts different values for accessibilityState', async () => {
    await render(
      <Menu.Item
        accessibilityState={{ checked: true }}
        title="Option 1"
        testID="touchable"
      />
    );

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('touchable').props.accessibilityState
    ).toMatchObject({
      checked: true,
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
