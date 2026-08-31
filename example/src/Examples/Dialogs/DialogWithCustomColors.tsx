import { Button, Portal, Dialog, Palette } from 'react-native-paper';

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
          backgroundColor: Palette.primary10,
        }}
        visible={visible}
      >
        <Dialog.Title style={{ color: Palette.primary95 }}>Alert</Dialog.Title>
        <Dialog.Content>
          <TextComponent style={{ color: Palette.primary95 }}>
            This is a dialog with custom colors
          </TextComponent>
        </Dialog.Content>
        <Dialog.Actions>
          <Button textColor={Palette.primary95} onPress={close}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWithCustomColors;
