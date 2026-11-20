import { useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import color from 'color';

import PaperProvider from '../../core/PaperProvider';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import { pink500 } from '../../theme/colors';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import { toSpringCurve } from '../../theme/tokens/sys/motion';
import IconButton from '../IconButton/IconButton';
import { IconButtonTokens } from '../IconButton/tokens';
import {
  getDimensions,
  getIconButtonColor,
  resolveShapeToken,
} from '../IconButton/utils';
import * as rippleUtils from '../TouchableRipple/utils';

const stateOpacity = tokens.md.sys.state.opacity;
const theme = LightTheme;

const styles = StyleSheet.create({
  scaled: {
    transform: [{ scale: 1 }],
  },
  customBackground: {
    backgroundColor: pink500,
  },
});

it('renders icon button by default', async () => {
  const tree = (await render(<IconButton icon="camera" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" mode="filled" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders tonal icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" mode="tonal" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" mode="outlined" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extra-large icon button', async () => {
  const tree = (
    await render(<IconButton icon="camera" size="extra-large" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with color', async () => {
  const tree = (
    await render(<IconButton icon="camera" iconColor={pink500} />)
  ).toJSON();

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

it('renders a square icon button', async () => {
  const tree = (
    await render(
      <IconButton
        icon="camera"
        testID="icon-button"
        shape="square"
        onPress={() => {}}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('applies a static transform from style', async () => {
  const tree = (
    await render(
      <IconButton icon="camera" testID="icon-button" style={styles.scaled} />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('calls onPress', async () => {
  const onPress = jest.fn();
  const user = userEvent.setup();

  await render(
    <IconButton icon="camera" testID="icon-button" onPress={onPress} />
  );
  await user.press(screen.getByTestId('icon-button'));

  expect(onPress).toHaveBeenCalledTimes(1);
});

it.each([true, false])(
  'announces the toggle state %s with aria-checked on native',
  async (selected) => {
    await render(
      <IconButton icon="camera" selected={selected} onPress={() => {}} />
    );

    expect(screen.getByRole('button')).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: selected })
    );
    expect(screen.getByRole('button')).not.toBeSelected();
  }
);

it('does not claim a toggle state without `selected`', async () => {
  await render(<IconButton icon="camera" onPress={() => {}} />);

  expect(screen.getByRole('button')).not.toHaveProp(
    'accessibilityState',
    expect.objectContaining({ checked: expect.any(Boolean) })
  );
});

it('does not expose a selected state when it is not a toggle', async () => {
  await render(<IconButton icon="camera" onPress={() => {}} />);

  expect(screen.getByRole('button')).toHaveProp(
    'accessibilityState',
    expect.objectContaining({ selected: undefined })
  );
});

it('uses a square resting shape when a round button is selected', async () => {
  await render(
    <IconButton
      icon="camera"
      testID="icon-button"
      selected
      onPress={() => {}}
    />
  );

  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: theme.shapes.corner.medium,
  });
});

it('keeps the inverted resting shape after a tap that selects the button', async () => {
  const ToggleIconButton = () => {
    const [selected, setSelected] = useState(false);

    return (
      <IconButton
        icon="camera"
        testID="icon-button"
        selected={selected}
        onPress={() => setSelected((value) => !value)}
      />
    );
  };
  const user = userEvent.setup();

  await render(<ToggleIconButton />);
  await user.press(screen.getByTestId('icon-button'));

  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: theme.shapes.corner.medium,
  });

  await user.press(screen.getByTestId('icon-button'));

  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: getDimensions({ theme }).restingRadius,
  });
});

it('morphs to the pressed shape with only onLongPress', async () => {
  await render(
    <IconButton icon="camera" testID="icon-button" onLongPress={() => {}} />
  );

  await fireEvent(screen.getByTestId('icon-button'), 'pressIn');

  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: getDimensions({ theme }).pressedRadius,
  });
});

it('drops the pressed shape when the handler is removed mid-press', async () => {
  const { rerender } = await render(
    <IconButton icon="camera" testID="icon-button" onPress={() => {}} />
  );

  await fireEvent(screen.getByTestId('icon-button'), 'pressIn');
  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: getDimensions({ theme }).pressedRadius,
  });

  await rerender(<IconButton icon="camera" testID="icon-button" />);
  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: getDimensions({ theme }).restingRadius,
  });

  // Back with a handler, the shape is at rest, not stuck pressed.
  await rerender(
    <IconButton icon="camera" testID="icon-button" onPress={() => {}} />
  );
  expect(screen.getByTestId('icon-button')).toHaveStyle({
    borderRadius: getDimensions({ theme }).restingRadius,
  });
});

