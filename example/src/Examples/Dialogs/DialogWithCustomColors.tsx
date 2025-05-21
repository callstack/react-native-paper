import * as React from 'react';

import { Button, Portal, Dialog, Colors } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Portal>
      <Dialog
        onDismiss={close}
        style={{
          backgroundColor: Colors.primary10,
        }}
        visible={visible}
      >
        <Dialog.Title style={{ color: Colors.primary95 }}>Alert</Dialog.Title>
        <Dialog.Content>
          <TextComponent style={{ color: Colors.primary95 }}>
            This is a dialog with custom colors
          </TextComponent>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={Colors.primary95} onPress={close}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWithCustomColors;
