/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, FAB, Portal, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  open: boolean,
};

class ButtonExample extends React.Component<Props, State> {
  static title = 'Floating Action Button';

  state = {
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
          <FAB small icon="add" style={styles.fab} onPress={() => {}} />
          <FAB icon="favorite" style={styles.fab} onPress={() => {}} />
          <FAB
            icon="done"
            label="Extended FAB"
            style={styles.fab}
            onPress={() => {}}
          />
          <FAB
            icon="cancel"
            label="Disabled FAB"
            style={styles.fab}
            onPress={() => {}}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fab: {
    margin: 8,
  },
});

export default withTheme(ButtonExample);
