import { Platform, StyleSheet } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';

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
  customBackground: {
    backgroundColor: pink500,
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

// A touch in the slop goes to the view that owns it, so a disabled button with
// a slop would take touches meant for its neighbors
it('ignores a caller-supplied hitSlop while disabled', async () => {
  await render(
    <IconButton
      icon="camera"
      disabled
      onPress={() => {}}
      hitSlop={2}
      testID="icon-button"
    />
  );

  expect(screen.getByTestId('icon-button')).not.toHaveProp('hitSlop');
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

it('keeps touchable content centered with custom container style', async () => {
  await render(
    <IconButton
      icon="delete"
      onPress={() => {}}
      style={styles.customBackground}
    />
  );
  expect(screen.getByRole('button')).toHaveStyle({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  });
});

it('keeps handler-less content centered with custom container style', async () => {
  await render(
    <IconButton
      icon="delete"
      testID="icon-button"
      style={styles.customBackground}
    />
  );
  expect(screen.getByTestId('icon-button')).toHaveStyle({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

  it('should let the disabled color outrank an explicit icon color', () => {
    // a disabled icon reads as disabled whatever color it was given
    expect(
      getIconButtonColor({
        theme: LightTheme,
        disabled: true,
        customIconColor: 'purple',
      })
    ).toMatchObject({
      iconColor: LightTheme.colors.onSurface,
      iconOpacity: stateOpacity.disabled,
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

describe('hitSlop', () => {
  it('keeps the 48dp default when a forwarded hitSlop is undefined', async () => {
    await render(
      <IconButton
        icon="camera"
        onPress={() => {}}
        hitSlop={undefined}
        testID="icon-button"
      />
    );

    expect(screen.getByTestId('icon-button')).toHaveProp('hitSlop', {
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
    });
  });

  it('takes `0` as an opt out', async () => {
    await render(
      <IconButton
        icon="camera"
        onPress={() => {}}
        hitSlop={0}
        testID="icon-button"
      />
    );

    expect(screen.getByTestId('icon-button')).toHaveProp('hitSlop', 0);
  });
});

describe('without a touch handler', () => {
  describe.each(['ios', 'android'] as const)('on %s', (os) => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', os);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('keeps its label but is no image', async () => {
      await render(<IconButton icon="heart" aria-label="Favorite" />);

      expect(screen.getByLabelText('Favorite')).toBeOnTheScreen();
      expect(screen.queryByRole('img')).not.toBeOnTheScreen();
    });
  });

  // On web the dropped role renders role="presentation", which can't carry a
  // name, so the label would sit on an element that may not be announced
  describe('on web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('is an image named by its label', async () => {
      await render(<IconButton icon="heart" aria-label="Favorite" />);

      expect(screen.getByRole('img', { name: 'Favorite' })).toBeOnTheScreen();
    });

    it('stays a button with a touch handler', async () => {
      await render(
        <IconButton icon="heart" aria-label="Favorite" onPress={() => {}} />
      );

      expect(
        screen.getByRole('button', { name: 'Favorite' })
      ).toBeOnTheScreen();
    });

    it('stays a disabled button when disabled', async () => {
      await render(<IconButton icon="heart" aria-label="Favorite" disabled />);

      expect(screen.getByRole('button', { name: 'Favorite' })).toBeDisabled();
    });

    it.each(['onLongPress', 'onPressIn', 'onPressOut'] as const)(
      'stays a button with only %s',
      async (name) => {
        await render(
          <IconButton
            icon="heart"
            aria-label="Favorite"
            {...{ [name]: () => {} }}
          />
        );

        expect(
          screen.getByRole('button', { name: 'Favorite' })
        ).toBeOnTheScreen();
      }
    );

    it('stays a button while it reports a toggle state', async () => {
      await render(
        <IconButton icon="heart" aria-label="Favorite" aria-pressed={false} />
      );

      expect(
        screen.getByRole('button', { name: 'Favorite' })
      ).toBeOnTheScreen();
    });

    it('treats an explicit button role like the default', async () => {
      await render(
        <IconButton icon="heart" aria-label="Favorite" role="button" />
      );

      expect(screen.getByRole('img', { name: 'Favorite' })).toBeOnTheScreen();
    });
  });
});
