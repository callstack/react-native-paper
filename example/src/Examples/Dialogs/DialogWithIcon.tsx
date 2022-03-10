import * as React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  Portal,
  Dialog,
  MD2Colors,
  MD3Colors,
  useTheme,
} from 'react-native-paper';
import { TextComponent } from './utils';

const DialogWithIcon = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const theme = useTheme();

  return (
    <Portal>
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
          <Button
            onPress={close}
            color={theme.isV3 ? MD3Colors.error50 : MD2Colors.teal500}
          >
            Disagree
          </Button>
          <Button onPress={close}>Agree</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
});
export default DialogWithIcon;
