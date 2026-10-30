import type { GestureResponderEvent } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { render, screen, userEvent } from '../../../test-utils';
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
    { 'aria-hidden': true },
    { importantForAccessibility: 'no' },
    { importantForAccessibility: 'no-hide-descendants' },
  ] as const)(
    'does not warn for a checkbox hidden from assistive tech with %o',
    async (hidden) => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});

      await render(
        <Checkbox status="checked" onPress={() => {}} {...hidden} />
      );

      expect(console.warn).not.toHaveBeenCalled();
    }
  );
});
