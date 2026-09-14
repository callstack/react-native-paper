import { Button, Portal, Dialog, Palette } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithUndismissableBackButton = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog onDismiss={close} visible={visible} dismissableBackButton={false}>
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <TextComponent>
          This dialog can be dismissed by tapping outside, however the hardware
          back button will not close it!
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

export default DialogWithUndismissableBackButton;
