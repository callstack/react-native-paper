import { Platform } from 'react-native';

import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
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
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  describe('web', () => {
    beforeEach(() => {
      Platform.OS = 'web';
    });

    it('does not expose aria-pressed for an action Chip when selected is omitted', async () => {
      await render(<Chip onPress={() => {}}>Action Chip</Chip>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveProp('aria-pressed');
    });

    it('exposes aria-pressed as true when selected is true', async () => {
      await render(
        <Chip onPress={() => {}} selected={true}>
          Selected Chip
        </Chip>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveProp('aria-pressed', true);
    });

    it('exposes aria-pressed as false when selected is explicitly false', async () => {
      await render(
        <Chip onPress={() => {}} selected={false}>
          Unselected Chip
        </Chip>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveProp('aria-pressed', false);
    });

    it('removes aria-selected from the interactive button', async () => {
      await render(
        <Chip onPress={() => {}} selected={true}>
          Toggle Chip
        </Chip>
      );

      const button = screen.getByRole('button');
      expect(button).not.toHaveProp('aria-selected');
    });

    it('removes aria-selected when selected is omitted', async () => {
      await render(<Chip onPress={() => {}}>Action Chip</Chip>);

      const button = screen.getByRole('button');
      expect(button).not.toHaveProp('aria-selected');
    });
  });

  describe('native', () => {
    it('preserves selected state when selected is true', async () => {
      await render(
        <Chip onPress={() => {}} selected={true}>
          Selected Chip
        </Chip>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveProp(
        'accessibilityState',
        expect.objectContaining({ selected: true })
      );
    });

    it('produces native selected state false when selected is explicitly false', async () => {
      await render(
        <Chip onPress={() => {}} selected={false}>
          Unselected Chip
        </Chip>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveProp(
        'accessibilityState',
        expect.objectContaining({ selected: false })
      );
    });

    it('produces native selected state false when selected is omitted', async () => {
      await render(<Chip onPress={() => {}}>Default Chip</Chip>);

      const button = screen.getByRole('button');
      expect(button).toHaveProp(
        'accessibilityState',
        expect.objectContaining({ selected: false })
      );
    });
  });

  it('does not forward accessibilityState or aria-checked to the outer Surface or interactive TouchableRipple', async () => {
    await render(
      <Chip
        onPress={() => {}}
        testID="chip-touchable"
        accessibilityState={{ checked: true, busy: true }}
        aria-checked={true}
      >
        Chip
      </Chip>
    );

    const touchable = screen.getByTestId('chip-touchable');
    const surface = touchable.parent;

    expect(surface).not.toHaveProp('accessibilityState');
    expect(surface).not.toHaveProp('aria-checked');

    expect(touchable).not.toHaveProp('aria-checked');
    expect(touchable).toHaveProp(
      'accessibilityState',
      expect.not.objectContaining({
        checked: expect.anything(),
        busy: expect.anything(),
      })
    );
  });

  it('does not forward accessibilityState or aria-checked to the interactive button by default', async () => {
    await render(<Chip onPress={() => {}}>Default Chip</Chip>);

    const button = screen.getByRole('button');
    expect(button).not.toHaveProp('aria-checked');
    expect(button).toHaveProp(
      'accessibilityState',
      expect.not.objectContaining({ checked: expect.anything() })
    );
  });
});
