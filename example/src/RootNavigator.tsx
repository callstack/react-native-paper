import { Platform, StyleSheet, View } from 'react-native';

import {
  createNativeStackNavigator,
  createNativeStackScreen,
  type NativeStackHeaderProps,
} from '@react-navigation/native-stack';
import { Appbar } from 'react-native-paper';

import ExampleList, { examples } from './ExampleList';
import { colorThemes } from '../utils';
import PreferencesModal from './Preferences/PreferencesModal';
import SamplesList, { samples } from './SamplesList';
import { objectEntries, objectFromEntries } from '../utils/typedObject';
import { usePreferences } from './Preferences/usePreferences';

const { TeamDetails, ...examplesWithoutParams } = examples;

function Header({ navigation, route, options, back }: NativeStackHeaderProps) {
  const { togglePreferences } = usePreferences();

  return (
    <Appbar.Header>
      {back && <Appbar.BackAction onPress={() => navigation.goBack()} />}
      {!back && (
        <Appbar.Action
          isLeading
          icon="folder-search"
          accessibilityLabel="search examples"
          onPress={() => navigation.navigate('ExampleList')}
        />
      )}
      <Appbar.Content title={options.title || route.name} />
      <Appbar.Action
        icon="cog"
        accessibilityLabel="preferences"
        onPress={togglePreferences}
      />
    </Appbar.Header>
  );
}

const Root = createNativeStackNavigator({
  initialRouteName: 'SamplesList',
  layout: ({ children }) => (
    <>
      <View style={styles.stackWrapper}>{children}</View>
      <PreferencesModal />
    </>
  ),
  screenOptions: {
    header: (props) => <Header {...props} />,
  },
  screens: {
    SamplesList: createNativeStackScreen({
      screen: SamplesList,
      options: {
        title: 'Samples',
      },
      linking: '',
    }),
    ...objectFromEntries(
      objectEntries(samples).map(([id, sample]) => [
        id,
        createNativeStackScreen({
          screen: sample.screen,
          options: {
            title: sample.title,
            headerShown: sample.headerShown ?? true,
          },
        }),
      ])
    ),
    ExampleList: createNativeStackScreen({
      screen: ExampleList,
      options: {
        title: 'Examples',
        headerShown: false,
      },
      linking: 'examples',
    }),
    ...objectFromEntries(
      objectEntries(examplesWithoutParams).map(([id, screen]) => [
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
          sourceColor: (value) =>
            value in colorThemes
              ? // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                (value as keyof typeof colorThemes)
              : 'paper',
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
