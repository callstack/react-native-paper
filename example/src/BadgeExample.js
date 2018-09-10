/* @flow */

import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Text,
  Button,
  IconButton,
  List,
  withTheme,
  Badge,
} from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

class BadgeExample extends React.Component<Props, State> {
  static title = 'Badge';

  render() {
    const { colors } = this.props.theme;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <List.Section title="Badges">
          <View style={styles.row}>
            <Badge style={styles.badge} count={0} />
            <Badge style={styles.badge} color={colors.accent} count={9} />
            <Badge style={styles.badge} color={'#e14649'} count={18} />
          </View>
        </List.Section>
        <List.Section title="Text with a badge">
          <View style={styles.row}>
            <Text>Hello world!</Text>
            <Badge style={styles.textBadge} count={12} />
          </View>
        </List.Section>
        <List.Section title="Button with a badge">
          <View style={styles.row}>
            <Button
              badgeCount={1}
              mode="outlined"
              onPress={() => {}}
              style={styles.button}
            >
              Default
            </Button>
            <Button
              badgePosition={'top-right'}
              badgeColor={colors.accent}
              badgeCount={26}
              mode="contained"
              onPress={() => {}}
              style={styles.button}
            >
              Default
            </Button>
          </View>
        </List.Section>
        <List.Section title="Icon with a badge">
          <View style={styles.row}>
            <IconButton
              icon="add-a-photo"
              size={24}
              onPress={() => {}}
              badgePosition={'top-right'}
              badgeColor={colors.accent}
              badgeCount={26}
            />
          </View>
        </List.Section>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badge: {
    marginRight: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  button: {
    margin: 4,
  },
  textBadge: {
    marginLeft: 0,
    marginTop: -10,
  },
});

export default withTheme(BadgeExample);
