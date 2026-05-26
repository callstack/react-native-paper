import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import { Appbar } from 'react-native-paper';

import ExampleList, { examples } from './ExampleList';

const { TeamDetails, ...examplesWithoutParams } = examples;

type ExampleRouteName = keyof typeof examplesWithoutParams;

const fromEntries = <Key extends PropertyKey, Value>(
  entries: Array<[Key, Value]>
) => Object.fromEntries(entries) as Record<Key, Value>;

function Header({ navigation, route, options, back }: NativeStackHeaderProps) {
  const drawerNavigation = useNavigation('Home');

  return (
    <Appbar.Header elevated>
      {back ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : (
        <Appbar.Action
          icon="menu"
          isLeading
          onPress={() => drawerNavigation.openDrawer()}
        />
      )}
      <Appbar.Content title={options.title || route.name} />
    </Appbar.Header>
  );
}

const Root = createNativeStackNavigator({
  layout: ({ children }) => <View style={styles.stackWrapper}>{children}</View>,
  screenOptions: {
    header: (props) => <Header {...props} />,
  },
  screens: {
    ExampleList: createNativeStackScreen({
      screen: ExampleList,
      options: {
        title: 'Examples',
      },
      linking: '',
    }),
    ...fromEntries(
      (
        Object.entries(examplesWithoutParams) as [
          ExampleRouteName,
          (typeof examplesWithoutParams)[ExampleRouteName]
        ][]
      ).map(([id, screen]) => [
        id,
        createNativeStackScreen({
          screen: screen,
          options: {
            title: screen.title,
            headerShown: id !== 'ThemingWithReactNavigation',
          },
        }),
      ])
    ),
    TeamDetails: createNativeStackScreen({
      screen: TeamDetails,
      options: {
        title: TeamDetails.title,
      },
      linking: {
        path: 'team-details/:sourceColor?/:headerTitle?/:darkMode?',
        parse: {
          darkMode: (value) => value === 'true',
        },
      },
    }),
  },
});

export default Root;

const styles = StyleSheet.create({
  stackWrapper: {
    flex: 1,
    ...Platform.select({
      web: {
        overflow: 'scroll',
      },
    }),
  },
});
