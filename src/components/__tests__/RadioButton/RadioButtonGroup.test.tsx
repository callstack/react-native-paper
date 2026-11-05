import { describe, expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';

describe('RadioButtonGroup', () => {
  it('renders properly', async () => {
    const tree = (
      await render(
        <RadioButton.Group value="first" onValueChange={() => {}}>
          <RadioButton value="first" />
        </RadioButton.Group>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('calls the latest onValueChange after the parent re-renders', async () => {
    const first = jest.fn();
    const second = jest.fn();

    const { rerender } = await render(
      <RadioButton.Group value="first" onValueChange={first}>
        <RadioButton.Item label="Second" value="second" />
      </RadioButton.Group>
    );

    await rerender(
      <RadioButton.Group value="first" onValueChange={second}>
        <RadioButton.Item label="Second" value="second" />
      </RadioButton.Group>
    );

    await userEvent.press(screen.getByRole('radio', { name: 'Second' }));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('second');
  });
});