it('is a plain view, not a disabled button, without touch handlers', async () => {
  await render(<IconButton icon="camera" testID="icon-button" />);

  expect(screen.getByTestId('icon-button')).not.toBeDisabled();
  expect(screen.queryByRole('button')).not.toBeOnTheScreen();
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
        theme,
        customIconColor: 'purple',
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return disabled icon color', () => {
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

  it.each(['filled', 'tonal'] as const)(
    'should let the disabled container outrank an explicit container color in %s mode',
    (mode) => {
      expect(
        getIconButtonColor({
          theme: LightTheme,
          mode,
          disabled: true,
          customContainerColor: 'purple',
        })
      ).toMatchObject({
        backgroundColor: LightTheme.colors.onSurface,
        backgroundOpacity: IconButtonTokens.disabled.containerOpacity,
      });
    }
  );

  it('should return filled default icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
      })
    ).toMatchObject({
      iconColor: theme.colors.onPrimary,
    });
  });

  it('should return filled selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.onPrimary,
    });
  });

  it('should return filled unselected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
        selected: false,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSurfaceVariant,
    });
  });

  it('should return tonal default icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
      })
    ).toMatchObject({
      iconColor: theme.colors.onSecondaryContainer,
    });
  });

  it('should return tonal selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSecondary,
    });
  });

  it('should return outlined selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.inverseOnSurface,
    });
  });

  it('should return standard selected icon color', () => {
    expect(
      getIconButtonColor({
        theme,
        selected: true,
      })
    ).toMatchObject({
      iconColor: theme.colors.primary,
    });
  });

  it('should return standard default icon color', () => {
    expect(
      getIconButtonColor({
        theme,
      })
    ).toMatchObject({
      iconColor: theme.colors.onSurfaceVariant,
    });
  });
});

describe('getIconButtonColor - background color', () => {
  it('should return custom background color', () => {
    expect(
      getIconButtonColor({
        theme,
        customContainerColor: 'purple',
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  (['filled', 'tonal'] as const).forEach((mode) =>
    it(`should use 0.10 container opacity when disabled in ${mode} mode`, () => {
      expect(
        getIconButtonColor({
          theme,
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: theme.colors.onSurface,
        backgroundOpacity: 0.1,
      });
    })
  );

  it('should return filled default container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
      })
    ).toMatchObject({
      backgroundColor: theme.colors.primary,
    });
  });

  it('should return filled unselected container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'filled',
        selected: false,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.surfaceContainer,
    });
  });

  it('should return tonal default container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
      })
    ).toMatchObject({
      backgroundColor: theme.colors.secondaryContainer,
    });
  });

  it('should return tonal selected container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'tonal',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.secondary,
    });
  });

  it('should return outlined selected container color', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: theme.colors.inverseSurface,
      borderWidth: 0,
    });
  });

  it('should return undefined container for standard mode', () => {
    expect(
      getIconButtonColor({
        theme,
      })
    ).toMatchObject({
      backgroundColor: undefined,
    });
  });
});

describe('getIconButtonColor - border color', () => {
  it('should return outline variant when disabled', () => {
    expect(
      getIconButtonColor({
        theme,
        disabled: true,
      })
    ).toMatchObject({
      borderColor: theme.colors.outlineVariant,
    });
  });

  it('should return outline variant for outlined mode', () => {
    expect(
      getIconButtonColor({
        theme,
        mode: 'outlined',
        outlineWidth: 1,
      })
    ).toMatchObject({
      borderColor: theme.colors.outlineVariant,
      borderWidth: 1,
    });
  });
});

