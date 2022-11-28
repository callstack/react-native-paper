import * as React from 'react';
import { FlatList } from 'react-native';

import { Divider, List } from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

const items = ['Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach'];

const DividerExample = () => {
  const { colors } = useExampleTheme();

  return (
    <ScreenWrapper withScrollView={false}>
      <FlatList
        style={{ backgroundColor: colors?.background }}
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
