import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Card, IconButton, SegmentedButtons } from 'react-native-paper';

import { songsData, albumsData } from '../../../utils';

type MediaType = 'songs' | 'albums';

const SegmentedButtonRealCase = () => {
  const [value, setValue] = React.useState<MediaType>('songs');

  return (
    <View style={styles.container}>
      <SegmentedButtons<MediaType>
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
      <FlatList
        data={value === 'songs' ? songsData : albumsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        renderItem={({ item }) => {
          return (
            <Card mode="contained" style={styles.card}>
              <Card.Content style={styles.content}>
                <Card.Cover style={styles.cover} source={item.cover} />
                <Card.Title
                  title={item.title}
                  subtitle={item.artist}
                  titleVariant="titleMedium"
                  style={styles.title}
                  right={() => <IconButton icon={'bookmark-outline'} />}
                />
              </Card.Content>
            </Card>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
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
  group: {
    paddingHorizontal: 20,
    justifyContent: 'center',
    paddingBottom: 8,
  },
});

SegmentedButtonRealCase.title = 'Music player';

export default SegmentedButtonRealCase;
