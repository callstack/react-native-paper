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

describe('accessibility', () => {
  it('forwards accessibilityState to the underlying touchable element', async () => {
    await render(
      <Chip
        onPress={() => {}}
        accessibilityState={{ checked: true, busy: true, expanded: false }}
      >
        Accessibility Chip
      </Chip>
    );

    expect(screen.getByRole('button')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true, busy: true, expanded: false })
    );
  });

  it('forwards aria-checked to the underlying touchable element', async () => {
    await render(
      <Chip onPress={() => {}} aria-checked={true}>
        Checkable Chip
      </Chip>
    );

    expect(screen.getByRole('button')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
  });

  it('prioritizes aria-checked over accessibilityState.checked', async () => {
    await render(
      <Chip
        onPress={() => {}}
        accessibilityState={{ checked: false }}
        aria-checked={true}
      >
        Chip
      </Chip>
    );

    expect(screen.getByRole('button')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
  });

  it('handles both selected and checked state simultaneously', async () => {
    await render(
      <Chip onPress={() => {}} selected aria-checked={true}>
        Selected Checked Chip
      </Chip>
    );

    expect(screen.getByRole('button')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true, selected: true })
    );
  });

  it('handles accessibilityState.selected when selected prop is omitted', async () => {
    await render(
      <Chip onPress={() => {}} accessibilityState={{ selected: true }}>
        Selected Chip
      </Chip>
    );

    expect(screen.getByRole('button')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: true })
    );
  });

  it('forwards aria-checked when role is checkbox', async () => {
    await render(
      <Chip onPress={() => {}} role="checkbox" aria-checked={true}>
        Checkbox Chip
      </Chip>
    );

    expect(screen.getByRole('checkbox')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
  });

  it('does not pass accessibilityState or aria-checked to the outer surface', async () => {
    await render(
      <Chip
        onPress={() => {}}
        testID="chip-touchable"
        accessibilityState={{ checked: true }}
        aria-checked={true}
      >
        Chip
      </Chip>
    );

    const touchable = screen.getByTestId('chip-touchable');
    const surface = touchable.parent;
    expect(surface).not.toHaveProp('accessibilityState');
    expect(surface).not.toHaveProp('aria-checked');
  });

  it('has default accessibilityState when accessibilityState and aria-checked are omitted', async () => {
    await render(<Chip onPress={() => {}}>Default Chip</Chip>);

    const button = screen.getByRole('button');
    expect(button).toHaveProp(
      'accessibilityState',
      expect.not.objectContaining({ checked: expect.anything() })
    );
    expect(button).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ selected: false, disabled: false })
    );
    expect(button).not.toHaveProp('aria-checked');
  });
});
