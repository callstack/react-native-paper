import {
  AccessibilityInfo,
  BackHandler as RNBackHandler,
  Platform,
} from 'react-native';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import PaperProvider from '../../core/PaperProvider';
import { render, screen } from '../../test-utils';
import FAB from '../FAB';
import type { MenuItemProps } from '../FAB/Menu';

type BackHandlerStatic = typeof RNBackHandler & {
  mockPressBack(): void;
  exitApp: jest.Mock<() => void>;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as BackHandlerStatic;

jest.mock('react-native-reanimated', () => {
  const ReanimatedModule = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...ReanimatedModule,
    default: ReanimatedModule.default,
    withSpring: jest.fn(ReanimatedModule.withSpring),
  };
});

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

// A trigger without onPress has nothing to open the menu with, so it is off
// while closed. Turning it off instead of dropping its handler keeps the same
// element, so its icons aren't remounted on every open and close.
it('keeps the trigger mounted across opening and closing without trigger.onPress', async () => {
  const onDismiss = jest.fn();
  const trigger = { icon: 'plus', testID: 'trigger' };
  const { rerender } = await render(
    <FAB.Menu
      expanded={false}
      onDismiss={onDismiss}
      trigger={trigger}
      items={makeItems()}
    />
  );
  const closed = screen.getByTestId('trigger');

  expect(closed).toBeDisabled();

  await rerender(
    <FAB.Menu
      expanded
      onDismiss={onDismiss}
      trigger={trigger}
      items={makeItems()}
    />
  );

  expect(screen.getByTestId('trigger')).toBe(closed);
  expect(closed).not.toBeDisabled();
});

