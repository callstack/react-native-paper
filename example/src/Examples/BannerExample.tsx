import * as React from 'react';
import { View, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import { Banner, FAB } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const PHOTOS = Array.from({ length: 24 }).map(
  (_, i) => `https://unsplash.it/300/300/?random&__id=${i}`
);

const BannerExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);

  return (
    <>
      <ScreenWrapper>
        <Banner
          actions={[
            {
              label: 'Fix it',
              onPress: () => setVisible(false),
            },
            {
              label: 'Learn more',
              onPress: () => setVisible(false),
            },
          ]}
          icon={require('../../assets/images/email-icon.png')}
          visible={visible}
        >
          Two line text string with two actions. One to two lines is preferable
          on mobile.
        </Banner>
        <View style={styles.grid}>
          {PHOTOS.map((uri) => (
            <View key={uri} style={styles.item}>
              <Image source={{ uri }} style={styles.photo} />
            </View>
          ))}
        </View>
      </ScreenWrapper>
      <FAB
        icon="eye"
        label={visible ? 'Hide banner' : 'Show banner'}
        style={styles.fab}
        onPress={() => setVisible(!visible)}
      />
    </>
  );
};

BannerExample.title = 'Banner';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ...Platform.select({
    web: {
      grid: {
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
      grid: {
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
  fab: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    margin: 16,
  },
});

export default BannerExample;
