/* @flow */

import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import {
  Colors,
  Appbar,
  FAB,
  Switch,
  Paragraph,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  navigation: any,
  theme: Theme,
};

const initialParams = {
  showLeftIcon: true,
  showSubtitle: true,
  showSearchIcon: true,
  showMoreIcon: true,
};

const MORE_ICON = Platform.OS === 'ios' ? 'more-horiz' : 'more-vert';

class AppbarExample extends React.Component<Props> {
  static title = 'Appbar';
  static navigationOptions = ({ navigation }) => {
    const params = { ...initialParams, ...navigation.state.params };

    return {
      header: (
        <Appbar.Header>
          {params.showLeftIcon && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          )}
          <Appbar.Content
            title="Title"
            subtitle={params.showSubtitle ? 'Subtitle' : null}
          />
          {params.showSearchIcon && (
            <Appbar.Action icon="search" onPress={() => {}} />
          )}
          {params.showMoreIcon && (
            <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
          )}
        </Appbar.Header>
      ),
    };
  };

  render() {
    const {
      navigation,
      theme: {
        colors: { background },
      },
    } = this.props;
    const params = { ...initialParams, ...navigation.state.params };

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: background,
          },
        ]}
      >
        <View style={styles.row}>
          <Paragraph>Left icon</Paragraph>
          <Switch
            value={params.showLeftIcon}
            onValueChange={value =>
              navigation.setParams({
                showLeftIcon: value,
              })
            }
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Subtitle</Paragraph>
          <Switch
            value={params.showSubtitle}
            onValueChange={value =>
              navigation.setParams({
                showSubtitle: value,
              })
            }
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Search icon</Paragraph>
          <Switch
            value={params.showSearchIcon}
            onValueChange={value =>
              navigation.setParams({
                showSearchIcon: value,
              })
            }
          />
        </View>
        <View style={styles.row}>
          <Paragraph>More icon</Paragraph>
          <Switch
            value={params.showMoreIcon}
            onValueChange={value =>
              navigation.setParams({
                showMoreIcon: value,
              })
            }
          />
        </View>
        <Appbar style={styles.bottom}>
          <Appbar.Action icon="archive" onPress={() => {}} />
          <Appbar.Action icon="mail" onPress={() => {}} />
          <Appbar.Action icon="label" onPress={() => {}} />
          <Appbar.Action icon="delete" onPress={() => {}} />
        </Appbar>
        <FAB icon="reply" onPress={() => {}} style={styles.fab} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 28,
  },
});

export default withTheme(AppbarExample);
