import { type GestureResponderEvent, Platform } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen, userEvent } from '../../../test-utils';
import Checkbox from '../../Checkbox';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders checked Checkbox with onPress', async () => {
  const tree = (
    await render(
      <Checkbox status="checked" onPress={() => {}} aria-label="Notify me" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with onPress', async () => {
  const tree = (
    await render(
      <Checkbox status="unchecked" onPress={() => {}} aria-label="Notify me" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox', async () => {
  const tree = (
    await render(
      <Checkbox
        status="indeterminate"
        onPress={() => {}}
        aria-label="Notify me"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked Checkbox with color', async () => {
  const tree = (
    await render(
      <Checkbox status="checked" color="red" aria-label="Notify me" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with color', async () => {
  const tree = (
    await render(
      <Checkbox status="checked" color="red" aria-label="Notify me" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox with color', async () => {
  const tree = (
    await render(
      <Checkbox status="indeterminate" color="red" aria-label="Notify me" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders Checkbox with custom testID', async () => {
  const tree = (
    await render(
      <Checkbox
        status="checked"
        testID={'custom:testID'}
        aria-label="Notify me"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('Checkbox state', () => {
  it.each([
    { status: 'checked', checked: true },
    { status: 'unchecked', checked: false },
    { status: 'indeterminate', checked: 'mixed' },
  ] as const)(
    'reports $status as checked: $checked',
    async ({ status, checked }) => {
      await render(
        <Checkbox status={status} onPress={() => {}} aria-label="Notify me" />
      );

      expect(
        screen.getByRole('checkbox', { name: 'Notify me', checked })
      ).toBeOnTheScreen();
    }
  );
});

describe('Checkbox press', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await render(
      <Checkbox status="unchecked" onPress={onPress} aria-label="Notify me" />
    );

    await userEvent.press(screen.getByRole('checkbox'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled and ignores presses when disabled', async () => {
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await render(
      <Checkbox
        status="unchecked"
        onPress={onPress}
        disabled
        aria-label="Notify me"
      />
    );

    await userEvent.press(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('is reported as disabled rather than an enabled no-op without a press handler', async () => {
    await render(<Checkbox status="checked" aria-label="Notify me" />);

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});

describe('Checkbox Space key', () => {
  const key = (name: string, repeat = false) => ({
    nativeEvent: { key: name, repeat },
    preventDefault: jest.fn(),
  });

  const renderCheckbox = (onPress: (e: GestureResponderEvent) => void) =>
    render(
      <Checkbox status="unchecked" onPress={onPress} aria-label="Notify me" />
    );

  it('toggles once on release on web, without scrolling the page', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await renderCheckbox(onPress);
    const down = key(' ');
    const held = key(' ', true);

    await fireEvent(screen.getByRole('checkbox'), 'keyDown', down);
    await fireEvent(screen.getByRole('checkbox'), 'keyDown', held);

    expect(down.preventDefault).toHaveBeenCalled();
    expect(held.preventDefault).toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();

    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));
    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('presses in on key down and presses out before toggling, like Enter', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const calls: string[] = [];
    await render(
      <Checkbox
        status="unchecked"
        onPressIn={() => {
          calls.push('pressIn');
        }}
        onPressOut={() => {
          calls.push('pressOut');
        }}
        onPress={() => {
          calls.push('press');
        }}
        aria-label="Notify me"
      />
    );

    await fireEvent(screen.getByRole('checkbox'), 'keyDown', key(' '));

    expect(calls).toEqual(['pressIn']);

    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));

    expect(calls).toEqual(['pressIn', 'pressOut', 'press']);
  });

  it('leaves Enter to React Native Web on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await renderCheckbox(onPress);
    const enter = key('Enter');

    await fireEvent(screen.getByRole('checkbox'), 'keyDown', enter);
    await fireEvent(screen.getByRole('checkbox'), 'keyUp', enter);

    expect(enter.preventDefault).not.toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it('presses out without toggling when focus leaves before the release', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    const onPressOut = jest.fn<(e: GestureResponderEvent) => void>();
    await render(
      <Checkbox
        status="unchecked"
        onPress={onPress}
        onPressOut={onPressOut}
        aria-label="Notify me"
      />
    );

    await fireEvent(screen.getByRole('checkbox'), 'keyDown', key(' '));
    await fireEvent(screen.getByRole('checkbox'), 'blur');

    expect(onPressOut).toHaveBeenCalledTimes(1);

    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));

    expect(onPressOut).toHaveBeenCalledTimes(1);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not toggle once the checkbox becomes disabled', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onPress = jest.fn<(e: GestureResponderEvent) => void>();
    await renderCheckbox(onPress);

    await fireEvent(screen.getByRole('checkbox'), 'keyDown', key(' '));
    await screen.rerender(
      <Checkbox
        status="unchecked"
        onPress={onPress}
        disabled
        aria-label="Notify me"
      />
    );
    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));
    await fireEvent(screen.getByRole('checkbox'), 'keyDown', key(' '));
    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));

    expect(onPress).not.toHaveBeenCalled();

    // The press started before it was disabled must not survive it either.
    await screen.rerender(
      <Checkbox status="unchecked" onPress={onPress} aria-label="Notify me" />
    );
    await fireEvent(screen.getByRole('checkbox'), 'keyUp', key(' '));

    expect(onPress).not.toHaveBeenCalled();
  });

  it.each(['ios', 'android'] as const)(
    'leaves the key alone on %s',
    async (os) => {
      jest.replaceProperty(Platform, 'OS', os);
      const onPress = jest.fn<(e: GestureResponderEvent) => void>();
      await renderCheckbox(onPress);
      const space = key(' ');

      await fireEvent(screen.getByRole('checkbox'), 'keyDown', space);
      await fireEvent(screen.getByRole('checkbox'), 'keyUp', space);

      expect(space.preventDefault).not.toHaveBeenCalled();
      expect(onPress).not.toHaveBeenCalled();
    }
  );
});

describe('Checkbox touch target', () => {
  it('meets the 48dp minimum', async () => {
    await render(
      <Checkbox status="unchecked" onPress={() => {}} aria-label="Notify me" />
    );

    expect(screen.getByRole('checkbox')).toHaveStyle({
      width: 48,
      height: 48,
    });
  });

  it('takes the custom style on the outer container, not the pressable', async () => {
    await render(
      <Checkbox
        status="unchecked"
        onPress={() => {}}
        aria-label="Notify me"
        style={{ marginTop: 12 }}
      />
    );

    // On the pressable the style would miss the focus ring beside it, and
    // could shrink the touch target back below 48dp.
    expect(screen.root).toHaveStyle({ marginTop: 12 });
    expect(screen.getByRole('checkbox')).not.toHaveStyle({ marginTop: 12 });
  });

  it('sizes its outer container to the touch target', async () => {
    await render(
      <Checkbox status="unchecked" onPress={() => {}} aria-label="Notify me" />
    );

    // Without a definite size, a column's default `alignItems: 'stretch'`
    // widens the container and centers the checkbox in the column.
    expect(screen.root).toHaveStyle({ width: 48, height: 48 });
  });

  it('keeps the 48dp touch target under a negative margin', async () => {
    await render(
      <Checkbox
        status="unchecked"
        onPress={() => {}}
        aria-label="Notify me"
        style={{ margin: -4 }}
      />
    );

    expect(screen.root).toHaveStyle({ margin: -4 });
    expect(screen.getByRole('checkbox')).toHaveStyle({
      width: 48,
      height: 48,
    });
  });
});

describe('Checkbox accessible name', () => {
  it('warns when a standalone checkbox has no accessible name', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(<Checkbox status="checked" onPress={() => {}} />);

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('aria-label')
    );
  });

  it('is named by aria-label', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(
      <Checkbox status="checked" onPress={() => {}} aria-label="Notify me" />
    );

    expect(screen.getByLabelText('Notify me')).toBeOnTheScreen();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('does not warn for the checkbox inside a labelled Checkbox.Item', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    await render(<Checkbox.Item label="Notify me" status="checked" />);

    expect(console.warn).not.toHaveBeenCalled();
  });

  it.each([
    { os: 'ios', hidden: { 'aria-hidden': true } },
    { os: 'android', hidden: { 'aria-hidden': true } },
    { os: 'web', hidden: { 'aria-hidden': true } },
    { os: 'ios', hidden: { accessibilityElementsHidden: true } },
    { os: 'android', hidden: { importantForAccessibility: 'no' } },
    {
      os: 'android',
      hidden: { importantForAccessibility: 'no-hide-descendants' },
    },
  ] as const)(
    'does not warn on $os for a checkbox hidden with $hidden',
    async ({ os, hidden }) => {
      jest.replaceProperty(Platform, 'OS', os);
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      await render(
        <Checkbox status="checked" onPress={() => {}} {...hidden} />
      );

      expect(console.warn).not.toHaveBeenCalled();
    }
  );

  it('still warns on iOS when only importantForAccessibility hides it', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    // iOS ignores `importantForAccessibility`, so the checkbox stays exposed.
    await render(
      <Checkbox
        status="checked"
        onPress={() => {}}
        importantForAccessibility="no-hide-descendants"
      />
    );

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('aria-label')
    );
  });

  it('warns on iOS when only aria-labelledby names it', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    // iOS does not name an element after the one it is labelled by.
    await render(
      <Checkbox status="checked" onPress={() => {}} aria-labelledby="label" />
    );

    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('aria-label')
    );
  });

  it.each(['android', 'web'] as const)(
    'is named by aria-labelledby on %s',
    async (os) => {
      jest.replaceProperty(Platform, 'OS', os);
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      await render(
        <Checkbox status="checked" onPress={() => {}} aria-labelledby="label" />
      );

      expect(console.warn).not.toHaveBeenCalled();
    }
  );
});
