import React, { useState } from 'react';
import { Button, Dialog, Portal, TextInput } from 'react-native-paper';

const KeyboardAwareDialog = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const [inputVal, setInputVal] = useState('test');

  return (
    <Portal>
      <Dialog keyboardAware={true} visible={visible} onDismiss={close}>
        <Dialog.Title>Username</Dialog.Title>
        <Dialog.Content>
          <TextInput
            value={inputVal}
            onChangeText={text => setInputVal(text)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={close}>Done</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default KeyboardAwareDialog;