it('keeps the trigger morph spring on with reduceMotion="off" whatever the device setting', async () => {
  const { rerender } = await render(
    <PaperProvider reduceMotion="off">
      <FAB.Menu
        expanded={false}
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    </PaperProvider>
  );
  jest.mocked(Reanimated.withSpring).mockClear();

  await rerender(
    <PaperProvider reduceMotion="off">
      <FAB.Menu
        expanded
        onDismiss={jest.fn()}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    </PaperProvider>
  );

  // The items fade and scale with CSS transitions, so the trigger's morph is
  // the only spring left.
  expect(
    jest
      .mocked(Reanimated.withSpring)
      .mock.calls.map(([, config]) => config?.reduceMotion)
  ).toEqual([Reanimated.ReduceMotion.Never]);
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

describe('dismissing the menu', () => {
  beforeEach(() => {
    BackHandler.exitApp.mockClear();
  });

  it('calls onDismiss when the back button is pressed while open', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    );

    await act(() => {
      BackHandler.mockPressBack();
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(BackHandler.exitApp).not.toHaveBeenCalled();
  });

  it('leaves the back button to the screen while closed', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded={false}
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    );

    await act(() => {
      BackHandler.mockPressBack();
    });

    expect(onDismiss).not.toHaveBeenCalled();
    expect(BackHandler.exitApp).toHaveBeenCalledTimes(1);
  });

  it('stops taking the back button once it closes', async () => {
    const onDismiss = jest.fn();
    const { rerender } = await render(
      <FAB.Menu
        expanded
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    );

    await rerender(
      <FAB.Menu
        expanded={false}
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
      />
    );
    await act(() => {
      BackHandler.mockPressBack();
    });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('calls onDismiss on the screen reader escape gesture while open', async () => {
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

  it('ignores the screen reader escape gesture while closed', async () => {
    const onDismiss = jest.fn();
    await render(
      <FAB.Menu
        expanded={false}
        onDismiss={onDismiss}
        trigger={{ icon: 'plus' }}
        items={makeItems()}
        testID="menu"
      />
    );

    await fireEvent(screen.getByTestId('menu'), 'accessibilityEscape');

    expect(onDismiss).not.toHaveBeenCalled();
  });

  describe('on the web', () => {
    let platform: { restore(): void };
    let keyDownListeners = new Set<(event: unknown) => void>();

    beforeAll(() => {
      platform = jest.replaceProperty(Platform, 'OS', 'web');

      // There is no DOM under the React Native preset, so the test supplies
      // what the menu and its overlay handling touch.
      Object.defineProperty(global, 'HTMLElement', {
        configurable: true,
        value: class {},
      });
      Object.defineProperty(global, 'document', {
        configurable: true,
        value: {
          activeElement: null,
          addEventListener: (
            type: string,
            listener: (event: unknown) => void,
            capture?: boolean
          ) => {
            if (type === 'keydown' && capture === true) {
              keyDownListeners.add(listener);
            }
          },
          removeEventListener: (
            _type: string,
            listener: (event: unknown) => void
          ) => {
            keyDownListeners.delete(listener);
          },
        },
      });
    });

    afterAll(() => {
      platform.restore();
      delete (global as { document?: unknown }).document;
      delete (global as { HTMLElement?: unknown }).HTMLElement;
    });

    beforeEach(() => {
      keyDownListeners = new Set();
    });

    const pressEscape = async () => {
      const event = {
        key: 'Escape',
        isComposing: false,
        defaultPrevented: false,
      };

      await act(() => {
        keyDownListeners.forEach((listener) => listener(event));
        // The overlay waits until the key has been through the page.
        jest.advanceTimersByTime(1);
      });
    };

    it('calls onDismiss when Escape is pressed while open', async () => {
      const onDismiss = jest.fn();
      await render(
        <FAB.Menu
          expanded
          onDismiss={onDismiss}
          trigger={{ icon: 'plus' }}
          items={makeItems()}
        />
      );

      await pressEscape();

      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('ignores Escape while closed', async () => {
      const onDismiss = jest.fn();
      await render(
        <FAB.Menu
          expanded={false}
          onDismiss={onDismiss}
          trigger={{ icon: 'plus' }}
          items={makeItems()}
        />
      );

      await pressEscape();

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });
});

describe('moving focus', () => {
  const sendAccessibilityEvent = jest.mocked(
    AccessibilityInfo.sendAccessibilityEvent
  );

  const renderMenu = (expanded: boolean) => (
    <FAB.Menu
      expanded={expanded}
      onDismiss={jest.fn()}
      trigger={{ icon: 'plus', testID: 'trigger' }}
      items={makeItems()}
    />
  );

  // The screen reader is sent to an element, which the test can only tell
  // apart by the `testID` it was given.
  const focusedTestID = () => {
    const [target] = sendAccessibilityEvent.mock.calls[0] ?? [];

    return typeof target === 'object' && target !== null && 'props' in target
      ? // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unsafe-type-assertion
        (target.props as { testID?: string }).testID
      : undefined;
  };

  beforeEach(() => {
    sendAccessibilityEvent.mockClear();
  });

  it('moves the screen reader to the first item once the items have faded in', async () => {
    await render(renderMenu(true));

    // The items stagger in, and transparent views are not in the
    // accessibility tree.
    expect(sendAccessibilityEvent).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
    expect(sendAccessibilityEvent).toHaveBeenCalledWith(
      expect.anything(),
      'focus'
    );
    expect(focusedTestID()).toBe('item-0');
  });

  it('moves the screen reader into the menu each time it opens', async () => {
    const { rerender } = await render(renderMenu(false));

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(sendAccessibilityEvent).not.toHaveBeenCalled();

    await rerender(renderMenu(true));
    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
  });

  it('sends the screen reader back to the trigger when it closes', async () => {
    const { rerender } = await render(renderMenu(true));

    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    sendAccessibilityEvent.mockClear();

    await rerender(renderMenu(false));
    await act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(sendAccessibilityEvent).toHaveBeenCalledTimes(1);
    expect(sendAccessibilityEvent).toHaveBeenCalledWith(
      expect.anything(),
      'focus'
    );
    expect(focusedTestID()).toBe('trigger');
  });

  it('leaves the screen reader alone when it closes before it moved any in', async () => {
    const { rerender } = await render(renderMenu(true));

    await rerender(renderMenu(false));
    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(sendAccessibilityEvent).not.toHaveBeenCalled();
  });
});
