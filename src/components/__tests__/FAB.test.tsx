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
import * as Reanimated from 'react-native-reanimated';
import { getAnimatedStyle } from 'react-native-reanimated';

import PaperProvider from '../../core/PaperProvider';
import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import {
  androidElevationLevels,
  shadow,
} from '../../theme/tokens/sys/elevation';
import FAB from '../FAB';
import Tooltip from '../Tooltip/Tooltip';

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

it('keeps the visibility springs on with reduceMotion="off" whatever the device setting', async () => {
  const { rerender } = await render(
    <PaperProvider reduceMotion="off">
      <FAB icon="plus" />
    </PaperProvider>
  );
  jest.mocked(Reanimated.withSpring).mockClear();

  await rerender(
    <PaperProvider reduceMotion="off">
      <FAB icon="plus" visible={false} />
    </PaperProvider>
  );
  await rerender(
    <PaperProvider reduceMotion="off">
      <FAB icon="plus" visible />
    </PaperProvider>
  );

  expect(
    jest
      .mocked(Reanimated.withSpring)
      .mock.calls.map(([, config]) => config?.reduceMotion)
  ).toEqual([
    Reanimated.ReduceMotion.Never,
    Reanimated.ReduceMotion.Never,
    Reanimated.ReduceMotion.Never,
    Reanimated.ReduceMotion.Never,
  ]);
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

it('calls onLongPress and onPressOut when FAB is long pressed', async () => {
  const user = userEvent.setup();
  const onLongPress = jest.fn();
  const onPressOut = jest.fn();
  await render(
    <FAB
      icon="plus"
      aria-label="Add item"
      onLongPress={onLongPress}
      onPressOut={onPressOut}
      delayLongPress={300}
    />
  );
  await user.longPress(screen.getByRole('button', { name: 'Add item' }), {
    duration: 400,
  });
  expect(onLongPress).toHaveBeenCalledTimes(1);
  expect(onPressOut).toHaveBeenCalledTimes(1);
});

it('shows Tooltip when FAB is long pressed', async () => {
  const user = userEvent.setup();
  await render(
    <PaperProvider>
      <Tooltip title="Press Me">
        <FAB icon="plus" aria-label="Add item" onPress={() => {}} />
      </Tooltip>
    </PaperProvider>
  );
  await user.longPress(screen.getByRole('button', { name: 'Add item' }));
  expect(screen.getByText('Press Me')).toBeOnTheScreen();
});

describe('without a touch handler', () => {
  describe.each(['ios', 'android'] as const)('on %s', (os) => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', os);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('keeps its label but is no image', async () => {
      await render(<FAB icon="star" aria-label="Favorite" />);

      expect(screen.getByLabelText('Favorite')).toBeOnTheScreen();
      expect(screen.queryByRole('img')).not.toBeOnTheScreen();
    });
  });

  // On web the dropped role renders role="presentation", which can't carry a
  // name, so the label would sit on an element that may not be announced
  describe('on web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('is an image named by its label when it shows only an icon', async () => {
      await render(<FAB icon="star" aria-label="Favorite" />);

      expect(screen.getByRole('img', { name: 'Favorite' })).toBeOnTheScreen();
    });

    it('drops aria-selected from the image, which cannot carry it', async () => {
      await render(<FAB icon="star" aria-label="Favorite" aria-selected />);

      expect(screen.getByRole('img', { name: 'Favorite' })).not.toHaveProp(
        'aria-selected'
      );
    });

    it.each([
      ['with only onPress', { onPress: () => {} }],
      ['with only onLongPress', { onLongPress: () => {} }],
      ['while it reports a toggle state', { 'aria-checked': true }],
    ])('stays a button %s', async (_, props) => {
      await render(<FAB icon="star" aria-label="Favorite" {...props} />);

      expect(
        screen.getByRole('button', { name: 'Favorite' })
      ).toBeOnTheScreen();
    });

    it('is no image when it shows a label', async () => {
      await render(<FAB.Extended icon="plus" label="New message" expanded />);

      expect(
        screen.queryByRole('img', { name: 'New message' })
      ).not.toBeOnTheScreen();
    });

    it('keeps a closed FAB.Menu trigger without onPress a disabled button', async () => {
      await render(
        <FAB.Menu
          expanded={false}
          onDismiss={() => {}}
          trigger={{ icon: 'plus', 'aria-label': 'Open actions' }}
          items={[
            { label: 'Send email', onPress: () => {} },
            { label: 'Set reminder', onPress: () => {} },
          ]}
        />
      );

      expect(
        screen.getByRole('button', { name: 'Open actions' })
      ).toBeDisabled();
    });
  });
});

