/* @flow */

import * as React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DefaultTheme from '../../styles/DefaultTheme';
import BottomNavigation from '../BottomNavigation';

const createState = (index, length) => ({
  index,
  routes: Array.from({ length }, (_, i) => ({
    key: `key-${i}`,
    icon: `icon-${i}`,
    title: `Route: ${i}`,
  })),
});

it('renders shifting bottom navigation', () => {
  const wrapper = shallow(
    <BottomNavigation
      theme={DefaultTheme}
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  );

  expect(
    toJson(
      wrapper
        .dive()
        .dive()
        .dive()
        .dive()
    )
  ).toMatchSnapshot();
});

it('renders non-shifting bottom navigation', () => {
  const wrapper = shallow(
    <BottomNavigation
      theme={DefaultTheme}
      shifting={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
    />
  );

  expect(
    toJson(
      wrapper
        .dive()
        .dive()
        .dive()
        .dive()
    )
  ).toMatchSnapshot();
});

it('renders custom icon and label in shifting bottom navigation', () => {
  const wrapper = shallow(
    <BottomNavigation
      theme={DefaultTheme}
      shifting
      navigationState={createState(0, 5)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      renderIcon={({ route, focused }) => (
        <icon color={focused ? 'blue' : 'white'}>{route.icon}</icon>
      )}
      renderLabel={({ route, focused }) => (
        <text color={focused ? 'blue' : 'white'}>{route.label}</text>
      )}
    />
  );

  expect(
    toJson(
      wrapper
        .dive()
        .dive()
        .dive()
        .dive()
    )
  ).toMatchSnapshot();
});

it('renders custom icon and label in non-shifting bottom navigation', () => {
  const wrapper = shallow(
    <BottomNavigation
      theme={DefaultTheme}
      shifting={false}
      navigationState={createState(0, 3)}
      onIndexChange={jest.fn()}
      renderScene={({ route }) => route.title}
      renderIcon={({ route, focused }) => (
        <icon color={focused ? 'blue' : 'white'}>{route.icon}</icon>
      )}
      renderLabel={({ route, focused }) => (
        <text color={focused ? 'blue' : 'white'}>{route.label}</text>
      )}
    />
  );

  expect(
    toJson(
      wrapper
        .dive()
        .dive()
        .dive()
        .dive()
    )
  ).toMatchSnapshot();
});
