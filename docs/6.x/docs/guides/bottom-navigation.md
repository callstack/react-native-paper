---
title: Using BottomNavigation with React Navigation
---

Build a Material Design bottom tab bar by combining two pieces:

- `@react-navigation/bottom-tabs` handles routing, state, and screen options.
- `NavigationBar` renders the Material 3 tab bar (ripple, badges, and stacked or horizontal item layouts).

:::info
Install [`@react-navigation/native`](https://reactnavigation.org/docs/getting-started) and [`@react-navigation/bottom-tabs`](https://reactnavigation.org/docs/bottom-tab-navigator) first.
:::

## Quick example

Pass a `NavigationBar` to the navigator's `tabBar` prop. The bar reads navigation state and dispatches `tabPress` events back:

```jsx
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { NavigationBar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function MyTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      tabBar={({ navigation, state, descriptors }) => (
        <NavigationBar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) =>
            descriptors[route.key].options.tabBarIcon?.({
              focused,
              color,
              size: 24,
            }) ?? null
          }
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            return typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```
