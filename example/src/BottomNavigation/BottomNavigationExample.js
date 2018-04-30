/* @flow */

import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import AlbumsRoute from './AlbumsRoute';
import LibraryRoute from './LibraryRoute';
import RecentsRoute from './RecentsRoute';
import PurchasedRoute from './PurchasedRoute';

export default class ButtomNavigationExample extends React.Component<{}, any> {
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
    album: AlbumsRoute,
    library: LibraryRoute,
    recents: RecentsRoute,
    purchased: PurchasedRoute,
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
