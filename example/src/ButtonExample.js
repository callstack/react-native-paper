/* @flow */

import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Colors, Button, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  loading: boolean,
};

class ButtonExample extends React.Component<Props, State> {
  static title = 'Button';

  state = {
    loading: true,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.row}>
          <Button onPress={() => {}}>Simple</Button>
          <Button primary onPress={() => {}}>
            Primary
          </Button>
          <Button color={Colors.pink500} onPress={() => {}}>
            Custom
          </Button>
        </View>
        <View style={styles.row}>
          <Button raised onPress={() => {}}>
            Raised
          </Button>
          <Button raised primary onPress={() => {}}>
            Primary
          </Button>
          <Button raised color={Colors.pink500} onPress={() => {}}>
            Custom
          </Button>
        </View>
        <View style={styles.row}>
          <Button icon="add-a-photo" onPress={() => {}}>
            Icon
          </Button>
          <Button
            raised
            primary
            icon="file-download"
            loading={this.state.loading}
            onPress={() =>
              this.setState(state => ({ loading: !state.loading }))
            }
          >
            Loading
          </Button>
        </View>
        <View style={styles.row}>
          <Button disabled icon="my-location" onPress={() => {}}>
            Disabled
          </Button>
          <Button disabled loading raised onPress={() => {}}>
            Loading
          </Button>
        </View>
        <View style={styles.row}>
          <Button
            raised
            icon={{
              uri:
                'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400',
            }}
            onPress={() => {}}
          >
            Remote image
          </Button>
          <Button
            raised
            icon={require('../assets/favorite.png')}
            onPress={() => {}}
          >
            Required asset
          </Button>
          <Button
            icon={({ size }) => (
              <Image
                source={require('../assets/chameleon.jpg')}
                style={{ width: size, height: size, borderRadius: size / 2 }}
              />
            )}
            raised
            onPress={() => {}}
          >
            Custom component
          </Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});

export default withTheme(ButtonExample);
