import * as React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import {
  Colors,
  Appbar,
  FAB,
  Switch,
  Paragraph,
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
  showBottomPrimary: false,
  showTopPrimary: false,
};

const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

class AppbarExample extends React.Component<Props> {
  static title = 'Appbar';
  static navigationOptions = ({ navigation }: any) => {
    const params = { ...initialParams, ...navigation.state.params };

    return {
      header: (
        <Appbar.Header
          primary={params.showTopPrimary}
          style={params.showCustomColor ? { backgroundColor: '#ffff00' } : null}
        >
          {params.showLeftIcon && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
          )}
          <Appbar.Content
            title="Title"
            subtitle={params.showSubtitle ? 'Subtitle' : null}
          />
          {params.showSearchIcon && (
            <Appbar.Action icon="magnify" onPress={() => {}} />
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
        <View style={styles.row}>
          <Paragraph>Custom Color</Paragraph>
          <Switch
            value={params.showCustomColor}
            onValueChange={value =>
              navigation.setParams({
                showCustomColor: value,
              })
            }
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Bottom bar primary (dark theme)</Paragraph>
          <Switch
            value={params.showBottomPrimary}
            onValueChange={value =>
              navigation.setParams({
                showBottomPrimary: value,
              })
            }
          />
        </View>
        <View style={styles.row}>
          <Paragraph>Header bar primary (dark theme)</Paragraph>
          <Switch
            value={params.showTopPrimary}
            onValueChange={value =>
              navigation.setParams({
                showTopPrimary: value,
              })
            }
          />
        </View>
        <Appbar style={styles.bottom} primary={params.showBottomPrimary}>
          <Appbar.Action icon="archive" onPress={() => {}} />
          <Appbar.Action icon="email" onPress={() => {}} />
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
