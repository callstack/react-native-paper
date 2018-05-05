/* @flow */

import * as React from 'react';
import { FlatList } from 'react-native';
import { Divider, ListItem, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

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
      renderItem={({ item }) => <ListItem title={item} />}
      keyExtractor={item => item}
      ItemSeparatorComponent={Divider}
      data={items}
    />
  );
};

DividerExample.title = 'Divider';

export default withTheme(DividerExample);
