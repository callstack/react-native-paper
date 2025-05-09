import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, List, MD3Colors } from 'react-native-paper';

import ScreenWrapper from '../ScreenWrapper';

const AvatarExample = () => {
  return (
    <ScreenWrapper>
      <List.Section title="Text">
        <View style={styles.row}>
          <Avatar.Text
            style={[
              styles.avatar,
              {
                backgroundColor: MD3Colors.error70,
              },
            ]}
            label="XD"
            color={MD3Colors.primary0}
          />
          <Avatar.Text style={styles.avatar} label="XD" />
          <Avatar.Text style={styles.avatar} label="XD" size={80} />
        </View>
      </List.Section>
      <List.Section title="Icon">
        <View style={styles.row}>
          <Avatar.Icon
            style={[
              styles.avatar,
              {
                backgroundColor: MD3Colors.error70,
              },
            ]}
            icon="folder"
            color={MD3Colors.primary0}
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
    </ScreenWrapper>
  );
};

AvatarExample.title = 'Avatar';

const styles = StyleSheet.create({
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

export default AvatarExample;
