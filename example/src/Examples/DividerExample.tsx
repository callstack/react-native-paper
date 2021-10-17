import * as React from 'react';
import { FlatList } from 'react-native';
import { Divider, List, useTheme } from 'react-native-paper';
import ScreenWrapper from '../ScreenWrapper';

const items = ['Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach'];

const DividerExample = () => {
  const {
    colors: { background },
  } = useTheme();

  return (
    <ScreenWrapper withScrollView={false}>
      <FlatList
        style={{ backgroundColor: background }}
        renderItem={({ item }) => <List.Item title={item} />}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={Divider}
        data={items}
        alwaysBounceVertical={false}
      />
    </ScreenWrapper>
  );
};

DividerExample.title = 'Divider';

export default DividerExample;
