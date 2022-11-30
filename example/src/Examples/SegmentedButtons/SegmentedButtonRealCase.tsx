import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, IconButton, SegmentedButtons } from 'react-native-paper';

const SegmentedButtonRealCase = () => {
  const [value, setValue] = React.useState('songs');

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: 'songs',
            label: 'Songs',
            style: styles.button,
            showSelectedCheck: true,
          },
          {
            value: 'albums',
            label: 'Albums',
            style: styles.button,
            showSelectedCheck: true,
          },
        ]}
        style={styles.group}
      />
      {Array.from({ length: 10 }).map((_, i) => {
        const pathToSongCover =
          i % 2 === 0
            ? require('../../assets/screenshots/song-1.jpg')
            : require('../../assets/screenshots/song-2.jpg');

        const pathToAlbumsCover =
          i % 2 === 0
            ? require('../../assets/screenshots/artist-1.jpg')
            : require('../../assets/screenshots/artist-2.jpg');

        return (
          <Card key={i} mode="contained" style={styles.card}>
            <Card.Content style={styles.content}>
              <Card.Cover
                style={styles.cover}
                source={value === 'songs' ? pathToSongCover : pathToAlbumsCover}
              />
              <Card.Title
                title={
                  value === 'songs'
                    ? `Song title no ${i}`
                    : `Albums title no ${i}`
                }
                subtitle={`The artist no ${i}`}
                titleVariant="titleMedium"
                style={styles.title}
                right={() => <IconButton icon={'play-circle-outline'} />}
              />
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  cover: {
    width: 72,
    height: 72,
  },
  title: {
    flexShrink: 1,
    marginVertical: 0,
  },
  button: {
    flex: 1,
  },
  group: { paddingHorizontal: 20, justifyContent: 'center' },
});

SegmentedButtonRealCase.title = 'Music player';

export default SegmentedButtonRealCase;
