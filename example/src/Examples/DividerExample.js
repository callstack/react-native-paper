/* @flow */

import * as React from 'react';
import { FlatList } from 'react-native';
import { Divider, List, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

const items = ['Apple', 'Banana', 'Coconut', 'Lemon', 'Mango', 'Peach'];

const DividerExample = (props: Props) => {
  const {
    theme: {
      colors: { background },
    },
  } = props;

  return (
    <FlatList
      style={{ backgroundColor: background }}
      renderItem={({ item }) => <List.Item title={item} />}
      keyExtractor={item => item}
      ItemSeparatorComponent={Divider}
      data={items}
    />
  );
};

DividerExample.title = 'Divider';

export default withTheme(DividerExample);
