import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Caption, Searchbar } from 'react-native-paper';
import type { StackNavigationProp } from '@react-navigation/stack';
import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const SearchExample = ({ navigation }: Props) => {
  const [firstQuery, setFirstQuery] = React.useState<string>('');
  const [secondQuery, setSecondQuery] = React.useState<string>('');
  const [thirdQuery, setThirdQuery] = React.useState<string>('');

  return (
    <ScreenWrapper>
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
    </ScreenWrapper>
  );
};

SearchExample.title = 'Searchbar';

const styles = StyleSheet.create({
  caption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchbar: {
    margin: 4,
  },
});

export default SearchExample;
