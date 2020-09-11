import { Paragraph, Button, Portal, Dialog, Colors } from 'react-native-paper';
import * as React from 'react';

const DialogWithLongText = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog onDismiss={close} visible={visible} dismissable={false}>
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <Paragraph>This is an undismissable dialog!!</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button color={Colors.teal500} disabled>
          Disagree
        </Button>
        <Button onPress={close}>Agree</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogWithLongText;
