
import * as React from 'react';
import { ScrollView } from 'react-native';
import { Dialog, Portal } from '..';

export default class MyComponent extends React.Component {
  state = {
    visible: false,
  };

  _hideDialog = () => this.setState({ visible: false });

  render() {
    return (
      <Portal>
        <Dialog
          visible={this.state.visible}
          onDismiss={this._hideDialog}>
          <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
              This is a scrollable area
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  }
}
