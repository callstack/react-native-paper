import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

import Icon from '@react-native-vector-icons/material-design-icons';
import {
  createBottomTabNavigator,
  type BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native-paper';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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

const HomeTab = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: 'transparent' }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: Platform.select<BottomTabNavigationOptions['tabBarIcon']>(
            {
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
            }
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: Platform.select<BottomTabNavigationOptions['tabBarIcon']>(
            {
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
            }
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function ThemingWithReactNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="React Navigation" component={HomeTab} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ThemingWithReactNavigation.title = 'Theming With React Navigation';

export default ThemingWithReactNavigation;
