/* @flow */

import * as React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import {
  Paragraph,
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

  state: State;

  render() {
    const { checked } = this.state;
    const { visible, close } = this.props;
    return (
      <Dialog onRequestClose={close} visible={visible}>
        <DialogTitle>Choose an option</DialogTitle>
        <DialogScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
            <View>
              <TouchableRipple onPress={() => this.setState({ checked: 0 })}>
                <View style={styles.row}>
                  <Paragraph>Option 1</Paragraph>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 0} />
                  </View>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => this.setState({ checked: 1 })}>
                <View style={styles.row}>
                  <Paragraph>Option 2</Paragraph>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 1} />
                  </View>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => this.setState({ checked: 2 })}>
                <View style={styles.row}>
                  <Paragraph>Option 3</Paragraph>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 2} />
                  </View>
                </View>
              </TouchableRipple>
              <TouchableRipple onPress={() => this.setState({ checked: 3 })}>
                <View style={styles.row}>
                  <Paragraph>Option 4</Paragraph>
                  <View pointerEvents="none">
                    <RadioButton value="normal" checked={checked === 3} />
                  </View>
                </View>
              </TouchableRipple>
            </View>
          </ScrollView>
        </DialogScrollArea>
        <DialogActions>
          <Button primary onPress={close}>
            Done
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
    justifyContent: 'space-between',
    padding: 8,
    paddingHorizontal: 24,
  },
});
