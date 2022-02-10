import * as React from 'react';
import {
  Paragraph,
  Button,
  Portal,
  Dialog,
  MD2Colors,
} from 'react-native-paper';

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
      style={{ backgroundColor: MD2Colors.purple900 }}
      visible={visible}
    >
      <Dialog.Title style={{ color: MD2Colors.white }}>Alert</Dialog.Title>
      <Dialog.Content>
        <Paragraph style={{ color: MD2Colors.white }}>
          This is a dialog with custom colors
        </Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color={MD2Colors.white} onPress={close}>
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogWithCustomColors;
