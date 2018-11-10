/* @flow */

import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Avatar, List, withTheme, type Theme } from 'react-native-paper';

type Props = {
  theme: Theme,
};

class AvatarExample extends React.Component<Props> {
  static title = 'Avatar';

  render() {
    const { colors } = this.props.theme;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.surface }]}
      >
        <List.Section title="Text">
          <View style={styles.row}>
            <Avatar.Text style={styles.avatar} label="JD" />

            <Avatar.Text style={styles.avatar} label="JD" color="#FFFFFF" />

            <Avatar.Text
              style={styles.avatar}
              label="JD"
              color="#FFFFFF"
              size={96}
            />

            <Avatar.Text
              style={styles.avatar}
              label="JD"
              color="#FFFFFF"
              size={96}
              backgroundColor={colors.accent}
            />
          </View>
        </List.Section>
        <List.Section title="Icon">
          <View style={styles.row}>
            <Avatar.Icon style={styles.avatar} icon="folder" />

            <Avatar.Icon style={styles.avatar} icon="folder" color="#FFFFFF" />

            <Avatar.Icon
              style={styles.avatar}
              icon="folder"
              color="#FFFFFF"
              size={96}
            />

            <Avatar.Icon
              style={styles.avatar}
              icon="folder"
              color="#FFFFFF"
              size={96}
              backgroundColor={colors.accent}
            />
          </View>
        </List.Section>
        <List.Section title="Image">
          <View style={styles.row}>
            <Avatar.Image
              style={styles.avatar}
              source={require('../assets/avatar.jpg')}
            />

            <Avatar.Image
              style={styles.avatar}
              source={require('../assets/avatar.jpg')}
              size={96}
            />

            <Avatar.Image
              style={styles.avatar}
              source={{ src: 'unknown' }}
              size={96}
              backgroundColor={colors.accent}
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
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    margin: 2,
  },
});

export default withTheme(AvatarExample);
