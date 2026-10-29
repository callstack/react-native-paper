import { Image, StyleSheet, View } from 'react-native';

import { Avatar, List, Palette } from 'react-native-paper';

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
                backgroundColor: Palette.error70,
              },
            ]}
            label="XD"
            color={Palette.primary0}
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
                backgroundColor: Palette.error70,
              },
            ]}
            icon="folder"
            color={Palette.primary0}
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
            alt="Jane Doe"
          />
          <Avatar.Image
            style={styles.avatar}
            source={require('../../assets/images/avatar.png')}
            size={80}
          />
        </View>
      </List.Section>
      <List.Section title="Image fallback">
        <View style={styles.row}>
          <Avatar.Image
            style={styles.avatar}
            source={{ uri: 'file:///missing-avatar.png' }}
            alt="Jane Doe"
            fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
          />
          <Avatar.Image
            style={styles.avatar}
            source={({ style, onError, ...a11y }) => (
              <Image
                source={require('../../assets/images/avatar.png')}
                style={style}
                onError={onError}
                accessibilityIgnoresInvertColors
                {...a11y}
              />
            )}
            alt="Jane Doe"
            fallback={({ size }) => <Avatar.Text size={size} label="JD" />}
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
