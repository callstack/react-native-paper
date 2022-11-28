import * as React from 'react';
import {
  Dimensions,
  Easing,
  Image,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import type { StackNavigationProp } from '@react-navigation/stack';
import { Appbar, BottomNavigation, Menu } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useExampleTheme } from '..';
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

type Route = { route: { key: string } };

type Props = {
  navigation: StackNavigationProp<{}>;
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

const PhotoGallery = ({ route }: Route) => {
  const PHOTOS = Array.from({ length: 24 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`
  );

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      {PHOTOS.map((uri) => (
        <View key={uri} style={styles.item}>
          <Image
            source={{ uri }}
            style={styles.photo}
            accessibilityIgnoresInvertColors
          />
        </View>
      ))}
    </ScreenWrapper>
  );
};

const BottomNavigationExample = ({ navigation }: Props) => {
  const { isV3 } = useExampleTheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [sceneAnimation, setSceneAnimation] =
    React.useState<
      React.ComponentProps<typeof BottomNavigation>['sceneAnimationType']
    >();

  const [routes] = React.useState<RoutesState>([
    {
      key: 'album',
      title: 'Album',
      focusedIcon: 'image-album',
      ...(!isV3 && { color: '#6200ee' }),
    },
    {
      key: 'library',
      title: 'Library',
      focusedIcon: 'inbox',
      badge: true,
      ...(isV3
        ? { unfocusedIcon: 'inbox-outline' }
        : {
            color: '#2962ff',
          }),
    },
    {
      key: 'favorites',
      title: 'Favorites',
      focusedIcon: 'heart',
      ...(isV3
        ? { unfocusedIcon: 'heart-outline' }
        : {
            color: '#00796b',
          }),
    },
    {
      key: 'purchased',
      title: 'Purchased',
      focusedIcon: 'shopping',
      ...(isV3 ? { unfocusedIcon: 'shopping-outline' } : { color: '#c51162' }),
    },
  ]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.screen}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Bottom Navigation" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              onPress={() => setMenuVisible(true)}
              {...(!isV3 && { color: 'white' })}
            />
          }
        >
          <Menu.Item
            trailingIcon={sceneAnimation === undefined ? 'check' : undefined}
            onPress={() => {
              setSceneAnimation(undefined);
              setMenuVisible(false);
            }}
            title="Scene animation: none"
          />
          <Menu.Item
            trailingIcon={sceneAnimation === 'shifting' ? 'check' : undefined}
            onPress={() => {
              setSceneAnimation('shifting');
              setMenuVisible(false);
            }}
            title="Scene animation: shifting"
          />
          <Menu.Item
            trailingIcon={sceneAnimation === 'opacity' ? 'check' : undefined}
            onPress={() => {
              setSceneAnimation('opacity');
              setMenuVisible(false);
            }}
            title="Scene animation: opacity"
          />
        </Menu>
      </Appbar.Header>
      <BottomNavigation
        safeAreaInsets={{ bottom: insets.bottom }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        labelMaxFontSizeMultiplier={2}
        renderScene={BottomNavigation.SceneMap({
          album: PhotoGallery,
          library: PhotoGallery,
          favorites: PhotoGallery,
          purchased: PhotoGallery,
        })}
        sceneAnimationEnabled={sceneAnimation !== undefined}
        sceneAnimationType={sceneAnimation}
        sceneAnimationEasing={Easing.ease}
        getLazy={({ route }) => route.key !== 'album'}
      />
    </View>
  );
};

BottomNavigationExample.title = 'Bottom Navigation';

export default BottomNavigationExample;

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      content: {
        // there is no 'grid' type in RN :(
        display: 'grid' as 'none',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: 8,
      },
      item: {
        width: '100%',
        height: 150,
      },
    },
    default: {
      content: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
      },
      item: {
        height: Dimensions.get('window').width / 2,
        width: '50%',
        padding: 4,
      },
    },
  }),
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
  screen: {
    flex: 1,
  },
});
