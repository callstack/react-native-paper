import { Pressable, Text } from 'react-native';
import type { ViewStyle } from 'react-native';

import { expect, it, jest } from '@jest/globals';
import { fireEvent, userEvent } from '@testing-library/react-native';
import {
  getAnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import * as Avatar from '../Avatar/Avatar';
import Searchbar from '../Searchbar';
import { SearchbarTokens } from '../Searchbar/tokens';

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

it('uses the trailing color for the clear icon independently of the search icon', async () => {
  await render(
    <Searchbar testID="search-bar" value="value" iconColor="purple" />
  );

  expect(
    screen.getByText('close', { includeHiddenElements: true })
  ).toHaveStyle({ color: LightTheme.colors.onSurfaceVariant });
  expect(
    screen.getByText('magnify', { includeHiddenElements: true })
  ).toHaveStyle({ color: 'purple' });
});

it('uses the MD3 color roles for the input and its placeholder', async () => {
  const tree = (
    await render(<Searchbar value="query" placeholder="Search" />)
  ).toJSON();

  // `placeholderTextColor` is an attribute, not styling: the snapshot locks it.
  expect(screen.getByRole('searchbox')).toHaveStyle({
    color: LightTheme.colors.onSurface,
  });
  expect(tree).toMatchSnapshot();
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

it('renders trailing icon when mode is set to "contained"', async () => {
  await render(
    <Searchbar
      testID="search-bar"
      value={''}
      trailingIcon={'microphone'}
      trailingIconAccessibilityLabel="microphone"
      mode="contained"
    />
  );

  expect(screen.getByLabelText('microphone')).toBeOnTheScreen();
});

it('renders trailing icon with press functionality', async () => {
  const onTrailingIconPressMock = jest.fn();

  await render(
    <Searchbar
      testID="search-bar"
      value={''}
      trailingIcon={'microphone'}
      trailingIconAccessibilityLabel="microphone"
      onTrailingIconPress={onTrailingIconPressMock}
      mode="contained"
    />
  );

  await userEvent.press(screen.getByLabelText('microphone'));
  expect(onTrailingIconPressMock).toHaveBeenCalledTimes(1);
});

it('renders clear icon instead of trailing icon', async () => {
  const { rerender } = await render(
    <Searchbar
      testID="search-bar"
      value={''}
      trailingIcon={'microphone'}
      trailingIconAccessibilityLabel="microphone"
      mode="contained"
    />
  );

  expect(screen.getByLabelText('microphone')).toBeOnTheScreen();

  await rerender(
    <Searchbar
      testID="search-bar"
      value={'test'}
      trailingIcon={'microphone'}
      trailingIconAccessibilityLabel="microphone"
      mode="contained"
    />
  );

  expect(screen.queryByLabelText('microphone')).not.toBeOnTheScreen();
  expect(screen.getByLabelText('clear')).toBeOnTheScreen();
});

it('renders searchbar in "divided" mode', async () => {
  const tree = (await render(<Searchbar value={''} mode="divided" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('forwards explicit test IDs to the input and each icon button', async () => {
  const { rerender } = await render(
    <Searchbar
      value=""
      testID="query"
      searchTestID="search-button"
      clearTestID="clear-button"
      trailingTestID="trailing-button"
      trailingIcon="microphone"
      onIconPress={jest.fn()}
    />
  );

  expect(screen.getByTestId('query')).toBe(screen.getByRole('searchbox'));
  expect(screen.getByTestId('search-button')).toBe(
    screen.getByRole('button', { name: 'search' })
  );
  expect(screen.getByTestId('trailing-button')).toBeOnTheScreen();
  expect(screen.queryAllByTestId(/^query-/)).toHaveLength(0);

  await rerender(<Searchbar value="query" clearTestID="clear-button" />);
  expect(screen.getByTestId('clear-button')).toBe(
    screen.getByRole('button', { name: 'clear' })
  );
});

it('does not assign default test IDs', async () => {
  await render(<Searchbar value="" trailingIcon="microphone" />);
  expect(screen.queryAllByTestId(/./)).toHaveLength(0);
});

it('uses the custom trailing icon color', async () => {
  await render(
    <Searchbar value="" trailingIcon="microphone" trailingIconColor="purple" />
  );
  expect(
    screen.getByText('microphone', { includeHiddenElements: true })
  ).toHaveStyle({ color: 'purple' });
});

it('applies layout styles to the outermost element', async () => {
  await render(
    <Searchbar
      value=""
      style={{
        flex: 1,
        position: 'absolute',
        top: 0,
        transform: [{ scale: 1.5 }],
      }}
    />
  );
  expect(screen.root).toHaveStyle({
    flex: 1,
    position: 'absolute',
    top: 0,
    transform: [{ scale: 1.5 }],
  });
});

it.each<ViewStyle>([{ marginHorizontal: 0 }, { marginInline: 0 }])(
  'respects custom horizontal margins %j',
  async (style) => {
    const tree = (await render(<Searchbar value="" style={style} />)).toJSON();
    expect(screen.root).toHaveStyle(style);
    expect(tree).toMatchSnapshot();
  }
);

it.each<ViewStyle>([{ height: 80 }, { flex: 1 }])(
  'fills a custom vertical layout %j',
  async (style) => {
    const tree = (await render(<Searchbar value="" style={style} />)).toJSON();
    expect(screen.root).toHaveStyle(style);
    expect(tree).toMatchSnapshot();
  }
);

it('applies Reanimated styles to the Searchbar', async () => {
  const AnimatedSearchbar = () => {
    const opacity = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
      <Searchbar
        value=""
        style={animatedStyle}
        right={() => (
          <Pressable
            accessibilityLabel="Animate Searchbar"
            onPress={() => {
              opacity.value = 1;
            }}
          >
            <Text>Animate</Text>
          </Pressable>
        )}
      />
    );
  };

  await render(<AnimatedSearchbar />);
  const root = screen.root;
  if (!root) {
    throw new Error('Searchbar did not render');
  }
  expect(getAnimatedStyle(root)).toMatchObject({ opacity: 0 });

  await userEvent.press(screen.getByLabelText('Animate Searchbar'));
  await jest.runAllTimersAsync();

  expect(getAnimatedStyle(root)).toMatchObject({ opacity: 1 });
});

it('forwards onFocus and onBlur to the input', async () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  await render(<Searchbar value="" onFocus={onFocus} onBlur={onBlur} />);

  await fireEvent(screen.getByRole('searchbox'), 'focus');
  await fireEvent(screen.getByRole('searchbox'), 'blur');

  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(onBlur).toHaveBeenCalledTimes(1);
});

it('renders results below the Searchbar', async () => {
  await render(
    <Searchbar.Results testID="results">
      <Text>Result</Text>
    </Searchbar.Results>
  );

  expect(screen.getByText('Result')).toBeOnTheScreen();
  expect(screen.getByTestId('results')).toHaveStyle({
    borderRadius: LightTheme.shapes.corner.medium,
    marginHorizontal: SearchbarTokens.marginFocused,
  });
});

it('shrinks its horizontal margin while the input is focused', async () => {
  await render(<Searchbar value="" />);

  expect(screen.root).toHaveStyle({
    marginHorizontal: SearchbarTokens.marginUnfocused,
  });

  await fireEvent(screen.getByRole('searchbox'), 'focus');

  expect(screen.root).toHaveStyle({
    marginHorizontal: SearchbarTokens.marginFocused,
  });
});

it('keeps a custom horizontal margin instead of animating it', async () => {
  await render(<Searchbar value="" style={{ marginHorizontal: 40 }} />);

  await fireEvent(screen.getByRole('searchbox'), 'focus');

  expect(screen.root).toHaveStyle({
    marginHorizontal: 40,
  });
});
