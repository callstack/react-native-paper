/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Badge,
  Button,
  Drawer,
  List,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  value: number,
};

class BadgeExample extends React.Component<Props, State> {
  static title = 'Badge';

  state = {
    value: 2,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    const { value } = this.state;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={styles.row}>
          <Button
            onPress={() => {
              this.setState({ value: this.state.value + 1 });
            }}
          >
            Increase
          </Button>

          <Button
            onPress={() => {
              this.setState({ value: this.state.value - 1 });
            }}
          >
            Decrease
          </Button>
        </View>

        <List.Section title="Buttons">
          <View style={styles.row}>
            <Badge value={value}>
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>

          <View style={styles.row}>
            <Badge
              value={value}
              verticalPosition="bottom"
              horizontalPosition="right"
            >
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>

          <View style={styles.row}>
            <Badge
              value={value}
              verticalPosition="bottom"
              horizontalPosition="left"
            >
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>

          <View style={styles.row}>
            <Badge
              value={value}
              verticalPosition="top"
              horizontalPosition="left"
            >
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>
        </List.Section>

        <List.Section title="Drawer Items">
          <View style={styles.row}>
            <Badge value={value} style={{ backgroundColor: '#FF0000' }}>
              <Drawer.Item label="First Item" />
            </Badge>
          </View>
        </List.Section>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
});

export default withTheme(BadgeExample);
