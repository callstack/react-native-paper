import * as React from 'react';
import { ActivityIndicator, Platform, View, StyleSheet } from 'react-native';
import { MD2Colors, Portal, Dialog } from 'react-native-paper';
import { TextComponent } from './utils';

const isIOS = Platform.OS === 'ios';

const DialogWithLoadingIndicator = ({
  visible,
  close,
}: {
  visible: boolean;
  close: () => void;
}) => (
  <Portal>
    <Dialog onDismiss={close} visible={visible}>
      <Dialog.Title>Progress Dialog</Dialog.Title>
      <Dialog.Content>
        <View style={styles.flexing}>
          <ActivityIndicator
            color={MD2Colors.indigo500}
            size={isIOS ? 'large' : 48}
            style={styles.marginRight}
          />
          <TextComponent>Loading.....</TextComponent>
        </View>
      </Dialog.Content>
    </Dialog>
  </Portal>
);

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
