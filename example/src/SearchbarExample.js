/* @flow */

import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Colors,
  Caption,
  Searchbar,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  navigation: any,
  theme: Theme,
};

type State = {
  firstQuery: string,
  secondQuery: string,
  thirdQuery: string,
};

class SearchExample extends React.Component<Props, State> {
  static title = 'Searchbar';

  state = {
    firstQuery: '',
    secondQuery: '',
    thirdQuery: '',
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <Searchbar
          placeholder="Search"
          onChangeText={query => this.setState({ firstQuery: query })}
          value={this.state.firstQuery}
          style={styles.searchbar}
        />
        <Caption style={styles.caption}>Clickable icon</Caption>
        <Searchbar
          placeholder="Search"
          onChangeText={query => this.setState({ secondQuery: query })}
          value={this.state.secondQuery}
          onIconPress={() => this.props.navigation.goBack()}
          icon={{ source: 'arrow-back', direction: 'auto' }}
          style={styles.searchbar}
        />
        <Searchbar
          placeholder="Search"
          onChangeText={query => this.setState({ thirdQuery: query })}
          value={this.state.thirdQuery}
          onIconPress={/* In real code, this will open the drawer */ () => {}}
          icon="menu"
          style={styles.searchbar}
        />
      </View>
    );
  }
}

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

export default withTheme(SearchExample);
