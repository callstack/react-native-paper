import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  CircularProgressIndicator,
  Dialog,
  Palette,
  Portal,
} from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const DialogWithLoadingIndicator = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => {
  return (
    <Portal>
      <Dialog onDismiss={close} visible={visible}>
        <Dialog.Title>Progress Dialog</Dialog.Title>
        <Dialog.Content>
          <View style={styles.flexing}>
            <CircularProgressIndicator
              indeterminate
              color={Palette.tertiary30}
              style={styles.marginRight}
            />
            <TextComponent>Loading.....</TextComponent>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginRight: {
    marginRight: 16,
  },
});

export default DialogWithLoadingIndicator;
