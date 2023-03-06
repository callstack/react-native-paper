import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createMaterialBottomTabNavigator } from '../../../src/react-navigation';

const Tab = createMaterialBottomTabNavigator();

export default function MaterialBottomTabNavigatorExample() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      activeColor="#e91e63"
      style={styles.tabs}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Updates',
          tabBarIcon: ({ color }) => (
            <Icon name="bell" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

MaterialBottomTabNavigatorExample.title = 'Material Bottom Tab Navigator';

function Feed() {
  return (
    <View style={styles.screen}>
      <Text>Feed!</Text>
    </View>
  );
}

function Profile() {
  return (
    <View style={styles.screen}>
      <Text>Profile!</Text>
    </View>
  );
}

function Notifications() {
  return (
    <View style={styles.screen}>
      <Text>Notifications!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  tabs: {
    backgroundColor: 'tomato',
  },
});
