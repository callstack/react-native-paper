import * as React from 'react';

import { Button, Portal, Dialog } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithDismissableBackButton = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog
      onDismiss={close}
      visible={visible}
      dismissable={false}
      dismissableBackButton
    >
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <TextComponent>
          This is an undismissable dialog, however you can use hardware back
          button to close it!
        </TextComponent>
      </Dialog.Content>
      <Dialog.Actions>
        <Button disabled>Disagree</Button>
        <Button onPress={close}>Agree</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogWithDismissableBackButton;
