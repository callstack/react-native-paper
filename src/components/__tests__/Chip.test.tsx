import { Animated } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import Chip from '../Chip/Chip';
import { getChipColors } from '../Chip/helpers';

it('renders chip with onPress', async () => {
  const tree = (
    await render(<Chip label="Example Chip" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with icon', async () => {
  const tree = (
    await render(<Chip icon="information" label="Example Chip" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with close button', async () => {
  const tree = (
    await render(
      <Chip icon="information" label="Example Chip" onClose={() => {}} />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with custom close button', async () => {
  const tree = (
    await render(
      <Chip
        icon="information"
        label="Example Chip"
        onClose={() => {}}
        closeIcon="arrow-down"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined disabled chip', async () => {
  const tree = (
    await render(<Chip label="Example Chip" mode="outlined" disabled />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders selected chip', async () => {
  const tree = (await render(<Chip label="Example Chip" selected />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled chip if there is no touch handler passed', async () => {
  await render(<Chip label="Disabled chip" testID="disabled-chip" />);

  expect(screen.getByTestId('disabled-chip')).toBeDisabled();
});

it('renders active chip if only onLongPress handler is passed', async () => {
  await render(
    <Chip label="Active chip" onLongPress={() => {}} testID="active-chip" />
  );

  expect(screen.getByTestId('active-chip')).toBeEnabled();
});

it('applies disabled opacity to the close button', async () => {
  await render(
    <Chip
      label="Disabled chip"
      disabled
      onClose={() => {}}
      testID="disabled-chip"
    />
  );

  expect(screen.getByTestId('disabled-chip-close')).toHaveStyle({
    opacity: 0.38,
  });
});

it('renders chip with zero border radius', async () => {
  await render(
    <Chip
      label="Active chip"
      testID="active-chip"
      theme={{ shapes: { corner: { small: 0 } } }}
    />
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
  it('should return custom color', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

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

  it('should return custom color, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
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
});

it('animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  await render(
    <Chip
      label="Example Chip"
      onPress={() => {}}
      testID="chip"
      style={[{ transform: [{ scale: value }] }]}
    />
  );
  expect(screen.getByTestId('chip-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(screen.getByTestId('chip-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
