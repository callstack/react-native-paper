/* @flow */
import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TouchableRipple,
  withTheme,
  Paragraph,
  type Theme,
} from 'react-native-paper';

type Props = {
  theme: Theme,
};

class RippleExample extends React.Component<Props> {
  static title = 'TouchableRipple';

  render() {
    const {
      theme: {
        colors: { background },
      },
    } = this.props;
    return (
      <View style={[styles.container, { backgroundColor: background }]}>
        <TouchableRipple
          style={styles.ripple}
          onPress={() => {}}
          rippleColor="rgba(0, 0, 0, .32)"
        >
          <View pointerEvents="none">
            <Paragraph>Press anywhere</Paragraph>
          </View>
        </TouchableRipple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ripple: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTheme(RippleExample);
