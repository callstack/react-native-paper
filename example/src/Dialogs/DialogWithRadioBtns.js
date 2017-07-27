/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Paragraph, Button, Dialog, RadioButton } from 'react-native-paper';

type Props = {
  visible: boolean,
  close: Function,
};

type State = {
  checked: number,
};

export default class extends Component<void, Props, State> {
  static propTypes = {
    visible: PropTypes.bool,
    close: PropTypes.func,
  };
  state = {
    checked: 0,
  };

  state: State;

  render() {
    const { checked } = this.state;
    const { visible, close } = this.props;
    return (
      <Dialog onRequestClose={close} visible={visible}>
        <Dialog.Title>Choose an option</Dialog.Title>
        <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
            <View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 0}
                  onPress={() => this.setState({ checked: 0 })}
                />
                <Paragraph style={styles.paragraph}>Option 1</Paragraph>
              </View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 1}
                  onPress={() => this.setState({ checked: 1 })}
                />
                <Paragraph style={styles.paragraph}>Option 2</Paragraph>
              </View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 2}
                  onPress={() => this.setState({ checked: 2 })}
                />
                <Paragraph style={styles.paragraph}>Option 3</Paragraph>
              </View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 3}
                  onPress={() => this.setState({ checked: 3 })}
                />
                <Paragraph style={styles.paragraph}>Option 4</Paragraph>
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button primary onPress={close}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  }
}

const styles = StyleSheet.create({
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  paragraph: { marginLeft: 16 },
});
