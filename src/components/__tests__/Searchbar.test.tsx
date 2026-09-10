import { expect, it, jest } from '@jest/globals';
import { userEvent } from '@testing-library/react-native';

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

  expect(screen.getByRole('progressbar')).toBeOnTheScreen();
});

it('renders without ActivityIndicator', async () => {
  await render(<Searchbar loading={false} value="" />);

  expect(screen.queryByRole('progressbar')).not.toBeOnTheScreen();
});

it('renders clear icon with custom color', async () => {
  await render(
    <Searchbar testID="search-bar" value="value" iconColor="purple" />
  );

  expect(
    screen.getByText('close', { includeHiddenElements: true })
  ).toHaveStyle({ color: 'purple' });
});

it('does not respond to touch on the clear icon when search has no value', async () => {
  const onClearIconPressMock = jest.fn();
  await render(
    <Searchbar
      testID="search-bar"
      value=""
      onClearIconPress={onClearIconPressMock}
    />
  );

  await userEvent.press(
    screen.getByLabelText('clear', { includeHiddenElements: true })
  );
  expect(onClearIconPressMock).not.toHaveBeenCalled();
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
  await userEvent.press(screen.getByLabelText('clear'));
  expect(onClearIconPressMock).toHaveBeenCalledTimes(1);
});

it('hides the clear icon when a custom right element is rendered', async () => {
  await render(
    <Searchbar
      testID="search-bar"
      value=""
      right={() => <Avatar.Text label="AB" size={30} />}
    />
  );

  expect(screen.queryByLabelText('clear')).not.toBeOnTheScreen();
});

it('renders trailering icon when mode is set to "bar"', async () => {
  await render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      traileringIconAccessibilityLabel="microphone"
      mode="bar"
    />
  );

  expect(screen.getByLabelText('microphone')).toBeOnTheScreen();
});

it('renders trailering icon with press functionality', async () => {
  const onTraileringIconPressMock = jest.fn();

  await render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      traileringIconAccessibilityLabel="microphone"
      onTraileringIconPress={onTraileringIconPressMock}
      mode="bar"
    />
  );

  await userEvent.press(screen.getByLabelText('microphone'));
  expect(onTraileringIconPressMock).toHaveBeenCalledTimes(1);
});

it('renders clear icon instead of trailering icon', async () => {
  const { rerender } = await render(
    <Searchbar
      testID="search-bar"
      value={''}
      traileringIcon={'microphone'}
      traileringIconAccessibilityLabel="microphone"
      mode="bar"
    />
  );

  expect(screen.getByLabelText('microphone')).toBeOnTheScreen();

  await rerender(
    <Searchbar
      testID="search-bar"
      value={'test'}
      traileringIcon={'microphone'}
      traileringIconAccessibilityLabel="microphone"
      mode="bar"
    />
  );

  expect(screen.queryByLabelText('microphone')).not.toBeOnTheScreen();
  expect(screen.getByLabelText('clear')).toBeOnTheScreen();
});

it('renders searchbar in "view" mode', async () => {
  const tree = (await render(<Searchbar value={''} mode="view" />)).toJSON();

  expect(tree).toMatchSnapshot();
});
