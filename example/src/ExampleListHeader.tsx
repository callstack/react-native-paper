import { StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Appbar, Searchbar } from 'react-native-paper';

import { usePreferences } from './Preferences/usePreferences';

type Props = {
  query: string;
  onQueryChange: (query: string) => void;
};

export default function ExampleListHeader({ query, onQueryChange }: Props) {
  const navigation = useNavigation('ExampleList');
  const { togglePreferences } = usePreferences();

  const canGoBack = navigation.canGoBack();

  return (
    <Appbar.Header>
      <Searchbar
        placeholder="Search examples"
        value={query}
        onChangeText={onQueryChange}
        icon={canGoBack ? 'arrow-left' : 'magnify'}
        onIconPress={canGoBack ? () => navigation.goBack() : undefined}
        searchAccessibilityLabel={canGoBack ? 'go back' : 'search'}
        traileringIcon="cog"
        traileringIconAccessibilityLabel="preferences"
        onTraileringIconPress={togglePreferences}
        clearAccessibilityLabel="clear search"
        autoCorrect={false}
        autoCapitalize="none"
        style={styles.searchbar}
      />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  searchbar: {
    flex: 1,
  },
});
