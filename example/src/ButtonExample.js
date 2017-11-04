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
    const uri = { uri: 'https://facebook.github.io/react/img/logo_og.png' };
    const source = require('../assets/chameleon.jpg');
    const { theme: { colors: { background } } } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.row}>
          <Button>Simple</Button>
          <Button primary>Primary</Button>
          <Button color={Colors.pink500}>Custom</Button>
        </View>
        <View style={styles.row}>
          <Button raised>Raised</Button>
          <Button raised primary>
            Primary
          </Button>
          <Button raised color={Colors.pink500}>
            Custom
          </Button>
        </View>
        <View style={styles.row}>
          <Button icon="add-a-photo">Icon</Button>
          <Button
            raised
            primary
            icon="file-download"
            loading={this.state.loading}
            onPress={() =>
              this.setState(state => ({ loading: !state.loading }))}
          >
            Loading
          </Button>
        </View>
        <View style={styles.row}>
          <Button disabled icon="my-location">
            Disabled
          </Button>
          <Button disabled loading raised>
            Loading
          </Button>
        </View>
        <View style={styles.row}>
          <Button raised icon={uri}>
            Remote image
          </Button>
          <Button raised icon={source}>
            Required asset
          </Button>
          <Button
            icon={
              <Image
                source={source}
                style={{ width: 16, height: 16, borderRadius: 10 }}
              />
            }
            raised
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
