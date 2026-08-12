import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Button, Portal, Dialog, TextInput } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithTextInput = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const [name, setName] = React.useState('');

  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Title>Dialog with text input</Dialog.Title>
        <Dialog.Content>
          <TextComponent>
            Focus the input below to check that the dialog stays above the
            on-screen keyboard.
          </TextComponent>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={close}>Cancel</Button>
          <Button onPress={close}>Save</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 16,
  },
});

export default DialogWithTextInput;
