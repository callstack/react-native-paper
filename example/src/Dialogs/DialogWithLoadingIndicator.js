/* @flow */

import * as React from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import {
  Paragraph,
  Colors,
  Dialog,
  DialogTitle,
  DialogContent,
} from 'react-native-paper';

const isIOS = Platform.OS === 'ios';

const DialogWithLoadingIndicator = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog onDismiss={close} visible={visible}>
    <DialogTitle>Progress Dialog</DialogTitle>
    <DialogContent>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ActivityIndicator
          color={Colors.indigo500}
          size={isIOS ? 'large' : 48}
          style={{ marginRight: 16 }}
        />
        <Paragraph>Loading.....</Paragraph>
      </View>
    </DialogContent>
  </Dialog>
);

export default DialogWithLoadingIndicator;
