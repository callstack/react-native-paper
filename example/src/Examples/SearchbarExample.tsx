import { Colors, Caption, Searchbar, useTheme } from 'react-native-paper';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const SearchExample = ({ navigation }: Props) => {
  const [firstQuery, setFirstQuery] = React.useState<string>('');
  const [secondQuery, setSecondQuery] = React.useState<string>('');
  const [thirdQuery, setThirdQuery] = React.useState<string>('');

  const {
    colors: { background },
  } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <Searchbar
        placeholder="Search"
        onChangeText={(query: string) => setFirstQuery(query)}
        value={firstQuery}
        style={styles.searchbar}
      />
      <Caption style={styles.caption}>Clickable icon</Caption>
      <Searchbar
        placeholder="Search"
        onChangeText={(query: string) => setSecondQuery(query)}
        value={secondQuery}
        onIconPress={() => navigation.goBack()}
        icon={{ source: 'arrow-left', direction: 'auto' }}
        style={styles.searchbar}
      />
      <Searchbar
        placeholder="Search"
        onChangeText={(query: string) => setThirdQuery(query)}
        value={thirdQuery}
        onIconPress={/* In real code, this will open the drawer */ () => {}}
        icon="menu"
        style={styles.searchbar}
      />
    </View>
  );
};

SearchExample.title = 'Searchbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    margin: 4,
  },
});

export default SearchExample;
