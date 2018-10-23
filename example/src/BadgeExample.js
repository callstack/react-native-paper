/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Badge,
  IconButton,
  List,
  Paragraph,
  Switch,
  Colors,
  withTheme,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

type State = {
  visible: boolean,
};

class BadgeExample extends React.Component<Props, State> {
  static title = 'Badge';

  state = {
    visible: true,
  };

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;

    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <View style={[styles.row, styles.item]}>
          <Paragraph style={styles.label}>Show badges</Paragraph>
          <Switch
            value={this.state.visible}
            onValueChange={visible => this.setState({ visible })}
          />
        </View>
        <List.Section title="Text">
          <View style={styles.row}>
            <View style={styles.item}>
              <IconButton icon="style" size={36} style={styles.button} />
              <Badge visible={this.state.visible} style={styles.badge}>
                12
              </Badge>
            </View>
            <View style={styles.item}>
              <IconButton icon="inbox" size={36} style={styles.button} />
              <Badge
                visible={this.state.visible}
                style={[styles.badge, { backgroundColor: Colors.blue500 }]}
              >
                999+
              </Badge>
            </View>
          </View>
        </List.Section>
        <List.Section title="Dot">
          <View style={styles.row}>
            <View style={styles.item}>
              <IconButton
                icon="chrome-reader-mode"
                size={36}
                style={styles.button}
              />
              <Badge
                visible={this.state.visible}
                style={styles.badge}
                size={8}
              />
            </View>
            <View style={styles.item}>
              <IconButton icon="receipt" size={36} style={styles.button} />
              <Badge
                visible={this.state.visible}
                style={styles.badge}
                size={8}
              />
            </View>
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
  },
  item: {
    margin: 16,
  },
  button: {
    opacity: 0.6,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 0,
  },
  label: {
    flex: 1,
  },
});

export default withTheme(BadgeExample);
