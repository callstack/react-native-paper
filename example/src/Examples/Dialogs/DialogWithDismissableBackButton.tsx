import * as React from 'react';

import { Button, Portal, Dialog, Palette } from 'react-native-paper';

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
        <Button textColor={Palette.tertiary50} disabled label="Disagree" />
        <Button onPress={close} label="Agree" />
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogWithDismissableBackButton;
