import { expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import RadioButton from '../../RadioButton';

it('renders unchecked', async () => {
  const tree = (
    await render(
      <RadioButton.Item
        status="unchecked"
        label="Unchecked Button"
        value="unchecked"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading radio button control', () => {
  const tree = render(
    <RadioButton.Item
      label="Default with leading control"
      status={'unchecked'}
      value="iOS"
      position="leading"
    />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should execute onLongPress', async () => {
  const onLongPress = jest.fn();

  await render(
    <RadioButton.Item
      label="Item"
      value="android"
      testID="radio-button-item"
      onLongPress={onLongPress}
    />
  );

  await userEvent.longPress(screen.getByTestId('radio-button-item'));

  expect(onLongPress).toHaveBeenCalledTimes(1);
});
