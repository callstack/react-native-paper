import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, IconButton, SegmentedButtons } from 'react-native-paper';

const SegmentedButtonMultiselectRealCase = () => {
  const [value, setValue] = React.useState<string[]>([]);

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
      {Array.from({ length: 10 }).map((_, i) => {
        const pathToRestaurantCover =
          i % 2 === 0
            ? require('../../assets/screenshots/restaurant-1.jpg')
            : require('../../assets/screenshots/restaurant-2.jpg');

        const price = Math.floor(1 + Math.random() * 4);

        if (value.length > 0 && !value.includes(`${price}`)) {
          return null;
        }

        return (
          <Card key={i} mode="contained" style={styles.card}>
            <Card.Content style={styles.content}>
              <Card.Cover style={styles.cover} source={pathToRestaurantCover} />
              <Card.Title
                title={`Restaurant no ${i}`}
                subtitle={'$'.repeat(price)}
                titleVariant="titleMedium"
                style={styles.title}
                right={() => <IconButton icon={'bookmark-outline'} />}
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

SegmentedButtonMultiselectRealCase.title = 'Restaurants';

export default SegmentedButtonMultiselectRealCase;
