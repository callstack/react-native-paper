/* @flow */

import * as React from 'react';
import { ScrollView, View, Image, StyleSheet, Dimensions } from 'react-native';

type Props = {
  route: {
    key: string,
  },
};

export default class RecentsRoute extends React.Component<Props> {
  render() {
    const { route } = this.props;
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
