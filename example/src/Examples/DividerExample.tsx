import { Divider, List, useTheme } from 'react-native-paper';
import * as React from 'react';
import { FlatList } from 'react-native';

const items = ['Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach'];

const DividerExample = () => {
  const {
    colors: { background },
  } = useTheme();

  return (
    <FlatList
      style={{ backgroundColor: background }}
      renderItem={({ item }) => <List.Item title={item} />}
      keyExtractor={(item) => item}
      ItemSeparatorComponent={Divider}
      data={items}
    />
  );
};

DividerExample.title = 'Divider';

export default DividerExample;
