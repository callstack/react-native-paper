import { StyleSheet } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen, userEvent } from '../../test-utils';
import { pink500 } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import IconButton from '../IconButton/IconButton';
import {
  getDimensions,
  getHitSlop,
  getIconButtonColor,
} from '../IconButton/utils';

const stateOpacity = tokens.md.sys.state.opacity;
const theme = getTheme();

const styles = StyleSheet.create({
  square: {
    borderRadius: 0,
  },
  slightlyRounded: {
    borderRadius: 4,
  },
  scaled: {
    transform: [{ scale: 1 }],
  },
});

it('renders icon button by default', async () => {
  const tree = (await render(<IconButton icon="camera" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" mode="filled" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders tonal icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" mode="tonal" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" mode="outlined" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extraLarge icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" size="extraLarge" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with color', async () => {
  const tree = (
    await render(<IconButton icon="camera" iconColor={pink500} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled icon button', async () => {
  const tree = (await render(<IconButton icon="camera" disabled />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon change animated', async () => {
  const tree = (await render(<IconButton icon="camera" animated />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with custom border radius', async () => {
  await render(
    <IconButton
      icon="camera"
      testID="icon-button"
      onPress={() => {}}
      style={styles.square}
    />
  );

  expect(screen.getByTestId('icon-button-container')).toHaveStyle({
    borderRadius: 0,
  });
});

it('renders icon button with small border radius', async () => {
  await render(
    <IconButton
      icon="camera"
      testID="icon-button"
      onPress={() => {}}
      style={styles.slightlyRounded}
    />
  );

  expect(screen.getByTestId('icon-button-container')).toHaveStyle({
    borderRadius: 4,
  });
});

it('applies a static transform from style', async () => {
  await render(
    <IconButton icon="camera" testID="icon-button" style={styles.scaled} />
  );

  expect(screen.getByTestId('icon-button-container')).toHaveStyle({
    transform: [{ scale: 1 }],
  });
});

it('calls onPress', async () => {
  const onPress = jest.fn();
  const user = userEvent.setup();

  await render(
    <IconButton icon="camera" testID="icon-button" onPress={onPress} />
  );
  await user.press(screen.getByTestId('icon-button'));

  expect(onPress).toHaveBeenCalledTimes(1);
});

describe('getIconButtonColor - icon color', () => {
  it('should return custom icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        customIconColor: 'purple',
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return disabled icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        disabled: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSurface,
      iconOpacity: stateOpacity.disabled,
    });
  });

  it('should return filled default icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
      })
    ).toMatchObject({
      iconColor: theme.colors.onPrimary,
    });
  });

  it('should return filled selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.onPrimary,
    });
  });

  it('should return filled unselected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
        selected: false,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSurfaceVariant,
    });
  });

  it('should return tonal default icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
      })
    ).toMatchObject({
      iconColor: theme.colors.onSecondaryContainer,
    });
  });

  it('should return tonal selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSecondary,
    });
  });

  it('should return outlined selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.inverseOnSurface,
    });
  });

  it('should return standard selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.primary,
    });
  });

  it('should return standard default icon color', () => {
    expect(
      getIconButtonColor({
        theme,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSurfaceVariant,
    });
  });
});

describe('getIconButtonColor - background color', () => {
  it('should return custom background color', () => {
    expect(
      getIconButtonColor({
        theme,
        customContainerColor: 'purple',
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  (['filled', 'tonal'] as const).forEach((mode) =>
    it(`should use 0.10 container opacity when disabled in ${mode} mode`, () => {
      expect(
        getIconButtonColor({
          theme,
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: theme.colors.onSurface,
        backgroundOpacity: 0.1,
      });
    })
  );

  it('should return filled default container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
      })
    ).toMatchObject({
      backgroundColor: theme.colors.primary,
    });
  });

  it('should return filled unselected container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
        selected: false,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.surfaceContainer,
    });
  });

  it('should return tonal default container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
      })
    ).toMatchObject({
      backgroundColor: theme.colors.secondaryContainer,
    });
  });

  it('should return tonal selected container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.secondary,
    });
  });

  it('should return outlined selected container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.inverseSurface,
      borderWidth: 0,
    });
  });

  it('should return undefined container for standard mode', () => {
    expect(
      getIconButtonColor({
        theme,
      })
    ).toMatchObject({
      backgroundColor: undefined,
    });
  });
});

describe('getIconButtonColor - border color', () => {
  it('should return outline variant when disabled', () => {
    expect(
      getIconButtonColor({
        theme,
        disabled: true,
      })
    ).toMatchObject({
      borderColor: theme.colors.outlineVariant,
    });
  });

  it('should return outline variant for outlined mode', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'outlined',
        outlineWidth: 1,
      })
    ).toMatchObject({
      borderColor: theme.colors.outlineVariant,
      borderWidth: 1,
    });
  });
});

describe('getDimensions', () => {
  it('returns small default size', () => {
    expect(getDimensions({ theme })).toMatchObject({
      width: 40,
      height: 40,
      iconSize: 24,
    });
  });

  it('returns extraSmall narrow size', () => {
    expect(
      getDimensions({ theme, size: 'extraSmall', width: 'narrow' })
    ).toMatchObject({
      width: 28,
      height: 32,
      iconSize: 20,
    });
  });

  it('returns extraLarge wide size', () => {
    expect(
      getDimensions({ theme, size: 'extraLarge', width: 'wide' })
    ).toMatchObject({
      width: 184,
      height: 136,
      iconSize: 40,
    });
  });
});

describe('getHitSlop', () => {
  it('expands extraSmall containers to a 48dp target', () => {
    expect(getHitSlop(32, 32)).toEqual({
      top: 8,
      bottom: 8,
      left: 8,
      right: 8,
    });
  });

  it('is omitted when the container already meets 48dp', () => {
    expect(getHitSlop(56, 56)).toBeUndefined();
  });
});
