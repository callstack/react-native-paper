/* @flow */

import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Subheading,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogScrollArea,
  RadioButton,
  TouchableRipple,
} from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

type State = {
  checked: number,
};

export default class extends React.Component<Props, State> {
  state = {
    checked: 0,
  };

  render() {
    const { checked } = this.state;
    const { visible, close } = this.props;
    return (
      <Dialog onDismiss={close} visible={visible}>
        <DialogTitle>Choose an option</DialogTitle>
        <DialogScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
          <ScrollView>
            <View>
              <TouchableRipple onPress={() => this.setState({ checked: 0 })}>
                <View style={styles.row}>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 0} />
                  </View>
                  <Subheading style={styles.text}>Option 1</Subheading>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => this.setState({ checked: 1 })}>
                <View style={styles.row}>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 1} />
                  </View>
                  <Subheading style={styles.text}>Option 2</Subheading>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => this.setState({ checked: 2 })}>
                <View style={styles.row}>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 2} />
                  </View>
                  <Subheading style={styles.text}>Option 3</Subheading>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => this.setState({ checked: 3 })}>
                <View style={styles.row}>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 3} />
                  </View>
                  <Subheading style={styles.text}>Option 4</Subheading>
                </View>
              </TouchableRipple>
            </View>
          </ScrollView>
        </DialogScrollArea>
        <DialogActions>
          <Button primary onPress={close}>
            Cancel
          </Button>
          <Button primary onPress={close}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
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
