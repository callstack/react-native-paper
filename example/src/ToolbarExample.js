/* @flow */

import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import {
  Colors,
  Switch,
  Paragraph,
  Toolbar,
  ToolbarContent,
  ToolbarAction,
  ToolbarBackAction,
  withTheme,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

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

class ToolbarExample extends React.Component<Props> {
  static title = 'Toolbar';
  static navigationOptions = ({ navigation }) => {
    const params = { ...initialParams, ...navigation.state.params };

    return {
      header: (
        <Toolbar>
          {params.showLeftIcon && (
            <ToolbarBackAction onPress={() => navigation.goBack()} />
          )}
          <ToolbarContent
            title="Title"
            subtitle={params.showSubtitle ? 'Subtitle' : null}
          />
          {params.showSearchIcon && (
            <ToolbarAction icon="search" onPress={() => {}} />
          )}
          {params.showMoreIcon && (
            <ToolbarAction icon={MORE_ICON} onPress={() => {}} />
          )}
        </Toolbar>
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
});

export default withTheme(ToolbarExample);
