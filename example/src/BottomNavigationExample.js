/* @flow */

import * as React from 'react';
import { ScrollView, View, Image, Dimensions, StyleSheet } from 'react-native';
import { BottomNavigation } from 'react-native-paper';

type State = {
  index: number,
  routes: Array<{
    key: string,
    title: string,
    icon: string,
    color: string,
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

export default class ButtomNavigationExample extends React.Component<
  {},
  State
> {
  static title = 'Bottom navigation';

  state = {
    index: 0,
    routes: [
      { key: 'album', title: 'Album', icon: 'photo-album', color: '#3F51B5' },
      {
        key: 'library',
        title: 'Library',
        icon: 'photo-library',
        color: '#009688',
      },
      { key: 'recents', title: 'Recents', icon: 'history', color: '#795548' },
      {
        key: 'purchased',
        title: 'Purchased',
        icon: 'shopping-cart',
        color: '#607D8B',
      },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    album: PhotoGallery,
    library: PhotoGallery,
    recents: PhotoGallery,
    purchased: PhotoGallery,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}

const styles = StyleSheet.create({
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
  photo: {
    flex: 1,
    resizeMode: 'cover',
  },
});
