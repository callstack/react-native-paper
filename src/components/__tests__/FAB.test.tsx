import * as React from 'react';
import { Platform, View } from 'react-native';

import { afterEach, expect, it, jest } from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';

import { getAnimatedStyle } from 'react-native-reanimated';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import {
  androidElevationLevels,
  shadow,
} from '../../theme/tokens/sys/elevation';
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

it('does not enable a FAB without an action when adding interaction handlers', async () => {
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
