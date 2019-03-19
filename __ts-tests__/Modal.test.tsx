
import * as React from 'react';
import { Modal, Portal, Text, Button, Provider } from '..';

export default class MyComponent extends React.Component {
  state = {
    visible: false,
  };

  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  render() {
    const { visible } = this.state;
    return (
      <Portal>
        <Modal visible={visible} onDismiss={this._hideModal}>
          <Text>Example Modal</Text>
        </Modal>
        <Button
          style={{ marginTop: 30 }}
          onPress={this._showModal}
        >
          Show
        </Button>
      </Portal>
    );
  }
}
