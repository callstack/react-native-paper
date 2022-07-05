import * as React from 'react';
import { View, Image, Dimensions, StyleSheet, Platform } from 'react-native';
import { BottomNavigation, useTheme } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

const PhotoGallery = ({ route }: Route) => {
  const PHOTOS = Array.from({ length: 24 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`
  );

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      {PHOTOS.map((uri) => (
        <View key={uri} style={styles.item}>
          <Image source={{ uri }} style={styles.photo} />
        </View>
      ))}
    </ScreenWrapper>
  );
};

const BottomNavigationExample = () => {
  const { isV3 } = useTheme();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
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

  return (
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
    />
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
});
