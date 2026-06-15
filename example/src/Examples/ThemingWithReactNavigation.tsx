import { View, StyleSheet, Platform } from 'react-native';

import Icon from '@react-native-vector-icons/material-design-icons';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Settings!</Text>
    </View>
  );
}

const HomeTab = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
    tabBarButton: (props) => (
      <PlatformPressable {...props} android_ripple={{ color: 'transparent' }} />
    ),
  },
  screens: {
    ThemingHome: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        tabBarIcon: Platform.select<BottomTabNavigationOptions['tabBarIcon']>({
          android: {
            type: 'materialSymbol',
            name: 'home',
          },
          ios: {
            type: 'sfSymbol',
            name: 'house',
          },
          default: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }),
      },
    }),
    ThemingSettings: createBottomTabScreen({
      screen: SettingsScreen,
      options: {
        tabBarIcon: Platform.select<BottomTabNavigationOptions['tabBarIcon']>({
          android: {
            type: 'materialSymbol',
            name: 'settings',
          },
          ios: {
            type: 'sfSymbol',
            name: 'gear',
          },
          default: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },
        }),
      },
    }),
  },
});

const ThemingWithReactNavigation = Object.assign(
  createNativeStackNavigator({
    screens: {
      'React Navigation': HomeTab,
    },
  }),
  {
    title: 'Theming With React Navigation',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ThemingWithReactNavigation;
