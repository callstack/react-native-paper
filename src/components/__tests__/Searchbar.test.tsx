import { Animated } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { act, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import * as Avatar from '../Avatar/Avatar';
import Searchbar from '../Searchbar';

it('renders with placeholder', async () => {
  const tree = (
    await render(<Searchbar placeholder="Search" value="" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with text', async () => {
  const tree = (
    await render(<Searchbar placeholder="Search" value="query" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('activity indicator snapshot test', async () => {
  const tree = (await render(<Searchbar loading={true} value="" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders with ActivityIndicator', async () => {
  await render(<Searchbar loading={true} value="" />);

  expect(screen.getByTestId('activity-indicator')).toBeOnTheScreen();
});

it('renders without ActivityIndicator', async () => {
  await render(<Searchbar loading={false} value="" />);

  expect(screen.queryByTestId('activity-indicator')).not.toBeOnTheScreen();
});

it('renders clear icon with custom color', async () => {
  await render(
    <Searchbar testID="search-bar" value="value" iconColor="purple" />
  );

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  const iconComponent = screen.getByTestId('search-bar-icon-wrapper').props
    .children;

  // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
  expect(iconComponent.props.iconColor).toBe('purple');
});

it('renders clear icon wrapper, which can be the target of touch events, if search has value', async () => {
  await render(<Searchbar testID="search-bar" value="value" />);

  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('search-bar-icon-wrapper').props.pointerEvents
  ).toBe('auto');
});

it('renders clear icon wrapper, which is never target of touch events, if search has no value', async () => {
  await render(<Searchbar testID="search-bar" value="" />);

  expect(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('search-bar-icon-wrapper').props.pointerEvents
  ).toBe('none');
});

it('animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  await render(
    <Searchbar
      testID="search-bar"
      value=""
      style={[{ transform: [{ scale: value }] }]}
    />
  );
  expect(screen.getByTestId('search-bar-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(screen.getByTestId('search-bar-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

it('defines onClearIconPress action and checks if it is called when close button is pressed', async () => {
  const onClearIconPressMock = jest.fn();
  await render(
    <Searchbar
      testID="search-bar"
      value="value"
      onClearIconPress={onClearIconPressMock}
    />
  );
  await userEvent.press(screen.getByTestId('search-bar-clear-icon'));
  expect(onClearIconPressMock).toHaveBeenCalledTimes(1);
});

it('renders clear icon wrapper, with appropriate style for v3', async () => {
  const { rerender } = await render(<Searchbar testID="search-bar" value="" />);

  expect(screen.getByTestId('search-bar-icon-wrapper')).toHaveStyle({
    position: 'absolute',
    right: 0,
    marginLeft: 16,
  });

  await rerender(
    <Searchbar
      testID="search-bar"
      value=""
      right={() => <Avatar.Text label="AB" size={30} />}
    />
  );

  expect(
    screen.getByTestId('search-bar-icon-wrapper', {
      includeHiddenElements: true,
    })
  ).toHaveStyle({ display: 'none' });
});

it('renders trailering icon when mode is set to "bar"', async () => {
  await render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      mode="bar"
    />
  );

  expect(screen.getByTestId('search-bar-trailering-icon')).toBeOnTheScreen();
});

it('renders trailering icon with press functionality', async () => {
  const onTraileringIconPressMock = jest.fn();

  await render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      onTraileringIconPress={onTraileringIconPressMock}
      mode="bar"
    />
  );

  await userEvent.press(screen.getByTestId('search-bar-trailering-icon'));
  expect(onTraileringIconPressMock).toHaveBeenCalledTimes(1);
});

it('renders clear icon instead of trailering icon', async () => {
  const { rerender } = await render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      mode="bar"
    />
  );

  expect(screen.getByTestId('search-bar-trailering-icon')).toBeOnTheScreen();

  await rerender(
    <Searchbar
      testID="search-bar"
      value={'test'}
      traileringIcon={'microphone'}
      mode="bar"
    />
  );

  expect(
    screen.queryByTestId('search-bar-trailering-icon')
  ).not.toBeOnTheScreen();
  expect(screen.getByTestId('search-bar-icon-wrapper')).toBeOnTheScreen();
});

it('renders searchbar in "view" mode', async () => {
  await render(<Searchbar testID="search-bar" value={''} mode="view" />);

  expect(screen.getByTestId('search-bar-container')).toHaveStyle({
    borderRadius: 0,
  });
});
