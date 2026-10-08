import { Button, Dialog, Palette } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithUndismissableOverlay = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Dialog onDismiss={close} visible={visible} dismissableOverlay={false}>
    <Dialog.Title>Alert</Dialog.Title>
    <Dialog.Content>
      <TextComponent>
        Tapping outside will not close this dialog, however you can still close
        it with the back button or the Escape key!
      </TextComponent>
    </Dialog.Content>
    <Dialog.Actions>
      <Button textColor={Palette.tertiary50} disabled>
        Disagree
      </Button>
      <Button onPress={close}>Agree</Button>
    </Dialog.Actions>
  </Dialog>
);

export default DialogWithUndismissableOverlay;
