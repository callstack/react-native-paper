import { StyleSheet } from 'react-native';

import { Button, Dialog, Palette } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithIcon = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Dialog onDismiss={close} visible={visible}>
      <Dialog.Icon icon="alert" />
      <Dialog.Title style={styles.title}>Dialog with Icon</Dialog.Title>
      <Dialog.Content>
        <TextComponent>
          This is a dialog with new component called DialogIcon. When icon is
          displayed you should center the header.
        </TextComponent>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={close} textColor={Palette.error50}>
          Disagree
        </Button>
        <Button onPress={close}>Agree</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
export default DialogWithIcon;
