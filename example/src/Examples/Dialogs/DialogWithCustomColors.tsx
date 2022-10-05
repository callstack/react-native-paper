import * as React from 'react';

import {
  Button,
  Portal,
  Dialog,
  MD2Colors,
  MD3Colors,
} from 'react-native-paper';

import { useExampleTheme } from '../..';
import { TextComponent } from './DialogTextComponent';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  const { isV3 } = useExampleTheme();

  return (
    <Portal>
      <Dialog
        onDismiss={close}
        style={{
          backgroundColor: isV3 ? MD3Colors.primary10 : MD2Colors.purple900,
        }}
        visible={visible}
      >
        <Dialog.Title
          style={{ color: isV3 ? MD3Colors.primary95 : MD2Colors.white }}
        >
          Alert
        </Dialog.Title>
        <Dialog.Content>
          <TextComponent
            style={{ color: isV3 ? MD3Colors.primary95 : MD2Colors.white }}
          >
            This is a dialog with custom colors
          </TextComponent>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            color={isV3 ? MD3Colors.primary95 : MD2Colors.white}
            onPress={close}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DialogWithCustomColors;
