---
title: Using BottomNavigation with React Navigation
---

For Material Design bottom tabs in React Navigation, render [`BottomNavigation.Bar`](https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/BottomNavigationBar) as the `tabBar` of [`@react-navigation/bottom-tabs`](https://reactnavigation.org/docs/bottom-tab-navigator). See the [integration example](https://callstack.github.io/react-native-paper/docs/components/BottomNavigation/BottomNavigationBar#with-react-navigation).

<img src="/react-native-paper/screenshots/material-bottom-tabs.gif" style={{ width: '420px', maxWidth: '100%', margin: '16px 0' }} />

:::danger Removed in v6
`createMaterialBottomTabNavigator` has been removed from React Native Paper as of v6. Use `@react-navigation/bottom-tabs` together with `BottomNavigation.Bar` to achieve the same look.
:::
