import { expect, it, jest } from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import FAB from '../FAB';
import type { MenuItemProps } from '../FAB/Menu';

const makeItems = (
  onItemPress = jest.fn<(event?: unknown) => void>()
): [MenuItemProps, MenuItemProps] => [
  { label: 'Send email', onPress: onItemPress, testID: 'item-0' },
  { label: 'Set reminder', onPress: onItemPress, testID: 'item-1' },
];

it('renders FAB.Menu closed', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded={false}
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB.Menu open', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB.Menu with 6 items', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={[
          { label: 'Item 1', onPress: jest.fn(), testID: 'item-0' },
          { label: 'Item 2', onPress: jest.fn(), testID: 'item-1' },
          { label: 'Item 3', onPress: jest.fn(), testID: 'item-2' },
          { label: 'Item 4', onPress: jest.fn(), testID: 'item-3' },
          { label: 'Item 5', onPress: jest.fn(), testID: 'item-4' },
          { label: 'Item 6', onPress: jest.fn(), testID: 'item-5' },
        ]}
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB.Menu with start alignment', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        alignment="start"
        items={makeItems()}
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB.Menu with center alignment', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        alignment="center"
        items={makeItems()}
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB.Menu with items having icons', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={[
          { icon: 'email', label: 'Send email', onPress: jest.fn() },
          { icon: 'bell', label: 'Set reminder', onPress: jest.fn() },
        ]}
      />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB.Menu not expanded when trigger is not visible', async () => {
  const tree = (
    await render(
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus', visible: false }}
        items={makeItems()}
      />
    )
  ).toJSON();
  // effectiveExpanded = visible && expanded = false
  expect(tree).toMatchSnapshot();
});

it('calls item onPress when menu item is pressed', async () => {
  const onItemPress = jest.fn();
  await render(
    <FAB.Menu
      expanded
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus' }}
      items={makeItems(onItemPress)}
    />
  );
  await userEvent.press(screen.getByTestId('item-0'));
  expect(onItemPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to item onPress', async () => {
  const onItemPress = jest.fn();
  await render(
    <FAB.Menu
      expanded
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus' }}
      items={makeItems(onItemPress)}
    />
  );
  await fireEvent(screen.getByTestId('item-0'), 'onPress', { key: 'value' });
  expect(onItemPress).toHaveBeenCalledWith({ key: 'value' });
});

it('calls onDismiss when menu item is pressed', async () => {
  const onDismiss = jest.fn();
  await render(
    <FAB.Menu
      expanded
      onDismiss={onDismiss}
      trigger={{ icon: 'plus' }}
      items={makeItems()}
    />
  );
  await userEvent.press(screen.getByTestId('item-0'));
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

it('calls trigger onPress when menu is closed', async () => {
  const onTriggerPress = jest.fn();
  await render(
    <FAB.Menu
      expanded={false}
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus', onPress: onTriggerPress }}
      items={makeItems()}
    />
  );
  // Shell's TouchableRipple uses the default testID 'fab-shell'
  await userEvent.press(screen.getByTestId('fab-shell'));
  expect(onTriggerPress).toHaveBeenCalledTimes(1);
});

it('calls onDismiss when trigger is pressed while menu is open', async () => {
  const onDismiss = jest.fn();
  await render(
    <FAB.Menu
      expanded
      onDismiss={onDismiss}
      trigger={{ icon: 'plus' }}
      items={makeItems()}
    />
  );
  await userEvent.press(screen.getByTestId('fab-shell'));
  expect(onDismiss).toHaveBeenCalledTimes(1);
});
