import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import ExampleList, { examples } from './ExampleList';
import { Router, navigate } from '@reach/router';

const Home = (props: any) => (
  <View style={styles.container}>
    <Appbar.Header>
      <Appbar.Content title="Examples" />
    </Appbar.Header>
    <ExampleList navigation={props.navigation} />
  </View>
);

const routes = Object.keys(examples)
  .map(id => ({ id, item: examples[id] }))
  // @ts-ignore
  .reduce((acc, { id, item }) => {
    const Comp: any = item;

    const Screen = (props: any) => {
      const options =
        typeof Comp.navigationOptions === 'function'
          ? Comp.navigationOptions(props)
          : Comp.navigationOptions;

      return (
        <View style={styles.container}>
          {options && typeof options.header !== 'undefined' ? (
            options.header
          ) : (
            <Appbar.Header>
              <Appbar.BackAction onPress={() => props.navigation.goBack()} />
              <Appbar.Content title={(Comp as any).title} />
            </Appbar.Header>
          )}
          <Comp {...props} navigation={props.navigation} />
        </View>
      );
    };

    return [...acc, { id, Screen }];
  }, []);

export default class App extends React.Component<{}, any> {
  state = {
    navigation: {
      navigate,
      goBack: () => window.history.back(),
      state: {
        params: {},
      },
      setParams: (params: any) => {
        this.setState((state: any) => ({
          navigation: {
            ...state.navigation,
            state: {
              ...state.navigation.state,
              params: {
                ...state.navigation.state.params,
                ...params,
              },
            },
          },
        }));
      },
    },
  };

  render() {
    return (
      <Router>
        <Home key="/" path="/" navigation={this.state.navigation} />
        {routes.map(({ id, Screen }: any) => (
          <Screen key={id} path={id} navigation={this.state.navigation} />
        ))}
      </Router>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100vh',
  },
});
