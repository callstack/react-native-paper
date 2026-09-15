import * as React from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Appbar, BottomNavigation, Menu } from 'react-native-paper';
import type {
  BottomNavigationItemLayout,
  BottomNavigationRoute,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenWrapper from '../ScreenWrapper';

type Route = { route: { key: string } };
type SceneAnimation = React.ComponentProps<
  typeof BottomNavigation
>['sceneAnimationType'];

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
            resizeMode="cover"
            style={styles.photo}
            accessibilityIgnoresInvertColors
          />
        </View>
      ))}
    </ScreenWrapper>
  );
};

const renderScene = BottomNavigation.SceneMap({
  album: PhotoGallery,
  library: PhotoGallery,
  favorites: PhotoGallery,
  purchased: PhotoGallery,
});

const BottomNavigationExample = () => {
  const navigation = useNavigation('BottomNavigation');

  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [sceneAnimation, setSceneAnimation] = React.useState<SceneAnimation>();
  const [labeled, setLabeled] = React.useState(true);
  const [shifting, setShifting] = React.useState(false);
  const [itemLayout, setItemLayout] =
    React.useState<BottomNavigationItemLayout>('auto');

  const [routes] = React.useState<BottomNavigationRoute[]>([
    {
      key: 'album',
      title: 'Album',
      focusedIcon: 'image-album',
    },
    {
      key: 'library',
      title: 'Library',
      focusedIcon: 'inbox',
      unfocusedIcon: 'inbox-outline',
      badge: true,
    },
    {
      key: 'favorites',
      title: 'Favorites',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {
      key: 'purchased',
      title: 'Purchased',
      focusedIcon: 'shopping',
      unfocusedIcon: 'shopping-outline',
      badge: 3,
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
          <Menu.Item
            trailingIcon={labeled ? 'check' : undefined}
            onPress={() => {
              setLabeled((value) => !value);
              setMenuVisible(false);
            }}
            title={labeled ? 'Labels: on' : 'Labels: off'}
          />
          <Menu.Item
            trailingIcon={shifting ? 'check' : undefined}
            onPress={() => {
              setShifting((value) => !value);
              setMenuVisible(false);
            }}
            title={shifting ? 'Shifting labels: on' : 'Shifting labels: off'}
          />
          <Menu.Item
            trailingIcon={itemLayout === 'auto' ? 'check' : undefined}
            onPress={() => {
              setItemLayout('auto');
              setMenuVisible(false);
            }}
            title="Layout: auto"
          />
          <Menu.Item
            trailingIcon={itemLayout === 'vertical' ? 'check' : undefined}
            onPress={() => {
              setItemLayout('vertical');
              setMenuVisible(false);
            }}
            title="Layout: vertical"
          />
          <Menu.Item
            trailingIcon={itemLayout === 'horizontal' ? 'check' : undefined}
            onPress={() => {
              setItemLayout('horizontal');
              setMenuVisible(false);
            }}
            title="Layout: horizontal"
          />
        </Menu>
      </Appbar.Header>
      <BottomNavigation
        safeAreaInsets={{ bottom: insets.bottom }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        labelMaxFontSizeMultiplier={2}
        labeled={labeled}
        shifting={shifting}
        itemLayout={itemLayout}
        renderScene={renderScene}
        sceneAnimationEnabled={sceneAnimation !== undefined}
        sceneAnimationType={sceneAnimation}
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
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
  },
  screen: {
    flex: 1,
  },
});
