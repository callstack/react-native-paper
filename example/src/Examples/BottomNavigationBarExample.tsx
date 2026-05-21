import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

import Icon from '@react-native-vector-icons/material-design-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  CommonActions,
  SFSymbol,
  MaterialSymbol,
} from '@react-navigation/native';
import { Text, BottomNavigation } from 'react-native-paper';

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

export default function BottomNavigationBarExample() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors }) => (
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
                  return (
                    <SFSymbol name={icon.name} size={size} color={color} />
                  );
                case 'materialSymbol':
                  return (
                    <MaterialSymbol
                      name={icon.name}
                      size={size}
                      color={color}
                    />
                  );
                case 'image':
                  return (
                    <Image
                      accessibilityIgnoresInvertColors
                      source={icon.source}
                      resizeMode="contain"
                      tintColor={color}
                      fadeDuration={0}
                      style={{ width: size, height: size }}
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
      )}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => {
            return <Icon name="cog" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

BottomNavigationBarExample.title = 'Bottom Navigation Bar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
