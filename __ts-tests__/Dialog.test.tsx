
import * as React from 'react';
import { View } from 'react-native';
import { Button, Paragraph, Dialog, Portal } from '..';

export default class MyComponent extends React.Component {
  state = {
    visible: false,
  };

  _showDialog = () => this.setState({ visible: true });

  _hideDialog = () => this.setState({ visible: false });

  render() {
    return (
      <View>
        <Button onPress={this._showDialog}>Show Dialog</Button>
        <Portal>
          <Dialog
             visible={this.state.visible}
             onDismiss={this._hideDialog}>
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Paragraph>This is simple dialog</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideDialog}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}
