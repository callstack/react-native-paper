import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Appbar, Searchbar } from 'react-native-paper';

import PreferencesAction from './Preferences/PreferencesAction';

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
};

export default function ExampleListHeader({ query, onQueryChange }: Props) {
  const navigation = useNavigation('ExampleList');

  const canGoBack = navigation.canGoBack();

  return (
    <Appbar.Header>
      <Searchbar
        placeholder="Search examples"
        value={query}
        onChangeText={onQueryChange}
        icon={
          canGoBack ? { source: 'arrow-left', direction: 'auto' } : 'magnify'
        }
        onIconPress={canGoBack ? () => navigation.goBack() : undefined}
        searchAccessibilityLabel={canGoBack ? 'go back' : 'search'}
        clearAccessibilityLabel="clear search"
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.searchbar}
      />
      <PreferencesAction />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    flex: 1,
  },
});
