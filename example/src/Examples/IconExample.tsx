import * as React from 'react';

import { Colors, Icon, Theme, withTheme } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

type Props = {
  theme: Theme;
};

type State = {
  loading: boolean;
};

class IconExample extends React.Component<Props, State> {
  static title = 'Icon';

  render() {
    const { colors } = this.props.theme;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Icon source="camera" size={20} color={Colors.green500} />
        <Icon source="heart" size={24} color={Colors.red500} />
        <Icon source="lock" size={36} color={Colors.blue500} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
  },
});

export default withTheme(IconExample);
