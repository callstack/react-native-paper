import { Platform } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
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

describe('Chip accessibility (Issue #5180)', () => {
  it('does not set aria-selected or aria-pressed by default when selected is not provided', async () => {
    await render(<Chip testID="chip">Action chip</Chip>);
    const chip = screen.getByTestId('chip');
    expect(chip).not.toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: expect.anything() })
    );
    expect(chip).not.toHaveProp('aria-pressed');
  });

  it('sets aria-selected on native when selected is provided', async () => {
    jest.replaceProperty(Platform, 'OS', 'ios');
    await render(
      <Chip selected testID="chip">
        Selected chip
      </Chip>
    );
    const chip = screen.getByTestId('chip');
    expect(chip).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: true })
    );
    expect(chip).not.toHaveProp('aria-pressed');
  });

  it('sets aria-pressed instead of aria-selected on web when role is button', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(
      <Chip selected testID="chip">
        Selected web chip
      </Chip>
    );
    const chip = screen.getByTestId('chip');
    expect(chip).toHaveProp('aria-pressed', true);
    expect(chip).not.toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: expect.anything() })
    );
  });

  it('sets aria-pressed to false on web when selected is false', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(
      <Chip selected={false} testID="chip">
        Unselected web chip
      </Chip>
    );
    const chip = screen.getByTestId('chip');
    expect(chip).toHaveProp('aria-pressed', false);
    expect(chip).not.toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: expect.anything() })
    );
  });

  it('keeps aria-selected on web when role is not button', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await render(
      <Chip selected role="option" testID="chip">
        Option chip
      </Chip>
    );
    const chip = screen.getByTestId('chip');
    expect(chip).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: true })
    );
    expect(chip).not.toHaveProp('aria-pressed');
  });
});
