import ReactNative from 'react-native';
import {
  AccessibilityInfo,
  BackHandler as RNBackHandler,
  Platform,
} from 'react-native';
import type { BackHandlerStatic as RNBackHandlerStatic } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import FAB from '../FAB';
import type { MenuItemProps } from '../FAB/Menu';

interface BackHandlerStatic extends RNBackHandlerStatic {
  mockPressBack(): void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

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
      trigger={{ icon: 'plus', onPress: onTriggerPress, testID: 'fab-shell' }}
      items={makeItems()}
    />
  );
  await userEvent.press(screen.getByTestId('fab-shell'));
  expect(onTriggerPress).toHaveBeenCalledTimes(1);
});

it('calls onDismiss when trigger is pressed while menu is open', async () => {
  const onDismiss = jest.fn();
  await render(
    <FAB.Menu
      expanded
      onDismiss={onDismiss}
      trigger={{ icon: 'plus', testID: 'fab-shell' }}
      items={makeItems()}
    />
  );
  await userEvent.press(screen.getByTestId('fab-shell'));
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

it('exposes the expanded state on the trigger', async () => {
  const { rerender } = await render(
    <FAB.Menu
      expanded={false}
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus', testID: 'fab-shell' }}
      items={makeItems()}
    />
  );
  expect(screen.getByTestId('fab-shell')).toBeCollapsed();

  await rerender(
    <FAB.Menu
      expanded
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus', testID: 'fab-shell' }}
      items={makeItems()}
    />
  );
  expect(screen.getByTestId('fab-shell')).toBeExpanded();
});

it('renders item labels with the title medium typescale', async () => {
  await render(
    <FAB.Menu
      expanded
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus' }}
      items={makeItems()}
    />
  );
  expect(screen.getByText('Send email')).toHaveStyle({ fontSize: 16 });
});

it('hides collapsed items from assistive technology and exposes expanded ones', async () => {
  const { rerender } = await render(
    <FAB.Menu
      expanded={false}
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus' }}
      items={makeItems()}
    />
  );
  expect(screen.queryByRole('button', { name: 'Send email' })).toBeNull();

  await rerender(
    <FAB.Menu
      expanded
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus' }}
      items={makeItems()}
    />
  );
  expect(screen.getByRole('button', { name: 'Send email' })).toBeOnTheScreen();
});

describe('screen reader focus', () => {
  const renderMenu = (expanded: boolean, onItemPress = jest.fn()) => (
    <FAB.Menu
      expanded={expanded}
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus' }}
      items={makeItems(onItemPress)}
    />
  );

  beforeEach(() => {
    // The test renderer has no native views to resolve a handle for.
    jest.spyOn(ReactNative, 'findNodeHandle').mockReturnValue(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('moves to the first item when the menu opens and back to the trigger when it closes', async () => {
    const setFocus = jest.spyOn(AccessibilityInfo, 'setAccessibilityFocus');
    const { rerender } = await render(renderMenu(false));
    expect(setFocus).not.toHaveBeenCalled();

    await rerender(renderMenu(true));
    expect(setFocus).toHaveBeenCalledTimes(1);

    await rerender(renderMenu(false));
    expect(setFocus).toHaveBeenCalledTimes(2);
  });

  it('stays where the action put it when an item closes the menu', async () => {
    const setFocus = jest.spyOn(AccessibilityInfo, 'setAccessibilityFocus');
    const { rerender } = await render(renderMenu(true));
    setFocus.mockClear();

    await userEvent.press(screen.getByTestId('item-0'));
    await rerender(renderMenu(false));

    expect(setFocus).not.toHaveBeenCalled();
  });
});

describe('dismissal', () => {
  it('dismisses when the hardware back button is pressed', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    );

    await act(() => BackHandler.mockPressBack());

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('ignores the hardware back button when collapsed', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded={false}
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    );

    await act(() => BackHandler.mockPressBack());

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('dismisses when pressing outside the menu', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
        overlayTestID="overlay"
      />
    );

    await userEvent.press(
      screen.getByTestId('overlay', { includeHiddenElements: true })
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('has no outside press target when collapsed', async () => {
    await render(
      <FAB.Menu
        expanded={false}
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
        overlayTestID="overlay"
      />
    );

    expect(
      screen.queryByTestId('overlay', { includeHiddenElements: true })
    ).toBeNull();
  });

  it('dismisses on the screen reader escape gesture', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
        testID="menu"
      />
    );

    await fireEvent(screen.getByTestId('menu'), 'accessibilityEscape');

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  describe('on web', () => {
    type KeyHandler = (event: {
      key: string;
      defaultPrevented?: boolean;
    }) => void;

    const handlers = new Set<KeyHandler>();

    // The test environment has no DOM, so provide just enough of `document`
    // to capture the key listener.
    const mockDocument = () => {
      jest.replaceProperty(Platform, 'OS', 'web');
      Object.assign(globalThis, {
        document: {
          activeElement: null,
          body: {},
          addEventListener: (_type: string, handler: KeyHandler) =>
            handlers.add(handler),
          removeEventListener: (_type: string, handler: KeyHandler) =>
            handlers.delete(handler),
        },
      });
    };

    const pressKey = (key: string, defaultPrevented = false) =>
      act(() => {
        handlers.forEach((handler) => handler({ key, defaultPrevented }));
      });

    afterEach(async () => {
      // Unmount while `document` still exists so effects can clean up.
      await screen.unmount();
      jest.restoreAllMocks();
      handlers.clear();
      Reflect.deleteProperty(globalThis, 'document');
    });

    it('dismisses when Escape is pressed', async () => {
      mockDocument();
      const onDismiss = jest.fn();
      await render(
        <FAB.Menu
          expanded
          onDismiss={onDismiss}
          trigger={{ icon: 'plus' }}
          items={makeItems()}
        />
      );

      await pressKey('Escape');

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('ignores Escape that was already handled', async () => {
      mockDocument();
      const onDismiss = jest.fn();
      await render(
        <FAB.Menu
          expanded
          onDismiss={onDismiss}
          trigger={{ icon: 'plus' }}
          items={makeItems()}
        />
      );

      await pressKey('Escape', true);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('ignores Escape when collapsed', async () => {
      mockDocument();
      const onDismiss = jest.fn();
      await render(
        <FAB.Menu
          expanded={false}
          onDismiss={onDismiss}
          trigger={{ icon: 'plus' }}
          items={makeItems()}
        />
      );

      await pressKey('Escape');

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});
