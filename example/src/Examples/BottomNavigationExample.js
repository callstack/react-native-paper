/* @flow */

import * as React from 'react';
import {
  ScrollView,
  View,
  Image,
  Dimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { BottomNavigation } from 'react-native-paper';

type State = {
  index: number,
  routes: Array<{
    key: string,
    title: string,
    icon: string,
    color: string,
    badge?: boolean,
  }>,
};

const PhotoGallery = ({ route }) => {
  const PHOTOS = Array.from({ length: 24 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {PHOTOS.map(uri => (
        <View key={uri} style={styles.item}>
          <Image source={{ uri }} style={styles.photo} />
        </View>
      ))}
    </ScrollView>
  );
};

export default class BottomNavigationExample extends React.Component<
  {},
  State
> {
  static title = 'Bottom Navigation';

  state = {
    index: 0,
    routes: [
      { key: 'album', title: 'Album', icon: 'photo-album', color: '#6200ee' },
      {
        key: 'library',
        title: 'Library',
        icon: 'inbox',
        color: '#2962ff',
        badge: true,
      },
      {
        key: 'favorites',
        title: 'Favorites',
        icon: 'favorite',
        color: '#00796b',
      },
      {
        key: 'purchased',
        title: 'Purchased',
        icon: 'shop',
        color: '#c51162',
      },
    ],
  };

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={index => this.setState({ index })}
        renderScene={BottomNavigation.SceneMap({
          album: PhotoGallery,
          library: PhotoGallery,
          favorites: PhotoGallery,
          purchased: PhotoGallery,
        })}
      />
    );
  }
}

const styles = StyleSheet.create({
  ...Platform.select({
    web: {
      content: {
        display: 'grid',
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
