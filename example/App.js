import React, {
  Component
} from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import {
  Touchable
} from 'react-native-paper';

export default class App extends Component{
  render() {
    return (
      <View style={styles.container}>
        <Touchable
          onPress={() => alert('Pressed')}
          borderLess={false}
          rippleColor="blue">
          <Text>Touchable</Text>
        </Touchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    alignItems: 'center'
  }
});
