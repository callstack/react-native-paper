import { describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render } from '../../test-utils';
import Switch from '../Switch/Switch';

describe('Switch render', () => {
  it('renders on', () => {
    expect(render(<Switch value />).toJSON()).toMatchSnapshot();
  });

  it('renders off', () => {
    expect(render(<Switch value={false} />).toJSON()).toMatchSnapshot();
  });

  it('renders disabled on', () => {
    expect(render(<Switch disabled value />).toJSON()).toMatchSnapshot();
  });

  it('renders disabled off', () => {
    expect(
      render(<Switch disabled value={false} />).toJSON()
    ).toMatchSnapshot();
  });

  it('renders with checked icon', () => {
    expect(
      render(<Switch value checkedIcon="check" />).toJSON()
    ).toMatchSnapshot();
  });

  it('renders with per-state icons', () => {
    expect(
      render(
        <Switch value checkedIcon="check" uncheckedIcon="close" />
      ).toJSON()
    ).toMatchSnapshot();
  });
});

describe('Switch interaction', () => {
  it('toggles to true when off and pressed', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Switch value={false} onValueChange={onValueChange} />
    );
    fireEvent.press(getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('toggles to false when on and pressed', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Switch value onValueChange={onValueChange} />
    );
    fireEvent.press(getByRole('switch'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('does not fire onValueChange when disabled', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <Switch value={false} disabled onValueChange={onValueChange} />
    );
    fireEvent.press(getByRole('switch'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
