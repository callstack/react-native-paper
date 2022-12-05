import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Card, IconButton, SegmentedButtons } from 'react-native-paper';

const SegmentedButtonMultiselectRealCase = () => {
  const [value, setValue] = React.useState<string[]>([]);

  const data = React.useMemo(() => {
    return Array(10)
      .fill([])
      .map((_, i) => {
        const pathToRestaurantCover =
          i % 2 === 0
            ? require('../../assets/screenshots/restaurant-1.jpg')
            : require('../../assets/screenshots/restaurant-2.jpg');

        const price = Math.ceil(Math.min((i + 1) / 2, 4));

        return {
          id: `${i}`,
          name: `Restaurant no ${i}`,
          price,
          cover: pathToRestaurantCover,
        };
      });
  }, []);

  const filteredData = data.filter((item) =>
    value.includes(item.price.toString())
  );

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        multiSelect
        buttons={[
          {
            value: '1',
            label: '$',
            style: styles.button,
            showSelectedCheck: true,
          },
          {
            value: '2',
            label: '$$',
            style: styles.button,
            showSelectedCheck: true,
          },
          {
            value: '3',
            label: '$$$',
            style: styles.button,
            showSelectedCheck: true,
          },
          {
            value: '4',
            label: '$$$$',
            style: styles.button,
            showSelectedCheck: true,
          },
        ]}
        style={styles.group}
      />
      <FlatList
        data={value.length > 0 ? filteredData : data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <Card mode="contained" style={styles.card}>
              <Card.Content style={styles.content}>
                <Card.Cover style={styles.cover} source={item.cover} />
                <Card.Title
                  title={item.name}
                  subtitle={'$'.repeat(item.price)}
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

SegmentedButtonMultiselectRealCase.title = 'Restaurants';

export default SegmentedButtonMultiselectRealCase;
