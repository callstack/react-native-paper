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

const SearchExample = () => {
  const navigation = useNavigation('Searchbar');

  const [isVisible, setIsVisible] = React.useState(false);
  const [searchQueries, setSearchQuery] = React.useState({
    searchBarMode: '',
    traileringIcon: '',
    traileringIconWithRightItem: '',
    rightItem: '',
    loadingBarMode: '',
    searchViewMode: '',
    searchWithoutBottomLine: '',
    loadingViewMode: '',
    clickableBack: '',
    clickableDrawer: '',
    withResults: '',
  });

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
            placeholder="Trailering icon"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, traileringIcon: query })
            }
            value={searchQueries.traileringIcon}
            traileringIcon={'microphone'}
            traileringIconColor={
              isVisible ? Palette.error40 : colors.onSurfaceVariant
            }
            traileringIconAccessibilityLabel={'microphone button'}
            onTraileringIconPress={() => setIsVisible(true)}
            style={styles.searchbar}
            mode="contained"
          />
          <Searchbar
            mode="contained"
            placeholder="Trailering icon with right item"
            onChangeText={(query) =>
              setSearchQuery({
                ...searchQueries,
                traileringIconWithRightItem: query,
              })
            }
            value={searchQueries.traileringIconWithRightItem}
            traileringIcon={'microphone'}
            traileringIconColor={
              isVisible ? Palette.error40 : colors.onSurfaceVariant
            }
            traileringIconAccessibilityLabel={'microphone button'}
            onTraileringIconPress={() => setIsVisible(true)}
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
            traileringIcon={'microphone'}
          />
        </List.Section>
        <List.Section title="Divided mode (deprecated)">
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
        </List.Section>
        <List.Section title="With results">
          <Searchbar
            placeholder="Search fruit"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, withResults: query })
            }
            value={searchQueries.withResults}
            style={styles.searchbar}
            mode="contained"
          />
          {searchQueries.withResults ? (
            <Searchbar.Results style={styles.searchbar}>
              {['Apple', 'Apricot', 'Avocado', 'Banana', 'Blueberry']
                .filter((fruit) =>
                  fruit
                    .toLowerCase()
                    .includes(searchQueries.withResults.toLowerCase())
                )
                .map((fruit) => (
                  <List.Item key={fruit} title={fruit} />
                ))}
            </Searchbar.Results>
          ) : null}
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
    margin: 4,
  },
});

export default SearchExample;
