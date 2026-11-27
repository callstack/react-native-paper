import * as React from 'react';
import { Keyboard, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import {
  Avatar,
  List,
  Palette,
  Searchbar,
  Snackbar,
  useTheme,
} from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const FRUITS = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Blueberry'];

const filterFruits = (query: string) =>
  FRUITS.filter((fruit) => fruit.toLowerCase().includes(query.toLowerCase()));

const SearchExample = () => {
  const navigation = useNavigation('Searchbar');

  const [isVisible, setIsVisible] = React.useState(false);
  const [searchQueries, setSearchQuery] = React.useState({
    searchBarMode: '',
    trailingIcon: '',
    trailingIconWithRightItem: '',
    rightItem: '',
    loadingBarMode: '',
    searchViewMode: '',
    searchWithoutBottomLine: '',
    loadingViewMode: '',
    clickableBack: '',
    clickableDrawer: '',
    clickableLoading: '',
    withResults: '',
    dividedWithResults: '',
  });

  const [isResultsBarFocused, setIsResultsBarFocused] = React.useState(false);

  const { colors } = useTheme();

  return (
    <>
      <ScreenWrapper>
        <List.Section title="Contained mode">
          <Searchbar
            placeholder="Search"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, searchBarMode: query })
            }
            value={searchQueries.searchBarMode}
            style={styles.searchbar}
            mode="contained"
          />
          <Searchbar
            placeholder="Trailing icon"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, trailingIcon: query })
            }
            value={searchQueries.trailingIcon}
            trailingIcon={'microphone'}
            trailingIconColor={
              isVisible ? Palette.error40 : colors.onSurfaceVariant
            }
            trailingIconAccessibilityLabel={'microphone button'}
            onTrailingIconPress={() => setIsVisible(true)}
            style={styles.searchbar}
            mode="contained"
          />
          <Searchbar
            mode="contained"
            placeholder="Trailing icon with right item"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                trailingIconWithRightItem: query,
              })
            }
            value={searchQueries.trailingIconWithRightItem}
            trailingIcon={'microphone'}
            trailingIconColor={
              isVisible ? Palette.error40 : colors.onSurfaceVariant
            }
            trailingIconAccessibilityLabel={'microphone button'}
            onTrailingIconPress={() => setIsVisible(true)}
            right={(props) => (
              <Avatar.Image
                {...props}
                size={30}
                source={require('../../assets/images/avatar.png')}
              />
            )}
            style={styles.searchbar}
          />
          <Searchbar
            mode="contained"
            placeholder="Right item"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                rightItem: query,
              })
            }
            value={searchQueries.rightItem}
            right={(props) => (
              <Avatar.Image
                {...props}
                size={30}
                source={require('../../assets/images/avatar.png')}
              />
            )}
            style={styles.searchbar}
          />
          <Searchbar
            placeholder="Loading"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                loadingBarMode: query,
              })
            }
            value={searchQueries.loadingBarMode}
            style={styles.searchbar}
            mode="contained"
            loading
            trailingIcon={'microphone'}
          />
        </List.Section>
        <List.Section title="Divided mode">
          <Searchbar
            placeholder="Search"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                searchViewMode: query,
              })
            }
            value={searchQueries.searchViewMode}
            style={styles.searchbar}
            mode="divided"
          />
          <Searchbar
            placeholder="Search without bottom line"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                searchWithoutBottomLine: query,
              })
            }
            value={searchQueries.searchWithoutBottomLine}
            style={styles.searchbar}
            mode="divided"
            showDivider={false}
          />
          <Searchbar
            placeholder="Loading"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                loadingViewMode: query,
              })
            }
            value={searchQueries.loadingViewMode}
            style={styles.searchbar}
            mode="divided"
            loading
          />
        </List.Section>
        <List.Section title="With results">
          <Searchbar
            placeholder="Search fruit"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, withResults: query })
            }
            value={searchQueries.withResults}
            onFocus={() => setIsResultsBarFocused(true)}
            onBlur={() => setIsResultsBarFocused(false)}
            style={styles.searchbar}
            mode="contained"
          />
          {/* Contained results line up with the focused bar, so they show only
              while it has focus. */}
          {isResultsBarFocused && searchQueries.withResults ? (
            <Searchbar.Results>
              <List.Subheader>Results</List.Subheader>
              {filterFruits(searchQueries.withResults).map((fruit) => (
                <List.Item key={fruit} title={fruit} />
              ))}
            </Searchbar.Results>
          ) : null}
          <Searchbar
            placeholder="Search fruit"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, dividedWithResults: query })
            }
            value={searchQueries.dividedWithResults}
            mode="divided"
          />
          {searchQueries.dividedWithResults ? (
            <Searchbar.Results mode="divided">
              <List.Subheader>Results</List.Subheader>
              {filterFruits(searchQueries.dividedWithResults).map((fruit) => (
                <List.Item key={fruit} title={fruit} />
              ))}
            </Searchbar.Results>
          ) : null}
        </List.Section>
        <List.Section title="Clickable icon">
          <Searchbar
            placeholder="Search"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                clickableBack: query,
              })
            }
            value={searchQueries.clickableBack}
            onIconPress={() => {
              Keyboard.dismiss();
              navigation.goBack();
            }}
            onClearIconPress={() => {
              Keyboard.dismiss();
            }}
            icon={{ source: 'arrow-left', direction: 'auto' }}
            style={styles.searchbar}
          />
          <Searchbar
            placeholder="Search"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                clickableDrawer: query,
              })
            }
            value={searchQueries.clickableDrawer}
            onIconPress={() => {
              Keyboard.dismiss();
              navigation.openDrawer();
            }}
            icon="menu"
            style={styles.searchbar}
          />
          <Searchbar
            placeholder="Search"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                clickableLoading: query,
              })
            }
            value={searchQueries.clickableLoading}
            loading
            style={styles.searchbar}
          />
        </List.Section>
      </ScreenWrapper>
      <Snackbar
        visible={isVisible}
        onDismiss={() => setIsVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Microphone button pressed
      </Snackbar>
    </>
  );
};

SearchExample.title = 'Searchbar';

const styles = StyleSheet.create({
  searchbar: {
    marginVertical: 4,
  },
});

export default SearchExample;
