import { Platform } from 'react-native';

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

import PaperProvider from '../../core/PaperProvider';
import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import {
  androidElevationLevels,
  shadow,
} from '../../theme/tokens/sys/elevation';
import FAB from '../FAB';
import Shell from '../FAB/Shell';
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

it.each(['icon', 'extended'] as const)(
  'applies web hover elevation to the %s FAB and restores it after press and exit',
  async (type) => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onPress = jest.fn();
    await render(
      type === 'icon' ? (
        <FAB icon="plus" onPress={onPress} />
      ) : (
        <FAB.Extended
          expanded
          icon="plus"
          label="Create"
          onPress={onPress}
          testID="floating-action-button"
        />
      )
    );
    const fab = screen.getByTestId('floating-action-button');
    const container = screen.getByTestId('floating-action-button-container');
    const theme = getTheme();
    const [restingShadow] = shadow(3, theme.colors.shadow);
    const [hoverShadow] = shadow(4, theme.colors.shadow);

    expect(container).toHaveStyle(restingShadow);
    await fireEvent(fab, 'hoverIn');
    expect(container).toHaveStyle(hoverShadow);
    await fireEvent(fab, 'pressIn');
    expect(container).toHaveStyle(restingShadow);
    await fireEvent(fab, 'pressOut');
    expect(container).toHaveStyle(hoverShadow);
    await fireEvent(fab, 'hoverOut');
    expect(container).toHaveStyle(restingShadow);
  }
);

it('keeps an explicit shell elevation of zero on hover', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(<Shell icon="plus" onPress={() => {}} elevation={0} />);
  await fireEvent(screen.getByTestId('fab-shell'), 'hoverIn');
  const [flatShadow] = shadow(0, getTheme().colors.shadow);
  expect(screen.getByTestId('fab-shell-container')).toHaveStyle(flatShadow);
});

it('does not enable a FAB without an action when adding interaction handlers', async () => {
  await render(<FAB icon="plus" aria-label="Create" />);
  expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled();
});

it('hides an invisible FAB from accessibility and disables its action', async () => {
  const onPress = jest.fn();
  await render(
    <FAB icon="plus" aria-label="Create" onPress={onPress} visible={false} />
  );
  expect(screen.queryByRole('button', { name: 'Create' })).toBeNull();
  const fab = screen.getByTestId('floating-action-button', {
    includeHiddenElements: true,
  });
  expect(fab).toBeDisabled();
  await userEvent.press(fab);
  expect(onPress).not.toHaveBeenCalled();
});

it('clears interaction elevation when a FAB is hidden and shown again', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const onPress = jest.fn();
  const { rerender } = await render(<FAB icon="plus" onPress={onPress} />);
  await fireEvent(screen.getByTestId('floating-action-button'), 'hoverIn');
  await rerender(<FAB icon="plus" onPress={onPress} visible={false} />);
  await rerender(<FAB icon="plus" onPress={onPress} />);
  const [restingShadow] = shadow(3, getTheme().colors.shadow);
  expect(screen.getByTestId('floating-action-button-container')).toHaveStyle(
    restingShadow
  );
});

it('keeps the menu trigger at its existing elevation on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  await render(
    <FAB.Menu
      expanded={false}
      onDismiss={() => {}}
      trigger={{ icon: 'plus', testID: 'menu-trigger', onPress: () => {} }}
      items={[
        { label: 'First', onPress: () => {} },
        { label: 'Second', onPress: () => {} },
      ]}
    />
  );
  await fireEvent(screen.getByTestId('fab-shell'), 'hoverIn');
  const [restingShadow] = shadow(3, getTheme().colors.shadow);
  expect(screen.getByTestId('fab-shell-container')).toHaveStyle(restingShadow);
});

it.each(['ios', 'android'] as const)(
  'keeps native elevation unchanged on hover on %s',
  async (platform) => {
    jest.replaceProperty(Platform, 'OS', platform);
    await render(<FAB icon="plus" onPress={() => {}} />);
    await fireEvent(screen.getByTestId('floating-action-button'), 'hoverIn');
    const [restingShadow] = shadow(3, getTheme().colors.shadow);
    expect(screen.getByTestId('floating-action-button-container')).toHaveStyle(
      platform === 'android'
        ? { elevation: androidElevationLevels[3] }
        : restingShadow
    );
  }
);

it('restores the resting elevation when a hovered FAB is hidden or its action is removed', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const onPress = jest.fn();
  const { rerender } = await render(<FAB icon="plus" onPress={onPress} />);
  await fireEvent(screen.getByTestId('floating-action-button'), 'hoverIn');
  await rerender(<FAB icon="plus" onPress={onPress} visible={false} />);
  const [restingShadow] = shadow(3, getTheme().colors.shadow);
  expect(
    screen.getByTestId('floating-action-button-container', {
      includeHiddenElements: true,
    })
  ).toHaveStyle(restingShadow);
  await rerender(<FAB icon="plus" />);
  expect(screen.getByTestId('floating-action-button-container')).toHaveStyle(
    restingShadow
  );
});
