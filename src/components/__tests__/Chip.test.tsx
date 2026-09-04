import { Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import * as Avatar from '../Avatar/Avatar';
import Chip from '../Chip/Chip';
import { getChipColors } from '../Chip/utils';

it('renders chip with onPress', async () => {
  const tree = (
    await render(<Chip onPress={() => {}}>Example Chip</Chip>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('exposes the label as the accessible name of the chip button', async () => {
  await render(<Chip onPress={() => {}}>Example Chip</Chip>);

  expect(
    screen.getByRole('button', { name: 'Example Chip' })
  ).toBeOnTheScreen();
});

it('exposes the accessible name for non-string children', async () => {
  await render(
    <Chip onPress={() => {}}>
      <Text>Example Chip</Text>
    </Chip>
  );

  expect(
    screen.getByRole('button', { name: 'Example Chip' })
  ).toBeOnTheScreen();
});

it('prefers an explicit aria-label over the derived one', async () => {
  await render(
    <Chip onPress={() => {}} aria-label="Custom label">
      Example Chip
    </Chip>
  );

  expect(
    screen.getByRole('button', { name: 'Custom label' })
  ).toBeOnTheScreen();
});

it('renders chip with icon', async () => {
  const tree = (
    await render(<Chip icon="information">Example Chip</Chip>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with close button', async () => {
  const tree = (
    await render(
      <Chip icon="information" onClose={() => {}}>
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with custom close button', async () => {
  const tree = (
    await render(
      <Chip icon="information" onClose={() => {}} closeIcon="arrow-down">
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with a generic trailing icon', async () => {
  const tree = (
    await render(
      <Chip icon="information" trailingIcon="menu-down">
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('calls onTrailingIconPress when the trailing icon is pressed', async () => {
  const onTrailingIconPress = jest.fn();
  const onClose = jest.fn();
  await render(
    <Chip
      trailingIcon="menu-down"
      onTrailingIconPress={onTrailingIconPress}
      trailingIconAccessibilityLabel="Show more options"
      onClose={onClose}
      testID="chip"
    >
      Example Chip
    </Chip>
  );

  await userEvent.press(screen.getByTestId('chip-trailing-icon'));

  expect(onTrailingIconPress).toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
});

it('prefers trailingIcon over the close icon when both trailingIcon and onClose are specified', async () => {
  const tree = (
    await render(
      <Chip trailingIcon="menu-down" onClose={() => {}}>
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined disabled chip', async () => {
  const tree = (
    await render(
      <Chip mode="outlined" disabled>
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders selected chip', async () => {
  const tree = (await render(<Chip selected>Example Chip</Chip>)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with avatar', async () => {
  const tree = (
    await render(
      <Chip avatar={<Avatar.Text label="XD" size={24} />}>Example Chip</Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders selected chip with avatar and a check overlay', async () => {
  const tree = (
    await render(
      <Chip selected avatar={<Avatar.Text label="XD" size={24} />}>
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('prefers icon over avatar when both are specified', async () => {
  const tree = (
    await render(
      <Chip icon="information" avatar={<Avatar.Text label="XD" size={24} />}>
        Example Chip
      </Chip>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled chip if there is no touch handler passed', async () => {
  await render(<Chip testID="disabled-chip">Disabled chip</Chip>);

  expect(screen.getByTestId('disabled-chip')).toBeDisabled();
});

it('renders active chip if only onLongPress handler is passed', async () => {
  await render(
    <Chip onLongPress={() => {}} testID="active-chip">
      Active chip
    </Chip>
  );

  expect(screen.getByTestId('active-chip')).toBeEnabled();
});

it('applies disabled opacity to the close button', async () => {
  await render(
    <Chip disabled onClose={() => {}} testID="disabled-chip">
      Disabled chip
    </Chip>
  );

  expect(screen.getByTestId('disabled-chip-close')).toHaveStyle({
    opacity: 0.38,
  });
});

it('overlays the close button on top of the chip so its ripple spans behind it', async () => {
  await render(
    <Chip onPress={() => {}} onClose={() => {}} testID="chip">
      Removable chip
    </Chip>
  );

  expect(screen.getByTestId('chip-close')).toHaveStyle({
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  });
});

it('clips the ripple to custom chip border radius', async () => {
  await render(
    <Chip onPress={() => {}} testID="rounded-chip" style={{ borderRadius: 16 }}>
      Rounded chip
    </Chip>
  );

  expect(screen.getByTestId('rounded-chip')).toHaveStyle({
    borderRadius: 16,
    overflow: 'hidden',
  });
});

it('renders close button with a circular state layer', async () => {
  await render(
    <Chip onClose={() => {}} testID="chip">
      Removable chip
    </Chip>
  );

  expect(screen.getByTestId('chip-close')).toHaveStyle({
    borderRadius: 16,
    overflow: 'hidden',
  });
});

it('renders chip with zero border radius', async () => {
  await render(
    <Chip testID="active-chip" theme={{ shapes: { corner: { small: 0 } } }}>
      Active chip
    </Chip>
  );

  expect(screen.getByTestId('active-chip')).toHaveStyle({
    borderRadius: 0,
  });
});

describe('getChipColors - text color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurface,
      contentOpacity: 0.38,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: 'purple',
    });
  });
});

describe('getChipColors - icon color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurface,
      contentOpacity: 0.38,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.primary,
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });
});

describe('getChipColor - selected background color', () => {
  it('should return custom color, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return custom color, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
        selected: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: getTheme().colors.secondaryContainer,
    });
  });
});

describe('getChipColor - background color', () => {
  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surface,
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceContainerLow,
    });
  });

  it('uses the precomputed state layer color for disabled filled chips', () => {
    const theme = getTheme();

    expect(
      getChipColors({
        theme,
        disabled: true,
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.stateLayerPressed,
    });
  });

  it('keeps the filled look for a disabled selected outlined chip', () => {
    const theme = getTheme();

    expect(
      getChipColors({
        theme,
        disabled: true,
        selected: true,
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: theme.colors.stateLayerPressed,
    });
  });

  it('stays unfilled for a disabled unselected outlined chip', () => {
    const theme = getTheme();

    expect(
      getChipColors({
        theme,
        disabled: true,
        selected: false,
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: 'transparent',
    });
  });
});

describe('getChipColor - ripple color', () => {
  it('uses the precomputed state layer color', () => {
    const theme = {
      ...getTheme(),
      colors: {
        ...getTheme().colors,
        stateLayerPressed: 'rgba(29, 27, 32, 0.1)',
      },
    };

    expect(
      getChipColors({
        theme,
        isOutlined: true,
      })
    ).toMatchObject({
      rippleColor: 'rgba(29, 27, 32, 0.1)',
      avatarOverlayColor: 'rgba(29, 27, 32, 0.1)',
    });
  });
});

describe('getChipColor - border color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        disabled: true,
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return custom color, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        selectedColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: 'purple',
    });
  });

  it('uses the tokenized outline color for disabled outlined chips', () => {
    const theme = getTheme();

    expect(
      getChipColors({
        theme,
        disabled: true,
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: theme.colors.outlineVariant,
    });
  });

  it('should return theme color, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: getTheme(false).colors.outlineVariant,
    });
  });

  it('should return theme color, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: getTheme(true).colors.outlineVariant,
    });
  });

  it('should return theme background color, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return theme background color, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('darkens the outline on focus, for theme version 3', () => {
    const theme = getTheme();

    expect(
      getChipColors({
        theme,
        isOutlined: true,
        focused: true,
      })
    ).toMatchObject({
      borderColor: theme.colors.onSurfaceVariant,
    });
  });

  it('does not darken the outline on focus for a selected chip', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
        selected: true,
        focused: true,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });
});
