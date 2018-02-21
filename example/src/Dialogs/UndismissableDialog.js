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

const DialogWithLongText = ({
  visible,
  close,
}: {
  visible: boolean,
  close: Function,
}) => (
  <Dialog onDismiss={close} visible={visible} dismissable={false}>
    <DialogTitle>Alert</DialogTitle>
    <DialogContent>
      <Paragraph>This is an undismissable dialog!!</Paragraph>
    </DialogContent>
    <DialogActions>
      <Button color={Colors.teal500} disabled>
        Disagree
      </Button>
      <Button primary onPress={close}>
        Agree
      </Button>
    </DialogActions>
  </Dialog>
);

export default DialogWithLongText;
