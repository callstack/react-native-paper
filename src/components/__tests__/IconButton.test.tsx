import { StyleSheet } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import { pink500 } from '../../theme/colors';
import { LightTheme } from '../../theme/schemes';
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

it('computes hitSlop from explicit width/height rather than the button size', async () => {
  await render(
    <IconButton testID="icon-button" icon="camera" width={20} height={20} />
  );

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('icon-button').props.hitSlop).toEqual({
    top: 14,
    bottom: 14,
    left: 14,
    right: 14,
  });
});

it('drops hitSlop when explicit width/height already meet the 48dp minimum', async () => {
  await render(
    <IconButton testID="icon-button" icon="camera" width={48} height={48} />
  );

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('icon-button').props.hitSlop).toBeUndefined();
});

it('renders icon change animated', async () => {
  const tree = (await render(<IconButton icon="camera" animated />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with custom border radius', async () => {
  const { toJSON } = await render(
    <IconButton
      icon="camera"
      testID="icon-button"
      size={36}
      onPress={() => {}}
      style={styles.square}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders icon button with small border radius', async () => {
  const { toJSON } = await render(
    <IconButton
      icon="camera"
      testID="icon-button"
      size={36}
      onPress={() => {}}
      style={styles.slightlyRounded}
    />
  );

  expect(toJSON()).toMatchSnapshot();
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
        theme: LightTheme,
        customIconColor: 'purple',
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        disabled: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurface,
      iconOpacity: stateOpacity.disabled,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained',
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.primary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained',
        selected: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onPrimary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained-tonal',
        selected: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSecondaryContainer,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'outlined',
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.inverseOnSurface,
    });
  });

  it('should return theme icon color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        selected: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.primary,
    });
  });
});

describe('getIconButtonColor - background color', () => {
  it('should return custom background color', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
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
          theme: LightTheme,
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: LightTheme.colors.onSurface,
        backgroundOpacity: stateOpacity.disabled,
      });
    })
  );

  it('should return theme icon color, for theme version 3, mode contained', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.surfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.primary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.surfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'contained-tonal',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.secondaryContainer,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined, selected', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.inverseSurface,
    });
  });

  it('should return undefined, for theme version 3, if mode not specified', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
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
        theme: LightTheme,
        disabled: true,
      })
    ).toMatchObject({
      borderColor: LightTheme.colors.outlineVariant,
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: LightTheme,
      })
    ).toMatchObject({
      borderColor: LightTheme.colors.outlineVariant,
    });
  });
});