describe('resolveShapeToken', () => {
  it('keeps a round button full until it is selected', () => {
    expect(resolveShapeToken({ shape: 'round' })).toBe('full');
    expect(resolveShapeToken({ shape: 'round', selected: false })).toBe('full');
    expect(resolveShapeToken({ shape: 'round', selected: true })).toBe(
      'medium'
    );
  });

  it('inverts a square button to full when selected', () => {
    expect(resolveShapeToken({ shape: 'square' })).toBe('medium');
    expect(resolveShapeToken({ shape: 'square', selected: true })).toBe('full');
  });

  it('uses the shared pressed shape for round and square', () => {
    expect(resolveShapeToken({ shape: 'round', pressed: true })).toBe('small');
    expect(resolveShapeToken({ shape: 'square', pressed: true })).toBe('small');
    expect(
      resolveShapeToken({ shape: 'round', selected: true, pressed: true })
    ).toBe('small');
  });
});

describe('getDimensions', () => {
  it('returns small default size', () => {
    expect(getDimensions({ theme })).toMatchObject({
      width: 40,
      height: 40,
      iconSize: 24,
      restingRadius: 20,
    });
  });

  it('returns the square resting radius when a round button is selected', () => {
    expect(getDimensions({ theme, selected: true })).toMatchObject({
      restingRadius: theme.shapes.corner.medium,
    });
  });

  it('returns extra-small narrow size', () => {
    expect(
      getDimensions({ theme, size: 'extra-small', width: 'narrow' })
    ).toMatchObject({
      width: 28,
      height: 32,
      iconSize: 20,
    });
  });

  it('keeps a default width square when `iconSize` changes the glyph', () => {
    expect(getDimensions({ theme, iconSize: 32 })).toMatchObject({
      width: 40,
      height: 40,
      iconSize: 32,
    });
  });

  it('returns extra-large wide size', () => {
    expect(
      getDimensions({ theme, size: 'extra-large', width: 'wide' })
    ).toMatchObject({
      width: 184,
      height: 136,
      iconSize: 40,
    });
  });
});

describe('toggle state on web', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('is announced with aria-pressed, which fits a button', async () => {
    await render(
      <IconButton
        icon="heart"
        aria-label="Favorite"
        selected
        onPress={() => {}}
      />
    );

    const button = screen.getByRole('button', { name: 'Favorite' });
    expect(button).toHaveProp('aria-pressed', true);
    expect(button).not.toHaveProp('aria-selected');
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

describe('state layer', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('follows the icon color, not the surface color', async () => {
    const spy = jest.spyOn(rippleUtils, 'getTouchableRippleColors');

    await render(
      <IconButton
        icon="camera"
        mode="filled"
        testID="icon-button"
        onPress={() => {}}
      />
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        rippleColor: color(String(theme.colors.onPrimary))
          .alpha(stateOpacity.pressed)
          .rgb()
          .string(),
      })
    );
  });

  it('follows a custom icon color', async () => {
    const spy = jest.spyOn(rippleUtils, 'getTouchableRippleColors');

    await render(
      <IconButton
        icon="camera"
        iconColor="#123456"
        testID="icon-button"
        onPress={() => {}}
      />
    );

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        rippleColor: color('#123456')
          .alpha(stateOpacity.pressed)
          .rgb()
          .string(),
      })
    );
  });
});

