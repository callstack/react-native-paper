/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Badge, Button, Drawer, List, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class BadgeExample extends React.Component<Props> {
  static title = 'Badge';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <List.Section title="Buttons">
          <View style={styles.row}>
            <Badge value="3">
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>

          <View style={styles.row}>
            <Badge
              value="3"
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
              value="3"
              verticalPosition="bottom"
              horizontalPosition="left"
            >
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>

          <View style={styles.row}>
            <Badge value="3" verticalPosition="top" horizontalPosition="left">
              <Button mode="outlined" onPress={() => {}}>
                Display notifications
              </Button>
            </Badge>
          </View>
        </List.Section>

        <List.Section title="Drawer Items">
          <View style={styles.row}>
            <Badge value="new">
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
