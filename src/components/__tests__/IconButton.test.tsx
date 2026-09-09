import { StyleSheet } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { pink500 } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import IconButton from '../IconButton/IconButton';
import { getIconButtonColor } from '../IconButton/utils';

const stateOpacity = tokens.md.sys.state.opacity;

const styles = StyleSheet.create({
  square: {
    borderRadius: 0,
  },
  slightlyRounded: {
    borderRadius: 4,
  },
});

it('renders icon button by default', async () => {
  const tree = (await render(<IconButton icon="camera" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with color', async () => {
  const tree = (
    await render(<IconButton icon="camera" iconColor={pink500} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with size', async () => {
  const tree = (await render(<IconButton icon="camera" size={30} />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled icon button', async () => {
  const tree = (await render(<IconButton icon="camera" disabled />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('expands hitSlop up to the 48dp minimum for a button smaller than that', async () => {
  await render(<IconButton testID="icon-button" icon="camera" />);

  // (48 - 40) / 2 on every side, for the default 24dp icon plus 8dp padding
  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('icon-button').props.hitSlop).toEqual({
    top: 4,
    bottom: 4,
    left: 4,
    right: 4,
  });
});

it('gives a disabled button no hitSlop of its own', async () => {
  await render(<IconButton testID="icon-button" icon="camera" disabled />);

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('icon-button').props.hitSlop).toBeUndefined();
});

it('lets a caller-supplied hitSlop win even while disabled', async () => {
  await render(
    <IconButton testID="icon-button" icon="camera" disabled hitSlop={2} />
  );

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('icon-button').props.hitSlop).toBe(2);
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
      size={36}
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
      size={36}
      onPress={() => {}}
      style={styles.slightlyRounded}
    />
  );

  expect(screen.getByTestId('icon-button-container')).toHaveStyle({
    borderRadius: 4,
  });
});

it('clips to a custom corner radius', async () => {
  await render(
    <IconButton
      icon="camera"
      testID="icon-button"
      size={36}
      onPress={() => {}}
      borderTopLeftRadius={0}
    />
  );

  // The container stopped clipping so the touch target can escape it, so the
  // touchable has to take the shape itself, corners included.
  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderTopLeftRadius: 0,
  });
});

describe('getIconButtonColor - icon color', () => {
  it('should return custom icon color', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        customIconColor: 'purple',
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurface,
      iconOpacity: stateOpacity.disabled,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      iconColor: getTheme().colors.primary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onPrimary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.inverseOnSurface,
    });
  });

  it('should return theme icon color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.primary,
    });
  });
});

describe('getIconButtonColor - background color', () => {
  it('should return custom background color', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        customContainerColor: 'purple',
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  (['contained', 'contained-tonal'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, ${mode} mode`, () => {
      expect(
        getIconButtonColor({
          theme: getTheme(),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: getTheme().colors.onSurface,
        backgroundOpacity: stateOpacity.disabled,
      });
    })
  );

  it('should return theme icon color, for theme version 3, mode contained', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.inverseSurface,
    });
  });

  it('should return undefined, for theme version 3, if mode not specified', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      backgroundColor: undefined,
    });
  });
});

describe('getIconButtonColor - border color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outlineVariant,
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outlineVariant,
    });
  });
});
