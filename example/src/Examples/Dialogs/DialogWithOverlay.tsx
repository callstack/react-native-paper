import { Button, Portal, Dialog, Palette } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithOverlay = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal overlay={visible}>
    <Dialog onDismiss={close} visible={visible}>
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <TextComponent>
          While this dialog is open, everything behind it is hidden from screen
          readers and skipped by the focus order!
        </TextComponent>
      </Dialog.Content>
      <Dialog.Actions>
        <Button textColor={Palette.tertiary50} disabled>
          Disagree
        </Button>
        <Button onPress={close}>Agree</Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default DialogWithOverlay;
