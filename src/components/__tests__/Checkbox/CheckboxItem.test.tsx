import { expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

import { render, screen } from '../../../test-utils';
import Checkbox from '../../Checkbox';

it('renders unchecked', async () => {
  const tree = (
    await render(<Checkbox.Item status="unchecked" label="Unchecked Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('can render leading checkbox control', async () => {
  const tree = (
    await render(
      <Checkbox.Item
        label="Default with leading control"
        status={'unchecked'}
        position="leading"
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('should have `accessibilityState={ checked: true }` when `status="checked"`', async () => {
  await render(<Checkbox.Item status="checked" label="Checked Button" />);

  expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(1);
});

it('should have `accessibilityState={ checked: false }` when `status="unchecked"', async () => {
  await render(<Checkbox.Item status="unchecked" label="Unchecked Button" />);

  expect(screen.getAllByRole('checkbox', { checked: false })).toHaveLength(1);
});

it('should have `accessibilityState={ checked: "mixed" }` when `status="indeterminate"`', async () => {
  await render(
    <Checkbox.Item status="indeterminate" label="Indeterminate Button" />
  );

  expect(screen.getAllByRole('checkbox', { checked: 'mixed' })).toHaveLength(1);
});

it('disables the row when the prop disabled is true', async () => {
  await render(
    <Checkbox.Item
      status="unchecked"
      label=""
      aria-label="some checkbox"
      disabled
    />
  );

  expect(screen.getByLabelText('some checkbox')).toBeDisabled();
});

it('should have maxFontSizeMultiplier set to 1.5 by default', async () => {
  await render(
    <Checkbox.Item label="" testID="checkbox-item" status="unchecked" />
  );
  const checkboxItemText = screen.getByTestId('checkbox-item-text', {
    includeHiddenElements: true,
  });
  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(checkboxItemText.props.maxFontSizeMultiplier).toBe(1.5);
});

it('should execute onLongPress', async () => {
  const onLongPress = jest.fn();

  await render(
    <Checkbox.Item
      label="Item"
      status="unchecked"
      testID="checkbox-item"
      onLongPress={onLongPress}
    />
  );

  await userEvent.longPress(screen.getByTestId('checkbox-item'));

  expect(onLongPress).toHaveBeenCalledTimes(1);
});
