/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Paragraph,
  Colors,
  Button,
  RadioButton,
  Dialog,
} from 'react-native-paper';

const isIOS = Platform.OS === 'ios';

export default class DialogExample extends Component {
  static title = 'Dialog';

  state = {
    visible1: false,
    visible2: false,
    visible3: false,
    visible4: false,
    visible5: false,
    checked: 0,
  };

  renderDialogWithLongText = () => {
    const { visible1 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible1: false })}
        visible={visible1}
      >
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.ScrollArea style={{ maxHeight: 220, paddingHorizontal: 0 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
            <Paragraph>
              Material is the metaphor
              {'\n'}
              {'\n'}
              A material metaphor is the unifying theory of a rationalized space
              and a system of motion. The material is grounded in tactile
              reality, inspired by the study of paper and ink, yet
              technologically advanced and open to imagination and magic.
              {'\n'}
              {'\n'}
              Surfaces and edges of the material provide visual cues that are
              grounded in reality. The use of familiar tactile attributes helps
              users quickly understand affordances. Yet the flexibility of the
              material creates new affordances that supersede those in the
              physical world, without breaking the rules of physics.
              {'\n'}
              {'\n'}
              The fundamentals of light, surface, and movement are key to
              conveying how objects move, interact, and exist in space and in
              relation to each other. Realistic lighting shows seams, divides
              space, and indicates moving parts.
            </Paragraph>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button primary onPress={() => this.setState({ visible1: false })}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  renderDialogWithRadioBtns = () => {
    const { visible2, checked } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible2: false })}
        visible={visible2}
      >
        <Dialog.Title>Choose an option</Dialog.Title>
        <Dialog.ScrollArea style={{ maxHeight: 170, paddingHorizontal: 0 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
            <View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 0}
                  onPress={() => this.setState({ checked: 0 })}
                />
                <Paragraph style={{ marginLeft: 16 }}>Option 1</Paragraph>
              </View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 1}
                  onPress={() => this.setState({ checked: 1 })}
                />
                <Paragraph style={{ marginLeft: 16 }}>Option 2</Paragraph>
              </View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 2}
                  onPress={() => this.setState({ checked: 2 })}
                />
                <Paragraph style={{ marginLeft: 16 }}>Option 3</Paragraph>
              </View>
              <View style={styles.checkBoxRow}>
                <RadioButton
                  checked={checked === 3}
                  onPress={() => this.setState({ checked: 3 })}
                />
                <Paragraph style={{ marginLeft: 16 }}>Option 4</Paragraph>
              </View>
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button primary onPress={() => this.setState({ visible2: false })}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  renderDialogWithLoadingIndicator = () => {
    const { visible3 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible3: false })}
        visible={visible3}
      >
        <Dialog.Title>Progress Dialog</Dialog.Title>
        <Dialog.Content>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator
              color={Colors.indigo500}
              size={isIOS ? 'large' : 48}
              style={{ marginRight: 16 }}
            />
            <Paragraph>Loading.....</Paragraph>
          </View>
        </Dialog.Content>
      </Dialog>
    );
  };

  renderUndismissableDialog = () => {
    const { visible4 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible4: false })}
        visible={visible4}
        dismissable={false}
      >
        <Dialog.Title>Alert</Dialog.Title>
        <Dialog.Content>
          <Paragraph>This is an undismissable dialog!!</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button color={Colors.teal500} disabled>
            Disagree
          </Button>
          <Button primary onPress={() => this.setState({ visible4: false })}>
            Agree
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  renderDialogWithCustomColors = () => {
    const { visible5 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible5: false })}
        style={{ backgroundColor: Colors.grey800 }}
        visible={visible5}
      >
        <Dialog.Title color={Colors.white}>Alert</Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{ color: Colors.white }}>
            This is a dialog with custom colors
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            color={Colors.teal500}
            onPress={() => this.setState({ visible5: false })}
          >
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Button primary onPress={() => this.setState({ visible1: true })}>
          Show Dialog with long text
        </Button>
        <Button primary onPress={() => this.setState({ visible2: true })}>
          Show Dialog with radio buttons
        </Button>
        <Button primary onPress={() => this.setState({ visible3: true })}>
          Show Dialog with loading indicator
        </Button>
        <Button primary onPress={() => this.setState({ visible4: true })}>
          Show undismissable Dialog
        </Button>
        <Button primary onPress={() => this.setState({ visible5: true })}>
          Show Dialog with custom colors
        </Button>
        {this.renderDialogWithLongText()}
        {this.renderDialogWithRadioBtns()}
        {this.renderDialogWithLoadingIndicator()}
        {this.renderUndismissableDialog()}
        {this.renderDialogWithCustomColors()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey200,
    padding: 16,
  },
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
});
