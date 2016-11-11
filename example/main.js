/* @flow */

import Exponent from 'exponent';
import React, { Component } from 'react';
import {
  View,
  Text,
} from 'react-native';
import {
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { Colors, ThemeProvider, Drawer } from 'react-native-paper';
import { MaterialIcons as Icon } from '@exponent/vector-icons';
import Router from './src/Router';

class App extends Component {
  render() {
    return (
      <ThemeProvider>
        <NavigationProvider router={Router}>
        <Drawer
          content={<View style={{ backgroundColor: Colors.white, flex: 1 }}>
            <DrawerItem text='Ahmed' iconName='airplay' />
            <DrawerItem text='Ahmed' iconName='airplay' active />
            <DrawerItem text='Ahmed' iconName='airplay' />
            <DrawerItem text='Ahmed' iconName='airplay' />
          </View>}
        >
          <StackNavigation
            defaultRouteConfig={{
              navigationBar: {
                title: 'Examples',
                tintColor: Colors.white,
                backgroundColor: Colors.indigo500,
              },
            }}
            initialRoute={Router.getRoute('home')}
          />
        </Drawer>

        </NavigationProvider>
      </ThemeProvider>
    );
  }
}

const DrawerItem = ({ iconName, text, active }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8, backgroundColor: active ? Colors.grey300 : 'transparent' }}>
    <Icon
      name={iconName}
      size={24}
      color={Colors.grey700}
      style={{ marginRight: 8 }}
    />
    <Text style={{ color: Colors.grey700 }}>{text}</Text>
  </View>
);
Exponent.registerRootComponent(App);
