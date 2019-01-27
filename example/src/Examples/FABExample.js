/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FAB, Portal, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  visible: boolean,
  open: boolean,
};

class ButtonExample extends React.Component<Props, State> {
  static title = 'Floating Action Button';

  state = {
    visible: true,
    open: false,
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
          <FAB
            small
            icon={this.state.visible ? 'visibility-off' : 'visibility'}
            style={styles.fab}
            onPress={() => {
              this.setState({
                visible: !this.state.visible,
              });
            }}
          />
        </View>

        <View style={styles.row}>
          <FAB
            icon="favorite"
            style={styles.fab}
            onPress={() => {}}
            visible={this.state.visible}
          />
          <FAB
            icon="done"
            label="Extended FAB"
            style={styles.fab}
            onPress={() => {}}
            visible={this.state.visible}
          />
          <FAB
            icon="cancel"
            label="Disabled FAB"
            style={styles.fab}
            onPress={() => {}}
            visible={this.state.visible}
            disabled
          />
          <Portal>
            <FAB.Group
              open={this.state.open}
              icon={this.state.open ? 'today' : 'add'}
              actions={[
                { icon: 'add', onPress: () => {} },
                { icon: 'star', label: 'Star', onPress: () => {} },
                { icon: 'email', label: 'Email', onPress: () => {} },
                { icon: 'notifications', label: 'Remind', onPress: () => {} },
              ]}
              onStateChange={({ open }) => this.setState({ open })}
              onPress={() => {
                if (this.state.open) {
                  // do something if the speed dial is open
                }
              }}
              visible={this.state.visible}
            />
          </Portal>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 4,
  },

  row: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  fab: {
    margin: 8,
  },
});

export default withTheme(ButtonExample);
