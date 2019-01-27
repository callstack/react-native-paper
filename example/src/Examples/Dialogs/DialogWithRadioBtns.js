/* @flow */

import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Subheading,
  Button,
  Portal,
  Dialog,
  RadioButton,
  TouchableRipple,
} from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

type State = {
  checked: 'normal' | 'first' | 'second' | 'third' | 'fourth',
};

export default class extends React.Component<Props, State> {
  state = {
    checked: 'normal',
  };

  render() {
    const { checked } = this.state;
    const { visible, close } = this.props;
    return (
      <Portal>
        <Dialog onDismiss={close} visible={visible}>
          <Dialog.Title>Choose an option</Dialog.Title>
          <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
            <ScrollView>
              <View>
                <TouchableRipple
                  onPress={() => this.setState({ checked: 'normal' })}
                >
                  <View style={styles.row}>
                    <View pointerEvents="none">
                      <RadioButton
                        value="normal"
                        status={checked === 'normal' ? 'checked' : 'unchecked'}
                      />
                    </View>
                    <Subheading style={styles.text}>Option 1</Subheading>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => this.setState({ checked: 'second' })}
                >
                  <View style={styles.row}>
                    <View pointerEvents="none">
                      <RadioButton
                        value="second"
                        status={checked === 'second' ? 'checked' : 'unchecked'}
                      />
                    </View>
                    <Subheading style={styles.text}>Option 2</Subheading>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => this.setState({ checked: 'third' })}
                >
                  <View style={styles.row}>
                    <View pointerEvents="none">
                      <RadioButton
                        value="third"
                        status={checked === 'third' ? 'checked' : 'unchecked'}
                      />
                    </View>
                    <Subheading style={styles.text}>Option 3</Subheading>
                  </View>
                </TouchableRipple>
                <TouchableRipple
                  onPress={() => this.setState({ checked: 'fourth' })}
                >
                  <View style={styles.row}>
                    <View pointerEvents="none">
                      <RadioButton
                        value="fourth"
                        status={checked === 'fourth' ? 'checked' : 'unchecked'}
                      />
                    </View>
                    <Subheading style={styles.text}>Option 4</Subheading>
                  </View>
                </TouchableRipple>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={close}>Cancel</Button>
            <Button onPress={close}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  text: {
    paddingLeft: 8,
  },
});
