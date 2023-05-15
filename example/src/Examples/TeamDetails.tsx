import * as React from 'react';
import {
  Easing,
  FlatList,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Appbar,
  BottomNavigation,
  Card,
  Button,
  Text,
  Chip,
  Divider,
  IconButton,
  FAB,
  PaperProvider,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colorThemes, teamResultsData } from '../../utils';
import ScreenWrapper from '../ScreenWrapper';

type RoutesState = Array<{
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon?: string;
  color?: string;
  badge?: boolean;
  getAccessibilityLabel?: string;
  getTestID?: string;
}>;

type Route = {
  route: { key: string };
  params: {
    sourceColor: string;
    headerTitle: string;
    darkMode: boolean;
  };
};

type Props = {
  navigation: StackNavigationProp<{}>;
  route: Route;
};

type Item = {
  host: string;
  guest: string;
  result: string;
  winner: string;
  favourite: boolean;
};

const Roster = () => <View />;

const News = () => {
  return (
    <>
      <ScreenWrapper>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          style={styles.chipsContainer}
          contentContainerStyle={styles.chipsContent}
        >
          <Chip
            selected
            onPress={() => {}}
            style={styles.chip}
            showSelectedOverlay
          >
            Latest
          </Chip>
          <Chip onPress={() => {}} style={styles.chip}>
            Popular
          </Chip>
          <Chip onPress={() => {}} style={styles.chip}>
            Interviews
          </Chip>
          <Chip onPress={() => {}} style={styles.chip}>
            Transfers
          </Chip>
          <Chip onPress={() => {}} style={styles.chip}>
            League
          </Chip>
        </ScrollView>
        <View style={styles.cardContainer}>
          <Card style={styles.card} mode="contained">
            <Card.Cover source={require('../../assets/images/players.jpg')} />
            <Card.Title
              title="Winter transfer window"
              titleVariant="headlineMedium"
            />
            <Card.Content>
              <Text variant="bodyMedium">
                Which soccer players are switching teams? From the Premier
                League, La Liga and beyond, here is a list of players on the
                move this summer.
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Share</Button>
              <Button onPress={() => {}}>Read more</Button>
            </Card.Actions>
          </Card>
          <Card style={styles.card} mode="contained">
            <Card.Cover source={require('../../assets/images/players-2.jpg')} />
            <Card.Title
              title="John Doe's injury"
              titleVariant="headlineMedium"
            />
            <Card.Content>
              <Text variant="bodyMedium">
                Medical tests show that Doe has injured the tendon in his left
                hamstring, and in the next few days will...
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {}}>Share</Button>
              <Button onPress={() => {}}>Read more</Button>
            </Card.Actions>
          </Card>
        </View>
      </ScreenWrapper>
      <FAB icon="magnify" onPress={() => {}} visible style={styles.fab} />
    </>
  );
};

const Results = () => {
  const renderItem = ({ item }: { item: Item }) => {
    return (
      <View style={styles.listRow}>
        <IconButton
          onPress={() => {}}
          selected={item.favourite}
          icon={item.favourite ? 'star' : 'star-outline'}
        />
        <View style={styles.teamResultRow}>
          <View>
            <Text
              variant="bodyLarge"
              style={item.winner === item.host && styles.winner}
            >
              {item.host}
            </Text>
            <Text
              variant="bodyLarge"
              style={item.winner === item.guest && styles.winner}
            >
              {item.guest}
            </Text>
          </View>
          <View style={styles.score}>
            <Text variant="bodyLarge">{item.result.split(':')[0]}</Text>
            <Text variant="bodyLarge">{item.result.split(':')[1]}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={teamResultsData}
      renderItem={renderItem}
      ItemSeparatorComponent={Divider}
    />
  );
};

const ThemeBasedOnSourceColor = ({ navigation, route }: Props) => {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);

  const { params } = route;
  const { sourceColor, headerTitle, darkMode } = params;

  const [routes] = React.useState<RoutesState>([
    {
      key: 'news',
      title: 'News',
      focusedIcon: 'newspaper-variant',
      unfocusedIcon: 'newspaper-variant-outline',
      badge: true,
    },
    {
      key: 'results',
      title: 'Results',
      focusedIcon: 'soccer-field',
    },
    {
      key: 'roster',
      title: 'Roster',
      focusedIcon: 'account-group',
      unfocusedIcon: 'account-group-outline',
    },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const theme = colorThemes[sourceColor || 'paper'];

  const systemColorScheme = useColorScheme() || 'light';
  const colorScheme = darkMode ? 'dark' : systemColorScheme;

  return (
    <PaperProvider theme={theme[colorScheme]}>
      <View style={styles.screen}>
        <Appbar.Header elevated>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title={headerTitle} />
        </Appbar.Header>
        <BottomNavigation
          safeAreaInsets={{ bottom: insets.bottom }}
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          labelMaxFontSizeMultiplier={2}
          renderScene={BottomNavigation.SceneMap({
            news: News,
            results: Results,
            roster: Roster,
          })}
          sceneAnimationEnabled
          sceneAnimationType={'opacity'}
          sceneAnimationEasing={Easing.ease}
          getLazy={({ route }) => route.key !== 'album'}
        />
      </View>
    </PaperProvider>
  );
};

ThemeBasedOnSourceColor.title = 'Theme Based On Source Color';

export default ThemeBasedOnSourceColor;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  winner: {
    fontWeight: '700',
  },
  listRow: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  teamResultRow: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  score: {
    marginRight: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  card: {
    marginHorizontal: 8,
    marginBottom: 8,
  },
  cardContainer: {
    marginBottom: 80,
  },
  chipsContainer: {
    flexDirection: 'row',
  },
  chipsContent: {
    paddingLeft: 8,
    paddingVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
});