const getStyle = (ref: React.RefObject<View | null>) => {
  if (!ref.current) throw new Error('Expected FAB ref to be attached');
  return getAnimatedStyle(ref.current);
};

it.each(['icon', 'extended'] as const)(
  'applies web hover elevation to the %s FAB and restores it after press and exit',
  async (type) => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const ref = React.createRef<View>();
    const onPress = jest.fn();
    await render(
      type === 'icon' ? (
        <FAB
          ref={ref}
          style={{}}
          icon="plus"
          aria-label="Create"
          onPress={onPress}
        />
      ) : (
        <FAB.Extended
          ref={ref}
          style={{}}
          expanded
          icon="plus"
          label="Create"
          onPress={onPress}
        />
      )
    );
    const fab = screen.getByRole('button', { name: 'Create' });
    const [restingShadow] = shadow(3, LightTheme.colors.shadow);
    const [hoverShadow] = shadow(4, LightTheme.colors.shadow);

    expect(getStyle(ref)).toMatchObject(restingShadow);
    await fireEvent(fab, 'hoverIn');
    expect(getStyle(ref)).toMatchObject(hoverShadow);
    await fireEvent(fab, 'pressIn');
    expect(getStyle(ref)).toMatchObject(restingShadow);
    await fireEvent(fab, 'pressOut');
    expect(getStyle(ref)).toMatchObject(hoverShadow);
    await fireEvent(fab, 'hoverOut');
    expect(getStyle(ref)).toMatchObject(restingShadow);
  }
);

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
  await fireEvent(screen.getByRole('button', { name: 'Create' }), 'hoverIn');
  await rerender(
    <FAB ref={ref} style={{}} icon="plus" onPress={onPress} visible={false} />
  );
  await rerender(<FAB ref={ref} style={{}} icon="plus" onPress={onPress} />);
  const [restingShadow] = shadow(3, LightTheme.colors.shadow);
  expect(getStyle(ref)).toMatchObject(restingShadow);
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

it.each(['ios', 'android'] as const)(
  'applies hover elevation alongside focus and restores it after press on %s',
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
    const [restingShadow] = shadow(3, LightTheme.colors.shadow);
    const [hoverShadow] = shadow(4, LightTheme.colors.shadow);
    const restingStyle =
      platform === 'android'
        ? { elevation: androidElevationLevels[3] }
        : restingShadow;
    const hoverStyle =
      platform === 'android'
        ? { elevation: androidElevationLevels[4] }
        : hoverShadow;

    await fireEvent(fab, 'focus', { nativeEvent: {} });
    expect(getStyle(ref)).toMatchObject(restingStyle);
    await fireEvent(fab, 'hoverIn');
    expect(getStyle(ref)).toMatchObject(hoverStyle);
    await fireEvent(fab, 'focus', { nativeEvent: {} });
    expect(getStyle(ref)).toMatchObject(hoverStyle);
    await fireEvent(fab, 'pressIn');
    expect(getStyle(ref)).toMatchObject(restingStyle);
    await fireEvent(fab, 'pressOut');
    expect(getStyle(ref)).toMatchObject(hoverStyle);
    await fireEvent(fab, 'hoverOut');
    expect(getStyle(ref)).toMatchObject(restingStyle);
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
  await fireEvent(screen.getByRole('button', { name: 'Create' }), 'hoverIn');
  await rerender(<FAB ref={ref} style={{}} icon="plus" aria-label="Create" />);
  const [restingShadow] = shadow(3, LightTheme.colors.shadow);
  expect(getStyle(ref)).toMatchObject(restingShadow);
  expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
  await rerender(<FAB ref={ref} style={{}} icon="plus" onPress={() => {}} />);
  expect(getStyle(ref)).toMatchObject(restingShadow);
});
