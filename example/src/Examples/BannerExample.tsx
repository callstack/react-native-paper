import * as React from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';

import { Banner, FAB, MD2Colors, MD3Colors } from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const PHOTOS = Array.from({ length: 24 }).map(
  (_, i) => `https://unsplash.it/300/300/?random&__id=${i}`
);

const BannerExample = () => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const [useCustomTheme, setUseCustomTheme] = React.useState<boolean>(false);
  const defaultTheme = useExampleTheme();
  const customTheme = !defaultTheme.isV3
    ? {
        ...defaultTheme,
        colors: {
          text: MD2Colors.white,
          surface: MD2Colors.blue200,
          primary: MD2Colors.purple900,
        },
      }
    : {
        ...defaultTheme,
        colors: {
          onSurface: MD3Colors.tertiary100,
          elevation: {
            level1: MD3Colors.tertiary50,
          },
          primary: MD3Colors.tertiary10,
        },
      };

  return (
    <>
      <ScreenWrapper>
        <Banner
          actions={[
            {
              label: `Set ${useCustomTheme ? 'default' : 'custom'} theme`,
              onPress: () => setUseCustomTheme(!useCustomTheme),
            },
            {
              label: 'Fix it',
              onPress: () => setVisible(false),
            },
          ]}
          icon={require('../../assets/images/email-icon.png')}
          visible={visible}
          onShowAnimationFinished={() =>
            console.log('Completed opening animation')
          }
          onHideAnimationFinished={() =>
            console.log('Completed closing animation')
          }
          theme={useCustomTheme ? customTheme : defaultTheme}
        >
          Two line text string with two actions. One to two lines is preferable
          on mobile.
        </Banner>
        <View style={styles.grid}>
          {PHOTOS.map((uri) => (
            <View key={uri} style={styles.item}>
              <Image
                source={{ uri }}
                style={styles.photo}
                accessibilityIgnoresInvertColors
              />
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
