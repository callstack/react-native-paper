/* @flow */

import * as React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Button, ListSection, withTheme } from 'react-native-paper';
import type { Theme } from 'react-native-paper/types';

type Props = {
  theme: Theme,
};

type State = {
  loading: boolean,
};

class ButtonExample extends React.Component<Props, State> {
  static title = 'Button';

  render() {
    const { colors } = this.props.theme;

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ListSection title="Text button">
          <View style={styles.row}>
            <Button onPress={() => {}}>Default</Button>
            <Button color={colors.accent} onPress={() => {}}>
              Custom
            </Button>
            <Button disabled onPress={() => {}}>
              Disabled
            </Button>
            <Button icon="add-a-photo" onPress={() => {}}>
              Icon
            </Button>
            <Button loading onPress={() => {}}>
              Loading
            </Button>
          </View>
        </ListSection>
        <ListSection title="Outlined button">
          <View style={styles.row}>
            <Button mode="outlined" onPress={() => {}}>
              Default
            </Button>
            <Button mode="outlined" color={colors.accent} onPress={() => {}}>
              Custom
            </Button>
            <Button mode="outlined" disabled onPress={() => {}}>
              Disabled
            </Button>
            <Button mode="outlined" icon="add-a-photo" onPress={() => {}}>
              Icon
            </Button>
            <Button mode="outlined" loading onPress={() => {}}>
              Loading
            </Button>
          </View>
        </ListSection>
        <ListSection title="Contained button">
          <View style={styles.row}>
            <Button mode="contained" onPress={() => {}}>
              Default
            </Button>
            <Button mode="contained" color={colors.accent} onPress={() => {}}>
              Custom
            </Button>
            <Button mode="contained" disabled onPress={() => {}}>
              Disabled
            </Button>
            <Button mode="contained" icon="add-a-photo" onPress={() => {}}>
              Icon
            </Button>
            <Button mode="contained" loading onPress={() => {}}>
              Loading
            </Button>
          </View>
        </ListSection>
        <ListSection title="Custom icon">
          <View style={styles.row}>
            <Button
              mode="outlined"
              icon={{
                uri:
                  'https://avatars0.githubusercontent.com/u/17571969?v=3&s=400',
              }}
              onPress={() => {}}
            >
              Remote image
            </Button>
            <Button
              mode="outlined"
              icon={require('../assets/favorite.png')}
              onPress={() => {}}
            >
              Required asset
            </Button>
            <Button
              mode="outlined"
              icon={({ size }) => (
                <Image
                  source={require('../assets/chameleon.jpg')}
                  style={{ width: size, height: size, borderRadius: size / 2 }}
                />
              )}
              onPress={() => {}}
            >
              Custom component
            </Button>
          </View>
        </ListSection>
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
    paddingHorizontal: 12,
  },
});

export default withTheme(ButtonExample);
