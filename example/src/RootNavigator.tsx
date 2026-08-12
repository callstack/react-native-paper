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
import { usePreferences } from './Preferences/usePreferences';
import SamplesList, { samples } from './SamplesList';

const { TeamDetails, ...examplesWithoutParams } = examples;

type ExampleRouteName = keyof typeof examplesWithoutParams;
type SampleRouteName = keyof typeof samples;

const fromEntries = <Key extends PropertyKey, Value>(
  entries: Array<[Key, Value]>
) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Object.fromEntries(entries) as Record<Key, Value>;

function Header({ navigation, route, options, back }: NativeStackHeaderProps) {
  const { togglePreferences } = usePreferences();

  const isIOS = Platform.OS === 'ios';

  const backAction = <Appbar.BackAction onPress={() => navigation.goBack()} />;
  const searchAction = (
    <Appbar.Action
      icon="folder-search"
      onPress={() => navigation.navigate('ExampleList')}
    />
  );

  return (
    <Appbar.Header>
      {back ? backAction : isIOS ? searchAction : null}
      <Appbar.Content title={options.title || route.name} />
      {!isIOS && !back && searchAction}
      <Appbar.Action icon="cog" onPress={togglePreferences} />
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
    ...fromEntries(
      (
        Object.entries(samples) as [
          SampleRouteName,
          (typeof samples)[SampleRouteName],
        ][]
      ).map(([id, sample]) => [
        id,
        createNativeStackScreen({
          screen: sample.screen,
          options: {
            title: sample.title,
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
      linking: '',
    }),
    /* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
    ...fromEntries(
      (
        Object.entries(examplesWithoutParams) as [
          ExampleRouteName,
          (typeof examplesWithoutParams)[ExampleRouteName],
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
    /* eslint-enable @typescript-eslint/no-unsafe-type-assertion */
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
