/* @flow */

import * as React from 'react';
import { View, Platform, StatusBar, StyleSheet } from 'react-native';
import {
  Colors,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarAction,
  ToolbarBackAction,
} from 'react-native-paper';

type Props = {
  navigation: any,
};

type State = {
  showLeftIcon: boolean,
  showSearchIcon: boolean,
  showMoreIcon: boolean,
  showSubtitle: boolean,
};

const MORE_ICON = Platform.OS === 'ios' ? 'more-horiz' : 'more-vert';

export default class ToolbarExample extends React.Component<Props, State> {
  static title = 'Toolbar';
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Toolbar
          dark
          statusBarHeight={Platform.OS === 'ios' ? 20 : StatusBar.currentHeight}
        >
          {navigation.params.showLeftIcon && (
            <ToolbarBackAction onPress={() => navigation.goBack()} />
          )}
          <ToolbarContent
            title="Title"
            subtitle={navigation.params.showSubtitle ? 'Subtitle' : null}
          />
          {navigation.params.showSearchIcon && (
            <ToolbarAction icon="search" onPress={() => {}} />
          )}
          {navigation.params.showMoreIcon && (
            <ToolbarAction icon={MORE_ICON} onPress={() => {}} />
          )}
        </Toolbar>
      ),
    };
  };

  state = {
    showLeftIcon: true,
    showSearchIcon: false,
    showMoreIcon: true,
    showSubtitle: false,
  };

  render() {
    const {
      showLeftIcon,
      showSearchIcon,
      showMoreIcon,
      showSubtitle,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Button
            accent
            raised
            onPress={() => {
              this.setState({ showLeftIcon: !this.state.showLeftIcon });
              this.props.navigation.setParams({
                showLeftIcon: !!showLeftIcon,
              });
            }}
          >
            {`Left icon: ${showLeftIcon ? 'On' : 'Off'}`}
          </Button>
          <Button
            accent
            raised
            onPress={() => {
              this.setState({ showSubtitle: !this.state.showSubtitle });
              this.props.navigation.setParams({
                showSubtitle: !showSubtitle,
              });
            }}
          >
            {`Subtitle: ${showSubtitle ? 'On' : 'Off'}`}
          </Button>
          <Button
            accent
            raised
            onPress={() => {
              this.setState({ showSearchIcon: !this.state.showSearchIcon });
              this.props.navigation.setParams({
                showSearchIcon: !showSearchIcon,
              });
            }}
          >
            {`Search icon: ${showSearchIcon ? 'On' : 'Off'}`}
          </Button>
          <Button
            accent
            raised
            onPress={() => {
              this.setState({ showMoreIcon: !this.state.showMoreIcon });
              this.props.navigation.setParams({
                showMoreIcon: !!showMoreIcon,
              });
            }}
          >
            {`More icon: ${showMoreIcon ? 'On' : 'Off'}`}
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
  },
  content: {
    flex: 1,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
});
