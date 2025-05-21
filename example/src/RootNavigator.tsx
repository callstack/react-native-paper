import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';

import ExampleList, { examples } from './ExampleList';

const Stack = createStackNavigator();

export default function Root() {
  const cardStyleInterpolator =
    Platform.OS === 'android'
      ? CardStyleInterpolators.forFadeFromBottomAndroid
      : CardStyleInterpolators.forHorizontalIOS;
  return (
    <View style={styles.stackWrapper}>
      <Stack.Navigator
        screenOptions={() => ({
          cardStyleInterpolator,
          header: ({ navigation, route, options, back }) => (
            <Appbar.Header elevated>
              {back ? (
                <Appbar.BackAction onPress={() => navigation.goBack()} />
              ) : (navigation as any).openDrawer ? (
                <Appbar.Action
                  icon="menu"
                  isLeading
                  onPress={() =>
                    (navigation as any as DrawerNavigationProp<{}>).openDrawer()
                  }
                />
              ) : null}
              <Appbar.Content title={options.title || route.name} />
            </Appbar.Header>
          ),
        })}
      >
        <Stack.Screen
          name="ExampleList"
          component={ExampleList}
          options={{
            title: 'Examples',
          }}
        />
        {(Object.keys(examples) as Array<keyof typeof examples>).map((id) => {
          return (
            <Stack.Screen
              key={id}
              name={id}
              component={examples[id]}
              options={{
                title: examples[id].title,
                headerShown: id !== 'themingWithReactNavigation',
              }}
            />
          );
        })}
      </Stack.Navigator>
    </View>
  );
}

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
