import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import Chip from '../Chip/Chip';
import { getChipColors } from '../Chip/helpers';

const stateOpacity = tokens.md.sys.state.opacity;

it('renders chip with onPress', async () => {
  const tree = (
    await render(<Chip onPress={() => {}}>Example Chip</Chip>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
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
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSecondaryContainer,
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
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
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
      backgroundColor: getTheme().colors.secondaryContainer,
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
      borderColor: color('purple').alpha(0.29).rgb().string(),
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
