import { describe, expect, it, jest } from '@jest/globals';

import { render, screen, userEvent } from '../../test-utils';
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

  it('expands hitSlop up to the 48dp minimum when enabled', async () => {
    await render(<Switch testID="switch" value />);

    // (48 - 40) / 2 top/bottom, none horizontally: the track is already wider
    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('switch').props.hitSlop).toEqual({
      top: 4,
      bottom: 4,
      left: 0,
      right: 0,
    });
  });

  it('gives a disabled switch no hitSlop of its own', async () => {
    await render(<Switch testID="switch" disabled value />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('switch').props.hitSlop).toBeUndefined();
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
