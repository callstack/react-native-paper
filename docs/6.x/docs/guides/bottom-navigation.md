---
title: Using BottomNavigation with React Navigation
---

Build a Material Design bottom tab bar by combining two pieces:

- `@react-navigation/bottom-tabs` handles routing, state, and screen options.
- `BottomNavigation.Bar` renders the Material 3 tab bar (ripple, badges, shifting/labeled modes).

<img src="/react-native-paper/screenshots/material-bottom-tabs.gif" style={{ width: '420px', maxWidth: '100%', margin: '16px 0' }} />

:::info
Install [`@react-navigation/native`](https://reactnavigation.org/docs/getting-started) and [`@react-navigation/bottom-tabs`](https://reactnavigation.org/docs/bottom-tab-navigator) first.
:::

## Quick example

Pass a `BottomNavigation.Bar` to the navigator's `tabBar` prop. The bar reads navigation state and dispatches `tabPress` events back:

```jsx
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { BottomNavigation } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

function MyTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{ animation: 'shift' }}
      tabBar={({ navigation, state, descriptors }) => (
        <BottomNavigation.Bar
          navigationState={state}
          safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (event.defaultPrevented) {
              preventDefault();
            } else {
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
