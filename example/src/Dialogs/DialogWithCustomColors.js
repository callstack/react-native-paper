/* @flow */

import * as React from 'react';
import { Paragraph, Button, Dialog, Colors } from 'react-native-paper';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog
    onDismiss={close}
    style={{ backgroundColor: Colors.purple900 }}
    visible={visible}
  >
    <Dialog.Title style={{ color: Colors.white }}>Alert</Dialog.Title>
    <Dialog.Content>
      <Paragraph style={{ color: Colors.white }}>
        This is a dialog with custom colors
      </Paragraph>
    </Dialog.Content>
    <Dialog.Actions>
      <Button color={Colors.white} onPress={close}>
        OK
      </Button>
    </Dialog.Actions>
  </Dialog>
);

export default DialogWithCustomColors;
