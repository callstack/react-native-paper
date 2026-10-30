import * as React from 'react';
import { Platform, View } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import { render, screen } from '../../test-utils';
import FAB from '../FAB';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders FAB with default props', async () => {
  const tree = (await render(<FAB icon="plus" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with primary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="primary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with secondary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="secondary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tertiary variant', async () => {
  const tree = (await render(<FAB icon="plus" variant="tertiary" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with secondaryContainer variant', async () => {
  const tree = (
    await render(<FAB icon="plus" variant="secondaryContainer" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with tertiaryContainer variant', async () => {
  const tree = (
    await render(<FAB icon="plus" variant="tertiaryContainer" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with aria-label', async () => {
  const tree = (
    await render(<FAB icon="plus" aria-label="Add item" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB medium size', async () => {
  const tree = (await render(<FAB icon="plus" size="medium" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB large size', async () => {
  const tree = (await render(<FAB icon="plus" size="large" />)).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor override', async () => {
  const tree = (
    await render(<FAB icon="plus" containerColor="#ff5722" />)
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB with containerColor and contentColor overrides', async () => {
  const tree = (
    await render(
      <FAB icon="plus" containerColor="#ff5722" contentColor="#ffffff" />
    )
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders FAB transitioning to not visible', async () => {
  const { rerender, toJSON } = await render(<FAB icon="plus" />);
  await rerender(<FAB icon="plus" visible={false} />);
  expect(toJSON()).toMatchSnapshot();
});

it('renders FAB transitioning to visible', async () => {
  const { rerender, toJSON } = await render(
    <FAB icon="plus" visible={false} />
  );
  await rerender(<FAB icon="plus" visible />);
  expect(toJSON()).toMatchSnapshot();
});

it('calls onPress when FAB is pressed', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  await render(<FAB icon="plus" aria-label="Add item" onPress={onPress} />);
  await user.press(screen.getByRole('button', { name: 'Add item' }));
  expect(onPress).toHaveBeenCalledTimes(1);
});

it('forwards event object to onPress', async () => {
  const onPress = jest.fn();
  await render(<FAB icon="plus" aria-label="Add item" onPress={onPress} />);
  await fireEvent(screen.getByRole('button', { name: 'Add item' }), 'onPress', {
    key: 'value',
  });
  expect(onPress).toHaveBeenCalledWith({ key: 'value' });
});

const getStyle = (ref: React.RefObject<View | null>) => {
  if (!ref.current) throw new Error('Expected FAB ref to be attached');
  return getAnimatedStyle(ref.current);
};

it('renders a FAB without onPress as a disabled button', async () => {
  await render(<FAB icon="plus" aria-label="Create" />);
  expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
});

it('hides an invisible FAB from accessibility and keyboard navigation without marking it disabled', async () => {
  const onPress = jest.fn();
  await render(
    <FAB
      icon="plus"
      testID="create"
      aria-label="Create"
      onPress={onPress}
      visible={false}
    />
  );
  expect(screen.queryByRole('button', { name: 'Create' })).toBeNull();
  const fab = screen.getByTestId('create', { includeHiddenElements: true });
  expect(fab).not.toBeDisabled();
  expect(fab).toHaveProp('accessible', false);
  expect(fab).toHaveProp('focusable', false);
  expect(fab).toHaveProp('tabIndex', -1);
  await userEvent.press(fab);
  await fireEvent(fab, 'click', { nativeEvent: {} });
  expect(onPress).not.toHaveBeenCalled();
});

it('clears interaction elevation when a FAB is hidden and shown again', async () => {
  const ref = React.createRef<View>();
  const onPress = jest.fn();
  const { rerender } = await render(
    <FAB
      ref={ref}
      style={{}}
      icon="plus"
      aria-label="Create"
      onPress={onPress}
    />
  );
  const resting = getStyle(ref);
  await fireEvent(screen.getByRole('button', { name: 'Create' }), 'hoverIn');
  expect(getStyle(ref)).not.toEqual(resting);
  await rerender(
    <FAB ref={ref} style={{}} icon="plus" onPress={onPress} visible={false} />
  );
  await rerender(<FAB ref={ref} style={{}} icon="plus" onPress={onPress} />);
  expect(getStyle(ref)).toEqual(resting);
});

it('uses the shared FAB hover elevation for the menu trigger', async () => {
  const { toJSON } = await render(
    <FAB.Menu
      expanded={false}
      onDismiss={() => {}}
      trigger={{ icon: 'plus', 'aria-label': 'Create', onPress: () => {} }}
      items={[
        { label: 'First', onPress: () => {} },
        { label: 'Second', onPress: () => {} },
      ]}
    />
  );
  const before = JSON.stringify(toJSON());
  await fireEvent(screen.getByRole('button', { name: 'Create' }), 'hoverIn');
  const hovered = JSON.stringify(toJSON());
  expect(hovered).not.toBe(before);
  await fireEvent(screen.getByRole('button', { name: 'Create' }), 'hoverOut');
  expect(JSON.stringify(toJSON())).toBe(before);
});

// React Native 0.85 sends no hover events on iOS or Android by default. These
// only check that the elevation logic itself has no platform check.
it.each(['ios', 'android'] as const)(
  'follows hover events and keeps the hover elevation on focus when Platform.OS is %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    const ref = React.createRef<View>();
    await render(
      <FAB
        ref={ref}
        style={{}}
        icon="plus"
        aria-label="Create"
        onPress={() => {}}
      />
    );
    const fab = screen.getByRole('button', { name: 'Create' });
    const resting = getStyle(ref);

    await fireEvent(fab, 'hoverIn');
    const hovered = getStyle(ref);
    expect(hovered).not.toEqual(resting);
    await fireEvent(fab, 'focus', { nativeEvent: {} });
    expect(getStyle(ref)).toEqual(hovered);
    await fireEvent(fab, 'pressIn');
    expect(getStyle(ref)).toEqual(resting);
    await fireEvent(fab, 'pressOut');
    expect(getStyle(ref)).toEqual(hovered);
    await fireEvent(fab, 'hoverOut');
    expect(getStyle(ref)).toEqual(resting);
  }
);

it('restores the resting elevation when a hovered FAB loses its action', async () => {
  const ref = React.createRef<View>();
  const { rerender } = await render(
    <FAB
      ref={ref}
      style={{}}
      icon="plus"
      aria-label="Create"
      onPress={() => {}}
    />
  );
  const resting = getStyle(ref);
  await fireEvent(screen.getByRole('button', { name: 'Create' }), 'hoverIn');
  expect(getStyle(ref)).not.toEqual(resting);
  await rerender(<FAB ref={ref} style={{}} icon="plus" aria-label="Create" />);
  expect(getStyle(ref)).toEqual(resting);
  expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
  await rerender(<FAB ref={ref} style={{}} icon="plus" onPress={() => {}} />);
  expect(getStyle(ref)).toEqual(resting);
});

describe('on web', () => {
  const originalHTMLElement = Object.getOwnPropertyDescriptor(
    globalThis,
    'HTMLElement'
  );
  const originalDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    'document'
  );
  const originalMatches = Object.getOwnPropertyDescriptor(
    View.prototype,
    'matches'
  );
  const originalComponentDidMount = Object.getOwnPropertyDescriptor(
    View.prototype,
    'componentDidMount'
  );
  let activeElement: unknown;
  let focusVisible: boolean;
  let fabElement: View | undefined;

  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web');
    activeElement = null;
    focusVisible = true;
    fabElement = undefined;
    // Native View refs stand in for DOM elements in the native test renderer.
    Object.defineProperty(globalThis, 'HTMLElement', {
      configurable: true,
      value: View,
    });
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: {
        get activeElement() {
          return activeElement;
        },
      },
    });
    Object.defineProperty(View.prototype, 'matches', {
      configurable: true,
      value: (selectors: string) =>
        selectors === ':focus-visible' && focusVisible,
    });
    // The pressable view with the FAB's testID is the element that takes focus.
    Object.defineProperty(View.prototype, 'componentDidMount', {
      configurable: true,
      value(this: View) {
        if (this.props.testID === 'create') {
          fabElement = this;
        }
      },
    });
  });

  afterEach(() => {
    for (const [target, key, descriptor] of [
      [globalThis, 'HTMLElement', originalHTMLElement],
      [globalThis, 'document', originalDocument],
      [View.prototype, 'matches', originalMatches],
      [View.prototype, 'componentDidMount', originalComponentDidMount],
    ] as const) {
      if (descriptor) {
        Object.defineProperty(target, key, descriptor);
      } else {
        Reflect.deleteProperty(target, key);
      }
    }
  });

  const createElement = ({
    isConnected = true,
    hiddenBy,
  }: {
    isConnected?: boolean;
    hiddenBy?: string;
  } = {}) => {
    const element = new View({});
    return Object.assign(element, {
      isConnected,
      closest: (selectors: string) =>
        hiddenBy && selectors.includes(hiddenBy) ? {} : null,
      focus: jest.fn(() => {
        activeElement = element;
      }),
    });
  };

  const renderFocusedFAB = async (relatedTarget: unknown) => {
    const fab = (visible: boolean) => (
      <FAB
        icon="plus"
        testID="create"
        aria-label="Create"
        onPress={() => {}}
        visible={visible}
      />
    );
    const { rerender } = await render(fab(true));
    if (!fabElement) throw new Error('Expected the FAB to mount');
    activeElement = fabElement;
    // The View mock shares one `blur` mock across instances.
    const blur = jest.fn();
    fabElement.blur = blur;
    await fireEvent(screen.getByRole('button', { name: 'Create' }), 'focus', {
      nativeEvent: { relatedTarget },
    });
    return { blur, hide: () => rerender(fab(false)) };
  };

  it.each(['icon', 'extended'] as const)(
    'raises the %s FAB while hovered, keeps it raised on focus and lowers it while pressed',
    async (type) => {
      const ref = React.createRef<View>();
      await render(
        type === 'icon' ? (
          <FAB
            ref={ref}
            style={{}}
            icon="plus"
            aria-label="Create"
            onPress={() => {}}
          />
        ) : (
          <FAB.Extended
            ref={ref}
            style={{}}
            expanded
            icon="plus"
            label="Create"
            onPress={() => {}}
          />
        )
      );
      const fab = screen.getByRole('button', { name: 'Create' });
      const resting = getStyle(ref);

      await fireEvent(fab, 'hoverIn');
      const hovered = getStyle(ref);
      expect(hovered).not.toEqual(resting);
      await fireEvent(fab, 'focus', { nativeEvent: {} });
      expect(getStyle(ref)).toEqual(hovered);
      await fireEvent(fab, 'pressIn');
      expect(getStyle(ref)).toEqual(resting);
      await fireEvent(fab, 'pressOut');
      expect(getStyle(ref)).toEqual(hovered);
      await fireEvent(fab, 'hoverOut');
      expect(getStyle(ref)).toEqual(resting);
    }
  );

  it('moves focus back to the previous element when a keyboard-focused FAB hides', async () => {
    const previous = createElement();
    const { blur, hide } = await renderFocusedFAB(previous);

    await hide();

    expect(previous.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(blur).not.toHaveBeenCalled();
  });

  it.each([
    ['inside an aria-hidden subtree', { hiddenBy: '[aria-hidden="true"]' }],
    ['inside an inert subtree', { hiddenBy: '[inert]' }],
    ['disconnected', { isConnected: false }],
  ])(
    'blurs a keyboard-focused FAB that hides when the previous element is %s',
    async (_, options) => {
      const previous = createElement(options);
      const { blur, hide } = await renderFocusedFAB(previous);

      await hide();

      expect(previous.focus).not.toHaveBeenCalled();
      expect(blur).toHaveBeenCalledTimes(1);
    }
  );

  it('blurs a FAB focused by a mouse click instead of moving focus back', async () => {
    focusVisible = false;
    const previous = createElement();
    const { blur, hide } = await renderFocusedFAB(previous);

    await hide();

    expect(previous.focus).not.toHaveBeenCalled();
    expect(blur).toHaveBeenCalledTimes(1);
  });

  it('leaves focus alone when a FAB that lost focus hides', async () => {
    const previous = createElement();
    const { blur, hide } = await renderFocusedFAB(previous);
    activeElement = createElement();

    await hide();

    expect(previous.focus).not.toHaveBeenCalled();
    expect(blur).not.toHaveBeenCalled();
  });
});
