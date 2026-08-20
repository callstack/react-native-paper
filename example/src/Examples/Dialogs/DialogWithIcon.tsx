import { Button, Portal, Dialog, Palette } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithIcon = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Icon icon="alert" />
        <Dialog.Title>Dialog with Icon</Dialog.Title>
        <Dialog.Content>
          <TextComponent>
            This is a dialog with a component called DialogIcon. When the icon
            is displayed, the title is centered automatically.
          </TextComponent>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={close} textColor={Palette.error50}>
            Disagree
          </Button>
          <Button onPress={close}>Agree</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWithIcon;
