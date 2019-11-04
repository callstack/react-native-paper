import * as React from 'react';
import renderer from 'react-test-renderer';
import { SafeAreaProvider } from 'react-native-safe-area-view';
import BottomNavigation from '../BottomNavigation.tsx';

jest.useFakeTimers();

jest.mock('Animated', () => {
  const ActualAnimated = jest.requireActual('Animated');

  return {
    ...ActualAnimated,
    timing: (value, config) => ({
      start: callback => {
        value.setValue(config.toValue);
        callback && callback({ finished: true });
      },
    }),
  };
});

const icons = ['magnify', 'camera', 'inbox', 'heart', 'shopping-music'];

const createState = (index, length) => ({
  index,
  routes: Array.from({ length }, (_, i) => ({
    key: `key-${i}`,
    icon: icons[i],
    title: `Route: ${i}`,
  })),
});

it('renders shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting
          navigationState={createState(0, 5)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting={false}
          navigationState={createState(0, 3)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label in shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting
          navigationState={createState(0, 5)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
          renderIcon={({ route, color }) => (
            <icon color={color}>{route.icon}</icon>
          )}
          renderLabel={({ route, color }) => (
            <text color={color}>{route.label}</text>
          )}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label in non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting={false}
          navigationState={createState(0, 3)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
          renderIcon={({ route, color }) => (
            <icon color={color}>{route.icon}</icon>
          )}
          renderLabel={({ route, color }) => (
            <text color={color}>{route.label}</text>
          )}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting
          navigationState={createState(0, 3)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
          activeColor="#FBF7DB"
          inactiveColor="#853D4B"
          barStyle={{ backgroundColor: '#E96A82' }}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom icon and label with custom colors in non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting={false}
          navigationState={createState(0, 3)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
          activeColor="#FBF7DB"
          inactiveColor="#853D4B"
          barStyle={{ backgroundColor: '#E96A82' }}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting
          labeled={false}
          navigationState={createState(0, 3)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('hides labels in non-shifting bottom navigation', () => {
  const tree = renderer
    .create(
      <SafeAreaProvider>
        <BottomNavigation
          shifting={false}
          labeled={false}
          navigationState={createState(0, 3)}
          onIndexChange={jest.fn()}
          renderScene={({ route }) => route.title}
        />
      </SafeAreaProvider>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