describe('shape morph', () => {
  const springDuration = toSpringCurve(
    theme.motion.spring.fast.spatial
  ).duration;

  // The touchable sits in the clip, which carries the radius transition.
  const transitionDuration = () => {
    const clip = screen.getByTestId('icon-button').parent;

    if (!clip) {
      throw new Error('Expected the touchable to be wrapped in the clip view.');
    }

    // Reanimated's Jest setup keeps CSS transitions out of `style`.
    // eslint-disable-next-line no-restricted-syntax
    return StyleSheet.flatten(clip.props.jestInlineStyle).transitionDuration;
  };

  it('runs on the fast spatial spring', async () => {
    await render(
      <IconButton icon="camera" testID="icon-button" onPress={() => {}} />
    );

    expect(transitionDuration()).toBe(springDuration);
  });

  it('snaps under reduce motion', async () => {
    await render(
      <PaperProvider reduceMotion="on">
        <IconButton icon="camera" testID="icon-button" onPress={() => {}} />
      </PaperProvider>
    );

    expect(transitionDuration()).toBe(0);
  });

  // Reanimated's Jest setup keeps CSS transitions out of `style`.
  const transitionOf = (element: ReturnType<typeof screen.getByTestId>) => {
    const { transitionDuration, transitionTimingFunction } = StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- see the comment above.
      element.props.jestInlineStyle
    );
    return { transitionDuration, transitionTimingFunction };
  };

  it('morphs the touchable inside the outline in step with the outline', async () => {
    const { pressedRadius, outlineWidth } = getDimensions({
      theme,
      size: 'extra-large',
    });

    await render(
      <IconButton
        icon="camera"
        mode="outlined"
        size="extra-large"
        testID="icon-button"
        onPress={() => {}}
      />
    );
    const touchable = screen.getByTestId('icon-button');
    const clip = touchable.parent;

    if (!clip) {
      throw new Error('Expected the touchable to be wrapped in the clip view.');
    }

    expect(transitionOf(touchable)).toEqual(transitionOf(clip));

    await fireEvent(touchable, 'pressIn');

    expect(transitionOf(touchable)).toEqual(transitionOf(clip));
    expect(clip).toHaveStyle({ borderRadius: pressedRadius });
    expect(touchable).toHaveStyle({
      borderRadius: pressedRadius - outlineWidth,
    });
  });

  it('snaps the touchable corner too under reduce motion', async () => {
    await render(
      <PaperProvider reduceMotion="on">
        <IconButton
          icon="camera"
          mode="outlined"
          testID="icon-button"
          onPress={() => {}}
        />
      </PaperProvider>
    );

    expect(
      transitionOf(screen.getByTestId('icon-button')).transitionDuration
    ).toBe(0);
  });
});

describe('inner corner', () => {
  it('is the container corner less the outline on the touchable', async () => {
    const { restingRadius, outlineWidth } = getDimensions({
      theme,
      size: 'extra-large',
    });

    await render(
      <IconButton
        icon="camera"
        mode="outlined"
        size="extra-large"
        testID="icon-button"
        onPress={() => {}}
      />
    );

    expect(outlineWidth).toBeGreaterThan(0);
    expect(screen.getByTestId('icon-button')).toHaveStyle({
      borderRadius: restingRadius - outlineWidth,
    });
  });

  it('is the container corner without an outline', async () => {
    const { restingRadius } = getDimensions({ theme, size: 'extra-large' });

    await render(
      <IconButton
        icon="camera"
        mode="filled"
        size="extra-large"
        testID="icon-button"
        onPress={() => {}}
      />
    );

    expect(screen.getByTestId('icon-button')).toHaveStyle({
      borderRadius: restingRadius,
    });
  });
});

describe('loading', () => {
  it('marks the button busy and hides the indicator', async () => {
    await render(
      <IconButton
        icon="camera"
        aria-label="Upload"
        loading
        onPress={() => {}}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Upload', busy: true })
    ).toBeOnTheScreen();
    // Not even a hidden element: one would still be a keyboard stop on Android.
    expect(
      screen.queryByRole('progressbar', { includeHiddenElements: true })
    ).not.toBeOnTheScreen();
  });

  it('does not disable the button', async () => {
    const onPress = jest.fn<() => void>();

    await render(
      <IconButton icon="camera" aria-label="Upload" loading onPress={onPress} />
    );
    await userEvent.press(screen.getByRole('button', { name: 'Upload' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('passes busy as false, not undefined, once loading ends', async () => {
      const { rerender } = await render(
        <IconButton
          icon="camera"
          aria-label="Upload"
          testID="icon-button"
          loading
          onPress={() => {}}
        />
      );

      expect(screen.getByTestId('icon-button')).toHaveProp(
        'accessibilityState',
        expect.objectContaining({ busy: true })
      );

      await rerender(
        <IconButton
          icon="camera"
          aria-label="Upload"
          testID="icon-button"
          onPress={() => {}}
        />
      );

      expect(screen.getByTestId('icon-button')).toHaveProp(
        'accessibilityState',
        expect.objectContaining({ busy: false })
      );
    });
  });

  it('lets a given aria-busy mark a button that is not loading', async () => {
    await render(
      <IconButton
        icon="camera"
        aria-label="Upload"
        aria-busy
        onPress={() => {}}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Upload', busy: true })
    ).toBeOnTheScreen();
  });
});
