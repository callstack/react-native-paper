import * as React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Avatar, List, withTheme, Colors, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
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
            <Avatar.Text
              style={[styles.avatar, { backgroundColor: Colors.yellow500 }]}
              label="XD"
              color={Colors.black}
            />
            <Avatar.Text style={styles.avatar} label="XD" />
            <Avatar.Text style={styles.avatar} label="XD" size={80} />
          </View>
        </List.Section>
        <List.Section title="Icon">
          <View style={styles.row}>
            <Avatar.Icon
              style={[styles.avatar, { backgroundColor: Colors.yellow500 }]}
              icon="folder"
              color={Colors.black}
            />
            <Avatar.Icon style={styles.avatar} icon="folder" />
            <Avatar.Icon style={styles.avatar} icon="folder" size={80} />
          </View>
        </List.Section>
        <List.Section title="Image">
          <View style={styles.row}>
            <Avatar.Image
              style={styles.avatar}
              source={require('../../assets/images/avatar.png')}
            />
            <Avatar.Image
              style={styles.avatar}
              source={require('../../assets/images/avatar.png')}
              size={80}
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
    alignItems: 'center',
    margin: 8,
  },
  avatar: {
    margin: 8,
  },
});

export default withTheme(AvatarExample);
