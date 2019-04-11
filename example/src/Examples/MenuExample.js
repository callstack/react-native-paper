/* @flow */

import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import {
  Menu,
  Appbar,
  Divider,
  Button,
  withTheme,
  type Theme,
} from 'react-native-paper';

type State = {
  visible1: boolean,
  visible2: boolean,
};

type Props = {
  theme: Theme,
  navigation: any,
};

const MORE_ICON = Platform.OS === 'ios' ? 'more-horiz' : 'more-vert';

class MenuExample extends React.Component<Props, State> {
  static navigationOptions = {
    header: null,
  };

  state = {
    visible1: false,
    visible2: false,
  };

  static title = 'Menu';

  _openMenu1 = () => this.setState({ visible1: true });
  _openMenu2 = () => this.setState({ visible2: true });

  _closeMenu1 = () => this.setState({ visible1: false });
  _closeMenu2 = () => this.setState({ visible2: false });

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <View style={styles.screen}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title="Menu" />
          <Menu
            visible={this.state.visible1}
            onDismiss={this._closeMenu1}
            anchor={
              <Appbar.Action
                icon={MORE_ICON}
                color="white"
                onPress={this._openMenu1}
              />
            }
          >
            <Menu.Item onPress={() => {}} title="Undo" />
            <Menu.Item onPress={() => {}} title="Redo" />
            <Divider />
            <Menu.Item onPress={() => {}} title="Cut" disabled />
            <Menu.Item onPress={() => {}} title="Copy" disabled />
            <Menu.Item onPress={() => {}} title="Paste" />
          </Menu>
        </Appbar.Header>
        <View style={[styles.container, { backgroundColor: background }]}>
          <Menu
            visible={this.state.visible2}
            onDismiss={this._closeMenu2}
            anchor={
              <Button mode="outlined" onPress={this._openMenu2}>
                Menu with icons
              </Button>
            }
          >
            <Menu.Item icon="undo" onPress={() => {}} title="Undo" />
            <Menu.Item icon="redo" onPress={() => {}} title="Redo" />
            <Divider />
            <Menu.Item
              icon="content-cut"
              onPress={() => {}}
              title="Cut"
              disabled
            />
            <Menu.Item
              icon="content-copy"
              onPress={() => {}}
              title="Copy"
              disabled
            />
            <Menu.Item icon="content-paste" onPress={() => {}} title="Paste" />
          </Menu>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
  },
});

export default withTheme(MenuExample);
