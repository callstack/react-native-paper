import * as React from 'react';

import { render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import Menu from '../Menu/Menu';
import { getMenuItemColor } from '../Menu/utils';

describe('Menu Item', () => {
  it('renders menu item', () => {
    const tree = render(
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
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should have titleMaxFontSizeMultiplier passed to title', () => {
    const labelMaxFontSizeMultiplier = 2;

    const { getByTestId } = render(
      <Menu.Item
        titleMaxFontSizeMultiplier={labelMaxFontSizeMultiplier}
        leadingIcon="content-cut"
        onPress={() => {}}
        title="Cut"
      />
    );

    expect(getByTestId('menu-item-title').props.maxFontSizeMultiplier).toBe(
      labelMaxFontSizeMultiplier
    );
  });

  it('accepts different values for accessibilityState', () => {
    const { getByTestId } = render(
      <Menu.Item
        accessibilityState={{ checked: true }}
        title="Option 1"
        testID="touchable"
      />
    );

    expect(getByTestId('touchable').props.accessibilityState).toMatchObject({
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
    ).toMatchObject({ titleColor: getTheme().colors.onSurfaceDisabled });
  });

  it('should return disabled color if disabled, for theme version 2, light theme', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      titleColor: color(black).alpha(0.32).rgb().string(),
    });
  });

  it('should return disabled color if disabled, for theme version 2, dark theme', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(true, false),
        disabled: true,
      })
    ).toMatchObject({
      titleColor: color(white).alpha(0.32).rgb().string(),
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

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      titleColor: color(getTheme(false, false).colors.text)
        .alpha(0.87)
        .rgb()
        .string(),
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
    ).toMatchObject({ iconColor: getTheme().colors.onSurfaceDisabled });
  });

  it('should return disabled color if disabled, for theme version 2, light theme', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      iconColor: color(black).alpha(0.32).rgb().string(),
    });
  });

  it('should return disabled color if disabled, for theme version 2, dark theme', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(true, false),
        disabled: true,
      })
    ).toMatchObject({
      iconColor: color(white).alpha(0.32).rgb().string(),
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

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      iconColor: color(getTheme(false, false).colors.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });
});

describe('getMenuItemColor - ripple color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return undefined, for theme version 2', () => {
    expect(
      getMenuItemColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      rippleColor: undefined,
    });
  });
});
