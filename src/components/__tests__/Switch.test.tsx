import type * as React from 'react';

import { describe, expect, it, jest } from '@jest/globals';
import * as Reanimated from 'react-native-reanimated';

import { defaultThemes } from '../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import Switch from '../Switch/Switch';

describe('Switch render', () => {
  it('renders on', async () => {
    expect((await render(<Switch value />)).toJSON()).toMatchSnapshot();
  });

  it('renders off', async () => {
    expect((await render(<Switch value={false} />)).toJSON()).toMatchSnapshot();
  });

  it('renders disabled on', async () => {
    expect(
      (await render(<Switch disabled value />)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders disabled off', async () => {
    expect(
      (await render(<Switch disabled value={false} />)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders with checked icon', async () => {
    expect(
      (await render(<Switch value checkedIcon="check" />)).toJSON()
    ).toMatchSnapshot();
  });

  it('renders with per-state icons', async () => {
    expect(
      (
        await render(<Switch value checkedIcon="check" uncheckedIcon="close" />)
      ).toJSON()
    ).toMatchSnapshot();
  });
});

describe('Switch accessibility', () => {
  it('has switch role', async () => {
    await render(<Switch value={false} />);

    expect(screen.getByRole('switch')).toBeOnTheScreen();
  });

  it('exposes a touch target meeting the 48dp minimum', async () => {
    await render(<Switch value={false} onValueChange={jest.fn()} />);

    expect(screen.getByRole('switch')).toHaveStyle({ width: 52, height: 48 });
  });
});

describe('Switch focus state', () => {
  const renderAndFocus = async (element: React.ReactElement) => {
    await render(element);

    await fireEvent(screen.getByTestId('switch'), 'focus');
    await jest.runAllTimersAsync();
  };

  const animatedStyle = (testID: string) =>
    Reanimated.getAnimatedStyle(screen.getByTestId(testID));

  it('shows the focus indicator on keyboard focus', async () => {
    await renderAndFocus(
      <Switch value={false} onValueChange={jest.fn()} testID="switch" />
    );

    expect(animatedStyle('switch-focus-ring')).toMatchObject({ opacity: 1 });
  });

  it('hides the focus indicator again on blur', async () => {
    await renderAndFocus(
      <Switch value={false} onValueChange={jest.fn()} testID="switch" />
    );

    await fireEvent(screen.getByTestId('switch'), 'blur');
    await jest.runAllTimersAsync();

    expect(animatedStyle('switch-focus-ring')).toMatchObject({ opacity: 0 });
  });

  it('raises the state layer to the focused opacity', async () => {
    await renderAndFocus(
      <Switch value={false} onValueChange={jest.fn()} testID="switch" />
    );

    expect(animatedStyle('switch-state-layer')).toMatchObject({
      opacity: tokens.md.sys.state.opacity.focused,
    });
  });

  it('paints the focus handle color when selected and focused', async () => {
    await renderAndFocus(
      <Switch value onValueChange={jest.fn()} testID="switch" />
    );

    expect(animatedStyle('switch-handle')).toMatchObject({
      backgroundColor: defaultThemes.light.colors.primaryContainer,
    });
  });
});

describe('Switch interaction', () => {
  it('toggles to true when off and pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(<Switch value={false} onValueChange={onValueChange} />);
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('toggles to false when on and pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(<Switch value onValueChange={onValueChange} />);
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('does not fire onValueChange when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(
      <Switch value={false} disabled onValueChange={onValueChange} />
    );
    await user.press(screen.getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
