/* @flow */

import * as React from 'react';
import {
  Paragraph,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Colors,
} from 'react-native-paper';

const DialogWithCustomColors = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog
    onDismiss={close}
    style={{ backgroundColor: Colors.purple900 }}
    visible={visible}
  >
    <DialogTitle style={{ color: Colors.white }}>Alert</DialogTitle>
    <DialogContent>
      <Paragraph style={{ color: Colors.white }}>
        This is a dialog with custom colors
      </Paragraph>
    </DialogContent>
    <DialogActions>
      <Button color={Colors.white} onPress={close}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogWithCustomColors;
