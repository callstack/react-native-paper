import * as React from 'react';
import { Keyboard, StyleSheet } from 'react-native';

import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  List,
  MD3Colors,
  Searchbar,
  Snackbar,
  Avatar,
} from 'react-native-paper';

import { useExampleTheme } from '..';
import ScreenWrapper from '../ScreenWrapper';

type Props = {
  navigation: StackNavigationProp<{}>;
};

const SearchExample = ({ navigation }: Props) => {
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
  });

  const { isV3, colors } = useExampleTheme();

  return (
    <>
      <ScreenWrapper>
        {!isV3 && (
          <Searchbar
            placeholder="Search"
            onChangeText={(query) =>
              setSearchQuery({ ...searchQueries, searchBarMode: query })
            }
            value={searchQueries.searchBarMode}
            style={styles.searchbar}
          />
        )}
        {isV3 && (
          <List.Section title="Bar mode">
            <Searchbar
              placeholder="Search"
              onChangeText={(query) =>
                setSearchQuery({ ...searchQueries, searchBarMode: query })
              }
              value={searchQueries.searchBarMode}
              style={styles.searchbar}
              mode="bar"
            />
            <Searchbar
              placeholder="Trailing icon"
              onChangeText={(query) =>
                setSearchQuery({ ...searchQueries, trailingIcon: query })
              }
              value={searchQueries.trailingIcon}
              trailingIcon={'microphone'}
              trailingIconColor={
                isVisible ? MD3Colors.error40 : colors.onSurfaceVariant
              }
              trailingIconAccessibilityLabel={'microphone button'}
              onTrailingIconPress={() => setIsVisible(true)}
              style={styles.searchbar}
              mode="bar"
            />
            <Searchbar
              mode="bar"
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
                isVisible ? MD3Colors.error40 : colors.onSurfaceVariant
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
              mode="bar"
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
              mode="bar"
              loading
              trailingIcon={'microphone'}
            />
          </List.Section>
        )}
        {isV3 && (
          <List.Section title="View mode">
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
              mode="view"
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
              mode="view"
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
              mode="view"
              loading
            />
          </List.Section>
        )}
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
              (navigation as any as DrawerNavigationProp<{}>).openDrawer();
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
    margin: 4,
  },
});

export default SearchExample;
