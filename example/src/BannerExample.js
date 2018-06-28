/* @flow */

import * as React from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { Banner, withTheme, FAB } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  visible: boolean,
};

const PhotoGallery = ({ route }) => {
  const PHOTOS = Array.from({ length: 24 }).map(
    (_, i) => `https://unsplash.it/300/300/?random&__id=${route.key}${i}`
  );

  return PHOTOS.map(uri => (
    <View key={uri} style={styles.item}>
      <Image source={{ uri }} style={styles.photo} />
    </View>
  ));
};

class BannerExample extends React.Component<Props, State> {
  static title = 'Banner';

  state = {
    visible: false,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Banner
          actions={[
            {
              label: 'Fix it',
              onPress: () => {
                this.setState({ visible: false });
              },
            },
            {
              label: 'Learn more',
              onPress: () => {
                this.setState({ visible: false });
              },
            },
          ]}
          image={
            <Image
              source={require('../assets/email-icon.png')}
              style={{
                width: 40,
                height: 40,
              }}
            />
          }
          message="Some text to display inside banner"
          visible={this.state.visible}
        />
        <ScrollView
          style={[styles.container, { backgroundColor: background }]}
          contentContainerStyle={styles.content}
        >
          {PhotoGallery({ route: { key: 1 } })}
        </ScrollView>
        <FAB
          small
          icon="add"
          style={{
            margin: 8,
            position: 'absolute',
            bottom: 0,
          }}
          onPress={() => {
            this.setState({ visible: true });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
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

export default withTheme(BannerExample);
