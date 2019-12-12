import * as React from 'react';
import { Platform } from 'react-native';
import { Appbar } from 'react-native-paper';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { createSimpleNavigator } from './SimpleNavigator';
import ExampleList, { examples } from './ExampleList';

const Stack: ReturnType<typeof createStackNavigator> =
  Platform.OS === 'web'
    ? (createSimpleNavigator() as any)
    : createStackNavigator();

export default function Root() {
  return (
    <Stack.Navigator
      headerMode="screen"
      screenOptions={{
        header: ({ navigation, scene, previous }) => (
          <Appbar.Header>
            {previous ? (
              <Appbar.BackAction onPress={() => navigation.goBack()} />
            ) : (
              <Appbar.Action
                icon="menu"
                onPress={() =>
                  ((navigation as any) as DrawerNavigationProp<{}>).openDrawer()
                }
              />
            )}
            <Appbar.Content title={scene.descriptor.options.title} />
          </Appbar.Header>
        ),
      }}
    >
      <Stack.Screen
        name="Home"
        component={ExampleList}
        options={{ title: 'Examples' }}
      />
      {(Object.keys(examples) as Array<keyof typeof examples>).map(id => (
        <Stack.Screen
          key={id}
          name={id}
          component={examples[id]}
          options={{ title: examples[id].title }}
        />
      ))}
    </Stack.Navigator>
  );
}
