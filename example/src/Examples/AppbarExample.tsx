import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import {
  Colors,
  Appbar,
  FAB,
  Switch,
  Paragraph,
  Tooltip,
  withTheme,
  Theme,
} from 'react-native-paper';

type Props = {
  navigation: any;
  theme: Theme;
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
  static navigationOptions = ({ navigation }: any) => {
    const params = { ...initialParams, ...navigation.state.params };

    return {
      header: (
        <Appbar.Header>
          {params.showLeftIcon && (
            <Tooltip title="Go back">
              <Appbar.BackAction onPress={() => navigation.goBack()} />
            </Tooltip>
          )}
          <Appbar.Content
            title="Title"
            subtitle={params.showSubtitle ? 'Subtitle' : null}
          />
          {params.showSearchIcon && (
            <Tooltip title="Search">
              <Appbar.Action icon="search" onPress={() => {}} />
            </Tooltip>
          )}
          {params.showMoreIcon && (
            <Tooltip title="More">
              <Appbar.Action icon={MORE_ICON} onPress={() => {}} />
            </Tooltip>
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
          <Tooltip title="Archive">
            <Appbar.Action icon="archive" onPress={() => {}} />
          </Tooltip>
          <Tooltip title="Mail">
            <Appbar.Action icon="mail" onPress={() => {}} />
          </Tooltip>
          <Tooltip title="Label">
            <Appbar.Action icon="label" onPress={() => {}} />
          </Tooltip>
          <Tooltip title="Delete">
            <Appbar.Action icon="delete" onPress={() => {}} />
          </Tooltip>
        </Appbar>
        <Tooltip title="Reply" style={styles.fab}>
          <FAB icon="reply" onPress={() => {}} />
        </Tooltip>
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
