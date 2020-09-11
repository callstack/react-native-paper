import { Paragraph, Button, Portal, Dialog, Colors } from 'react-native-paper';
import * as React from 'react';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
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
  </Portal>
);

export default DialogWithCustomColors;
