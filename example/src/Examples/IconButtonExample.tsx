import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { IconButton, Colors, withTheme, Theme } from 'react-native-paper';

type Props = {
  theme: Theme;
};

type State = {
  loading: boolean;
};

class ButtonExample extends React.Component<Props, State> {
  static title = 'Icon Button';

  render() {
    const { colors } = this.props.theme;

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <IconButton icon="add-a-photo" size={24} onPress={() => {}} />
        <IconButton
          icon="https"
          size={24}
          color={Colors.green500}
          onPress={() => {}}
        />
        <IconButton icon="add-a-photo" size={36} onPress={() => {}} />
        <IconButton
          icon="add-shopping-cart"
          size={36}
          onPress={() => {}}
          style={{ backgroundColor: Colors.lightGreen200 }}
        />
        <IconButton icon="chrome-reader-mode" size={60} onPress={() => {}} />
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

export default withTheme(ButtonExample);
