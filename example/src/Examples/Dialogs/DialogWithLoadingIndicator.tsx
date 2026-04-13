import * as React from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { Dialog, MD3Colors, Portal } from 'react-native-paper';

import { TextComponent } from './DialogTextComponent';

const isIOS = Platform.OS === 'ios';

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
            <ActivityIndicator
              color={MD3Colors.tertiary30}
              size={isIOS ? 'large' : 48}
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
