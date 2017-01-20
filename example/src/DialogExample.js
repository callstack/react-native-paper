/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  Paragraph,
  Colors,
  Button,
  Card,
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
        title='Alert'
        visible={visible1}
      >
        <Paragraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
        </Paragraph>
        <Card.Actions>
          <Button primary onPress={() => this.setState({ visible1: false })}>OK</Button>
        </Card.Actions>
      </Dialog>
    );
  }

  renderDialogWithRadioBtns = () => {
    const { visible2, checked } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible2: false })}
        title='Choose an option'
        visible={visible2}
      >
        <View style={styles.checkBoxRow}>
          <Paragraph>Option 1</Paragraph>
          <RadioButton
            checked={checked === 0}
            onPress={() => this.setState({ checked: 0 })}
          />
        </View>
        <View style={styles.checkBoxRow}>
          <Paragraph>Option 2</Paragraph>
          <RadioButton
            checked={checked === 1}
            onPress={() => this.setState({ checked: 1 })}
          />
        </View>
        <View style={styles.checkBoxRow}>
          <Paragraph>Option 3</Paragraph>
          <RadioButton
            checked={checked === 2}
            onPress={() => this.setState({ checked: 2 })}
          />
        </View>
        <Card.Actions>
          <Button primary onPress={() => this.setState({ visible2: false })}>Done</Button>
        </Card.Actions>
      </Dialog>
    );
  }

  renderDialogWithLoadingIndicator = () => {
    const { visible3 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible3: false })}
        title='Alert'
        visible={visible3}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
          <ActivityIndicator
            color={Colors.indigo500}
            size={isIOS ? 'large' : 48}
            style={{ marginRight: 16 }}
          />
          <Paragraph>Loading.....</Paragraph>
        </View>
      </Dialog>
    );
  }

  renderUndismissableDialog = () => {
    const { visible4 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible4: false })}
        title='Alert'
        visible={visible4}
        dismissable={false}
      >
        <Paragraph>This is an undismissable dialog!!</Paragraph>
        <Card.Actions>
          <Button primary onPress={() => this.setState({ visible4: false })}>Done</Button>
        </Card.Actions>
      </Dialog>
    );
  }

  renderDialogWithCustomColors = () => {
    const { visible5 } = this.state;
    return (
      <Dialog
        onRequestClose={() => this.setState({ visible5: false })}
        title='Alert'
        titleColor={Colors.white}
        style={{ backgroundColor: Colors.grey800 }}
        visible={visible5}
      >
        <Paragraph style={{ color: Colors.white }}>This is a dialog with custom colors</Paragraph>
        <Card.Actions>
          <Button color={Colors.teal500} onPress={() => this.setState({ visible5: false })}>Done</Button>
        </Card.Actions>
      </Dialog>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Button primary onPress={() => this.setState({ visible1: true })}>Show Dialog with long text</Button>
        <Button primary onPress={() => this.setState({ visible2: true })}>Show Dialog with radio buttons</Button>
        <Button primary onPress={() => this.setState({ visible3: true })}>Show Dialog with loading indicator</Button>
        <Button primary onPress={() => this.setState({ visible4: true })}>Show undismissable Dialog</Button>
        <Button primary onPress={() => this.setState({ visible5: true })}>Show Dialog with custom colors</Button>
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
    padding: 4,
  },
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
});
