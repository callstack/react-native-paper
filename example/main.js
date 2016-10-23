import Exponent from 'exponent';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  TouchableRipple,
} from 'react-native-paper';

class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableRipple
          borderLess={false}
          rippleColor='blue'
        >
          <Text>TouchableRipple</Text>
        </TouchableRipple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    alignItems: 'center',
  },
});

Exponent.registerRootComponent(App);
