import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { render, screen } from '../../test-utils';
import { DarkTheme, LightTheme } from '../../theme/schemes';
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

it('expands hitSlop up to the 48dp minimum when enabled', async () => {
  await render(
    <Chip testID="active-chip" onPress={() => {}}>
      Active chip
    </Chip>
  );

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('active-chip').props.hitSlop).toEqual({
    top: 8,
    bottom: 8,
    left: 0,
    right: 0,
  });
});

it('gives a disabled Chip no hitSlop of its own', async () => {
  await render(
    <Chip testID="disabled-chip" disabled onPress={() => {}}>
      Disabled chip
    </Chip>
  );

  // eslint-disable-next-line no-restricted-syntax
  expect(screen.getByTestId('disabled-chip').props.hitSlop).toBeUndefined();
});

describe('getChipColors - text color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: LightTheme.colors.onSurface,
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: LightTheme.colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: true,
      })
    ).toMatchObject({
      textColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: LightTheme,
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
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurface,
      contentOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: true,
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });
});

describe('getChipColor - background color', () => {
  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.surface,
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.secondaryContainer,
    });
  });
});

describe('getChipColor - border color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: LightTheme,
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
        theme: LightTheme,
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
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return custom color, outlined mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        selectedColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color('purple').alpha(0.29).rgb().string(),
    });
  });

  it('should return theme color, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: LightTheme.colors.outlineVariant,
    });
  });

  it('should return theme color, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: DarkTheme,
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: DarkTheme.colors.outlineVariant,
    });
  });

  it('should return theme background color, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: LightTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return theme background color, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: DarkTheme,
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });
});

describe('close affordance', () => {
  // The chip already reserved room on its right, but only the icon was tappable,
  // so the body owned the rest of that column. MD3 has the primary action stop
  // where the trailing one starts.
  it('fills the column the chip reserves for it', async () => {
    await render(
      <Chip onPress={() => {}} onClose={() => {}}>
        Example
      </Chip>
    );

    expect(screen.getByLabelText('Close')).toHaveStyle({
      width: '100%',
      height: '100%',
    });
  });

  it('keeps the close glyph pinned right so it does not drift', async () => {
    await render(
      <Chip testID="chip" onPress={() => {}} onClose={() => {}}>
        Example
      </Chip>
    );

    // `styles.icon` sets alignSelf center, which would otherwise win and move
    // the glyph 4dp left
    expect(screen.getByTestId('chip-close-icon')).toHaveStyle({
      alignSelf: 'flex-end',
    });
  });

  it('is not rendered without onClose', async () => {
    await render(<Chip onPress={() => {}}>Example</Chip>);

    expect(screen.queryByLabelText('Close')).not.toBeOnTheScreen();
  });
});
