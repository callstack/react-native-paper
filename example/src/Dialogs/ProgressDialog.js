/* @flow */

import * as React from 'react';
import { Platform } from 'react-native';
import { Dialog, Colors } from 'react-native-paper';

const isIOS = Platform.OS === 'ios';

const ProgressDialogExample = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  // $FlowFixMe
  <Dialog.Progress
    color={Colors.indigo500}
    onDismiss={close}
    visible={visible}
    size={isIOS ? 'large' : 48}
    text="Loading....."
    title="Progress Dialog"
  />
);

export default ProgressDialogExample;
