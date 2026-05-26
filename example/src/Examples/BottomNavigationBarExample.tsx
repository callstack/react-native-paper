import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import Icon from '@react-native-vector-icons/material-design-icons';
import {
  createBottomTabNavigator,
  createBottomTabScreen,
} from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  SFSymbol,
  MaterialSymbol,
} from '@react-navigation/native';
import { Text, BottomNavigation } from 'react-native-paper';

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

const BottomNavigationBarExample = createBottomTabNavigator({
  screenOptions: {
    headerShown: false,
  },
  tabBar: ({ navigation, state, descriptors }) => (
    <BottomNavigation.Bar
      navigationState={state}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
        } else {
          // Custom tab bars must target the tab navigator state.
          navigation.dispatch({
            ...CommonActions.navigate(route.name, route.params),
            target: state.key,
          });
        }
      }}
      renderIcon={({ route, focused, color }) => {
        const tabBarIcon = descriptors[route.key].options.tabBarIcon;

        const size = 24;
        const icon =
          typeof tabBarIcon === 'function'
            ? tabBarIcon({ focused, color, size })
            : tabBarIcon;

        if (icon == null) {
          return null;
        }

        if (React.isValidElement(icon)) {
          return icon;
        }

        if (typeof icon === 'object' && icon !== null && 'type' in icon) {
          switch (icon.type) {
            case 'sfSymbol':
              return <SFSymbol name={icon.name} size={size} color={color} />;
            case 'materialSymbol':
              return (
                <MaterialSymbol name={icon.name} size={size} color={color} />
              );
            case 'image':
              return (
                <Image
                  accessibilityIgnoresInvertColors
                  source={icon.source}
                  resizeMode="contain"
                  fadeDuration={0}
                  style={{ width: size, height: size, tintColor: color }}
                />
              );
          }
        }

        throw new Error(
          'Tab bar icon is not a valid React element, SFSymbol, MaterialSymbol, or Image.'
        );
      }}
      getLabelText={({ route }) => descriptors[route.key].route.name}
    />
  ),
  screens: {
    Home: createBottomTabScreen({
      screen: HomeScreen,
      options: {
        tabBarIcon: ({ color, size }) => {
          return <Icon name="home" size={size} color={color} />;
        },
      },
    }),
    Settings: createBottomTabScreen({
      screen: SettingsScreen,
      options: {
        tabBarIcon: ({ color, size }) => {
          return <Icon name="cog" size={size} color={color} />;
        },
      },
    }),
  },
});

export default Object.assign(BottomNavigationBarExample, {
  title: 'Bottom Navigation Bar',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
